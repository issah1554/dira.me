#!/usr/bin/env python3
"""Create an idempotent Supabase SQL import from the legacy Cash Book SQLite DB."""

import argparse
import json
import sqlite3
import uuid
from datetime import datetime, timezone
from pathlib import Path

SOURCE = "android_cashbook"
NAMESPACE = uuid.UUID("58ea7308-999a-4de8-a270-d630a52734f2")
ACCOUNT_ALIASES = {
    "aggrey": "Cash Account",
    "cash book": "Cash Account",
    "madeni": "Cash Account",
    "matumizi boom la pili": "Cash Account",
    "stephen na antony": "Cash Account",
    "stephen nziku": "Cash Account",
}


def sql_text(value):
    if value is None:
        return "NULL"
    return "'" + str(value).replace("'", "''") + "'"


def sql_json(value):
    return sql_text(json.dumps(value, ensure_ascii=False, separators=(",", ":"))) + "::jsonb"


def iso_from_millis(value):
    return datetime.fromtimestamp(value / 1000, tz=timezone.utc).isoformat().replace("+00:00", "Z")


def stable_id(user_id, kind, position, row):
    # New UUIDs are deterministic for safe reruns but expose no legacy ID.
    payload = json.dumps(row, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
    return str(uuid.uuid5(NAMESPACE, f"{user_id}:{kind}:{position}:{payload}"))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("database", nargs="?", default="cashbook.db")
    parser.add_argument("--output", default="supabase/cashbook_import.sql")
    parser.add_argument("--user-id", required=True, help="Supabase auth.users UUID")
    args = parser.parse_args()

    connection = sqlite3.connect(f"file:{Path(args.database).resolve()}?mode=ro", uri=True)
    connection.row_factory = sqlite3.Row
    source_accounts = [dict(row) for row in connection.execute("SELECT _id, name FROM accounts ORDER BY _id")]
    accounts = [
        account for account in source_accounts
        if account["name"].strip().lower() not in ACCOUNT_ALIASES
    ]
    transactions = [dict(row) for row in connection.execute("SELECT * FROM cashTransaction ORDER BY id")]

    user_id = str(uuid.UUID(args.user_id))
    lines = [
        "-- Generated from cashbook.db. Apply the legacy-fields migration first.",
        "BEGIN;",
        "",
    ]

    for position, account in enumerate(accounts, 1):
        latest = connection.execute(
            "SELECT MAX(date) FROM cashTransaction WHERE accounts = ?", (account["name"],)
        ).fetchone()[0]
        latest_date = iso_from_millis(latest)[:10] if latest is not None else None
        lines.extend([
            "INSERT INTO public.accounts",
            "  (id, user_id, name, type, currency, opening_balance, current_balance, status, description, last_transaction, legacy_source, legacy_data)",
            "VALUES",
            f"  ({sql_text(stable_id(user_id, 'account', position, {'name': account['name']}))}::uuid, {sql_text(user_id)}::uuid, {sql_text(account['name'])}, 'cash', 'TZS', 0, 0, 'active', 'Imported from Cash Book', {sql_text(latest_date)}::date, {sql_text(SOURCE)}, {sql_json({'name': account['name']})})",
            "ON CONFLICT (id) DO UPDATE SET",
            "  name = EXCLUDED.name, legacy_data = EXCLUDED.legacy_data;",
            "",
        ])

    for position, tx in enumerate(transactions, 1):
        cash_in = tx["cash_in"]
        cash_out = tx["cash_out"]
        is_income = cash_in > 0
        amount = cash_in if is_income else cash_out
        tx_type = "income" if is_income else "expense"
        dc = "cr" if is_income else "dr"
        timestamp = iso_from_millis(tx["date"])
        account_name = tx["accounts"] or ""
        account_name = ACCOUNT_ALIASES.get(account_name.strip().lower(), account_name)
        audit_tx = {key: value for key, value in tx.items() if key != "id"}
        lines.extend([
            "INSERT INTO public.transactions",
            "  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)",
            "VALUES",
            f"  ({sql_text(stable_id(user_id, 'transaction', position, audit_tx))}::uuid, {sql_text(user_id)}::uuid, {sql_text(timestamp)}::timestamptz, {amount}, {sql_text(tx_type)}, {sql_text(dc)}, {sql_text(account_name)}, 'TZS', {sql_text(tx['notes'] or '')}, '', 'completed', {sql_text(timestamp)}::timestamptz, {sql_text(timestamp)}::timestamptz, {sql_text(SOURCE)}, {cash_in}, {cash_out}, {tx['balance']}, {sql_text(tx['bill'])}, {sql_json(audit_tx)})",
            "ON CONFLICT (id) DO UPDATE SET",
            "  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,",
            "  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,",
            "  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,",
            "  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;",
            "",
        ])

    lines.extend([
        "COMMIT;",
        "",
        "-- Expected: 0 imported accounts, 95 transactions, cash in 753850, cash out 518900.",
        f"SELECT count(*) AS imported_accounts FROM public.accounts WHERE user_id = {sql_text(user_id)}::uuid AND legacy_source = {sql_text(SOURCE)};",
        f"SELECT count(*) AS imported_transactions, sum(legacy_cash_in) AS cash_in, sum(legacy_cash_out) AS cash_out FROM public.transactions WHERE user_id = {sql_text(user_id)}::uuid AND legacy_source = {sql_text(SOURCE)};",
    ])
    Path(args.output).write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"Wrote {args.output}: {len(accounts)} accounts and {len(transactions)} transactions")


if __name__ == "__main__":
    main()
