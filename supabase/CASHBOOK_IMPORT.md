# Cash Book backup import

This import maps `cashbook.db` into the app's existing Supabase `accounts` and
`transactions` tables without discarding legacy fields.

1. Apply `migrations/20260830000000_add_legacy_import_fields.sql` in the
   Supabase SQL editor.
2. Find the destination user's UUID in Supabase Authentication > Users.
3. Generate the import:

   ```sh
   python3 scripts/export-cashbook-to-supabase.py --user-id USER_UUID
   ```

4. Run `cashbook_import.sql` in the Supabase SQL editor.
5. Confirm its final queries return 0 imported accounts, 95 transactions, cash in
   753850, and cash out 518900.

The import creates new deterministic Supabase UUIDs, so it is safe to rerun
without duplicates. The old numeric IDs are intentionally not imported because
they have no relational role. Transactions retain their relationship to an
account through the original account name, matching the app's current data
model. All other SQLite values are retained in `legacy_data`; individual legacy
money and bill fields are also queryable as columns.

`Cash Book`, `madeni`, `Aggrey`, `Stephen Nziku`, and `Stephen na Antony` are
treated as aliases of the existing `Cash Account`. Their transactions are
assigned to `Cash Account`, and no duplicate accounts are created.

`matumizi boom la pili` is treated as an alias of the existing `Cash Account`,
so all 78 of its transactions are assigned to `Cash Account`.
