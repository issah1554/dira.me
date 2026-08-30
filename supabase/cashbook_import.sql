-- Generated from cashbook.db. Apply the legacy-fields migration first.
BEGIN;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('66f27576-0a24-58e8-8428-151d67e226e2'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2023-01-01T10:42:49Z'::timestamptz, 6000.0, 'income', 'cr', 'Cash Account', 'TZS', 'baba matumizi
Airtel money', '', 'completed', '2023-01-01T10:42:49Z'::timestamptz, '2023-01-01T10:42:49Z'::timestamptz, 'android_cashbook', 6000.0, 0.0, 0.0, NULL, '{"date":1672569769000,"cash_out":0.0,"cash_in":6000.0,"balance":0.0,"notes":"baba matumizi\nAirtel money","bill":null,"accounts":"Cash Book"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('0bb073b2-3982-5624-92fb-d10d5111fbdb'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2023-01-01T11:45:42Z'::timestamptz, 500.0, 'expense', 'dr', 'Cash Account', 'TZS', 'makato ya lipa', '', 'completed', '2023-01-01T11:45:42Z'::timestamptz, '2023-01-01T11:45:42Z'::timestamptz, 'android_cashbook', 0.0, 500.0, 0.0, NULL, '{"date":1672573542000,"cash_out":500.0,"cash_in":0.0,"balance":0.0,"notes":"makato ya lipa","bill":null,"accounts":"Cash Book"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('96312f6a-2304-53af-b406-341951859292'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2023-01-01T11:51:29Z'::timestamptz, 1000.0, 'expense', 'dr', 'Cash Account', 'TZS', 'nauli', '', 'completed', '2023-01-01T11:51:29Z'::timestamptz, '2023-01-01T11:51:29Z'::timestamptz, 'android_cashbook', 0.0, 1000.0, 0.0, NULL, '{"date":1672573889000,"cash_out":1000.0,"cash_in":0.0,"balance":0.0,"notes":"nauli","bill":null,"accounts":"Cash Book"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('fbd96aff-1244-57ee-ac5c-c996bdf13d14'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2023-01-01T12:48:48Z'::timestamptz, 50.0, 'income', 'cr', 'Cash Account', 'TZS', 'ilikuwepo', '', 'completed', '2023-01-01T12:48:48Z'::timestamptz, '2023-01-01T12:48:48Z'::timestamptz, 'android_cashbook', 50.0, 0.0, 0.0, NULL, '{"date":1672577328000,"cash_out":0.0,"cash_in":50.0,"balance":0.0,"notes":"ilikuwepo","bill":null,"accounts":"Cash Book"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('a6ca14dc-e222-5274-8903-8a914c28c8a0'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2023-01-01T13:49:16Z'::timestamptz, 300.0, 'income', 'cr', 'Cash Account', 'TZS', 'ilikuwepo kwenye kadi ya kivukoni', '', 'completed', '2023-01-01T13:49:16Z'::timestamptz, '2023-01-01T13:49:16Z'::timestamptz, 'android_cashbook', 300.0, 0.0, 0.0, NULL, '{"date":1672580956000,"cash_out":0.0,"cash_in":300.0,"balance":0.0,"notes":"ilikuwepo kwenye kadi ya kivukoni","bill":null,"accounts":"Cash Book"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('be527af4-7ab4-5158-935a-e60b09958b34'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2023-01-01T12:51:28Z'::timestamptz, 1000.0, 'expense', 'dr', 'Cash Account', 'TZS', 'vocha', '', 'completed', '2023-01-01T12:51:28Z'::timestamptz, '2023-01-01T12:51:28Z'::timestamptz, 'android_cashbook', 0.0, 1000.0, 0.0, NULL, '{"date":1672577488000,"cash_out":1000.0,"cash_in":0.0,"balance":0.0,"notes":"vocha","bill":null,"accounts":"Cash Book"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('3a9cd4a8-15a4-5065-b800-069f6e969886'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-05-30T16:19:06Z'::timestamptz, 300000.0, 'income', 'cr', 'Cash Account', 'TZS', 'Opening Balance', '', 'completed', '2024-05-30T16:19:06Z'::timestamptz, '2024-05-30T16:19:06Z'::timestamptz, 'android_cashbook', 300000.0, 0.0, 0.0, NULL, '{"date":1717085946000,"cash_out":0.0,"cash_in":300000.0,"balance":0.0,"notes":"Opening Balance","bill":null,"accounts":"Stephen Nziku"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('090ec38f-a6f3-5e24-8ef4-4b20bcb0b69c'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-05-28T06:20:01Z'::timestamptz, 300000.0, 'income', 'cr', 'Cash Account', 'TZS', 'boom ma', '', 'completed', '2024-05-28T06:20:01Z'::timestamptz, '2024-05-28T06:20:01Z'::timestamptz, 'android_cashbook', 300000.0, 0.0, 0.0, NULL, '{"date":1716877201000,"cash_out":0.0,"cash_in":300000.0,"balance":0.0,"notes":"boom ma","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('6706a945-62dc-5727-ba84-67f5dd0e9619'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-05-28T06:35:37Z'::timestamptz, 1500.0, 'expense', 'dr', 'Cash Account', 'TZS', 'chai mm na Hassan', '', 'completed', '2024-05-28T06:35:37Z'::timestamptz, '2024-05-28T06:35:37Z'::timestamptz, 'android_cashbook', 0.0, 1500.0, 0.0, NULL, '{"date":1716878137000,"cash_out":1500.0,"cash_in":0.0,"balance":0.0,"notes":"chai mm na Hassan","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('81fc0c61-23cd-55f8-b37d-0a92235a2069'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-05-28T13:15:40Z'::timestamptz, 32000.0, 'expense', 'dr', 'Cash Account', 'TZS', 'Paid Shabilu', '', 'completed', '2024-05-28T13:15:40Z'::timestamptz, '2024-05-28T13:15:40Z'::timestamptz, 'android_cashbook', 0.0, 32000.0, 0.0, NULL, '{"date":1716902140000,"cash_out":32000.0,"cash_in":0.0,"balance":0.0,"notes":"Paid Shabilu","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('dd3e38aa-204e-527c-9059-c7b6b2df7380'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-05-28T16:25:14Z'::timestamptz, 80000.0, 'expense', 'dr', 'Cash Account', 'TZS', 'Paid Antony', '', 'completed', '2024-05-28T16:25:14Z'::timestamptz, '2024-05-28T16:25:14Z'::timestamptz, 'android_cashbook', 0.0, 80000.0, 0.0, NULL, '{"date":1716913514000,"cash_out":80000.0,"cash_in":0.0,"balance":0.0,"notes":"Paid Antony","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('e60f072e-e337-5ce3-87b9-2a7a65f14dbf'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-05-28T16:26:21Z'::timestamptz, 70000.0, 'expense', 'dr', 'Cash Account', 'TZS', 'Food [mchele]', '', 'completed', '2024-05-28T16:26:21Z'::timestamptz, '2024-05-28T16:26:21Z'::timestamptz, 'android_cashbook', 0.0, 70000.0, 0.0, NULL, '{"date":1716913581000,"cash_out":70000.0,"cash_in":0.0,"balance":0.0,"notes":"Food [mchele]","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('44f72fbf-4ba2-5bed-aeb1-1aaa867de93c'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-05-29T17:29:52Z'::timestamptz, 10000.0, 'expense', 'dr', 'Cash Account', 'TZS', 'Umeme', '', 'completed', '2024-05-29T17:29:52Z'::timestamptz, '2024-05-29T17:29:52Z'::timestamptz, 'android_cashbook', 0.0, 10000.0, 0.0, NULL, '{"date":1717003792000,"cash_out":10000.0,"cash_in":0.0,"balance":0.0,"notes":"Umeme","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('c357dbbe-0340-5929-b75f-cd471b4df197'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-05-28T19:05:58Z'::timestamptz, 5000.0, 'expense', 'dr', 'Cash Account', 'TZS', 'M-pesa', '', 'completed', '2024-05-28T19:05:58Z'::timestamptz, '2024-05-28T19:05:58Z'::timestamptz, 'android_cashbook', 0.0, 5000.0, 0.0, NULL, '{"date":1716923158000,"cash_out":5000.0,"cash_in":0.0,"balance":0.0,"notes":"M-pesa","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('b66ff3b3-674d-5d0b-aeb1-c5397aab5702'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-05-28T17:05:44Z'::timestamptz, 19500.0, 'expense', 'dr', 'Cash Account', 'TZS', 'Unga 15Kg', '', 'completed', '2024-05-28T17:05:44Z'::timestamptz, '2024-05-28T17:05:44Z'::timestamptz, 'android_cashbook', 0.0, 19500.0, 0.0, NULL, '{"date":1716915944000,"cash_out":19500.0,"cash_in":0.0,"balance":0.0,"notes":"Unga 15Kg","bill":null,"accounts":"Stephen na Antony"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('9b8d500c-7738-5110-8a4b-8053cea0a13d'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-05-28T16:38:47Z'::timestamptz, 14000.0, 'expense', 'dr', 'Cash Account', 'TZS', 'Sukari 5Kg', '', 'completed', '2024-05-28T16:38:47Z'::timestamptz, '2024-05-28T16:38:47Z'::timestamptz, 'android_cashbook', 0.0, 14000.0, 0.0, NULL, '{"date":1716914327000,"cash_out":14000.0,"cash_in":0.0,"balance":0.0,"notes":"Sukari 5Kg","bill":null,"accounts":"Stephen na Antony"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('6943a9a2-2b54-5191-bf7e-26b858ace9c2'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-05-28T17:07:00Z'::timestamptz, 27500.0, 'expense', 'dr', 'Cash Account', 'TZS', 'Mafuta 5L', '', 'completed', '2024-05-28T17:07:00Z'::timestamptz, '2024-05-28T17:07:00Z'::timestamptz, 'android_cashbook', 0.0, 27500.0, 0.0, NULL, '{"date":1716916020000,"cash_out":27500.0,"cash_in":0.0,"balance":0.0,"notes":"Mafuta 5L","bill":null,"accounts":"Stephen na Antony"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('999f5ca0-463c-5a2c-8371-72aee40527a1'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-05-28T17:08:14Z'::timestamptz, 9600.0, 'expense', 'dr', 'Cash Account', 'TZS', 'Sabuni ya unga 4Kg', '', 'completed', '2024-05-28T17:08:14Z'::timestamptz, '2024-05-28T17:08:14Z'::timestamptz, 'android_cashbook', 0.0, 9600.0, 0.0, NULL, '{"date":1716916094000,"cash_out":9600.0,"cash_in":0.0,"balance":0.0,"notes":"Sabuni ya unga 4Kg","bill":null,"accounts":"Stephen na Antony"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('5dd0b422-8d8e-512a-8aa7-1fad5d7ccbd6'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-05-30T16:44:27Z'::timestamptz, 10500.0, 'expense', 'dr', 'Cash Account', 'TZS', 'Sabuni ya kipande 3Bars', '', 'completed', '2024-05-30T16:44:27Z'::timestamptz, '2024-05-30T16:44:27Z'::timestamptz, 'android_cashbook', 0.0, 10500.0, 0.0, NULL, '{"date":1717087467000,"cash_out":10500.0,"cash_in":0.0,"balance":0.0,"notes":"Sabuni ya kipande 3Bars","bill":null,"accounts":"Stephen na Antony"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('0962d522-5e8b-57b6-8f26-e54ee7572738'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-05-29T14:46:26Z'::timestamptz, 10000.0, 'expense', 'dr', 'Cash Account', 'TZS', 'Pazia', '', 'completed', '2024-05-29T14:46:26Z'::timestamptz, '2024-05-29T14:46:26Z'::timestamptz, 'android_cashbook', 0.0, 10000.0, 0.0, NULL, '{"date":1716993986000,"cash_out":10000.0,"cash_in":0.0,"balance":0.0,"notes":"Pazia","bill":null,"accounts":"Stephen na Antony"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('0983cc8b-59ee-519c-85b7-4a9b1fdd7133'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-05-28T16:49:51Z'::timestamptz, 20000.0, 'expense', 'dr', 'Cash Account', 'TZS', 'Kiti', '', 'completed', '2024-05-28T16:49:51Z'::timestamptz, '2024-05-28T16:49:51Z'::timestamptz, 'android_cashbook', 0.0, 20000.0, 0.0, NULL, '{"date":1716914991000,"cash_out":20000.0,"cash_in":0.0,"balance":0.0,"notes":"Kiti","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('88cf1bee-cce7-589f-8977-81164fa73828'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-05-28T16:51:21Z'::timestamptz, 45500.0, 'expense', 'dr', 'Cash Account', 'TZS', 'mimi na Tony', '', 'completed', '2024-05-28T16:51:21Z'::timestamptz, '2024-05-28T16:51:21Z'::timestamptz, 'android_cashbook', 0.0, 45500.0, 0.0, NULL, '{"date":1716915081000,"cash_out":45500.0,"cash_in":0.0,"balance":0.0,"notes":"mimi na Tony","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('447950d5-e00e-5a09-b614-835802f9fc3d'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-05-30T04:15:40Z'::timestamptz, 1200.0, 'expense', 'dr', 'Cash Account', 'TZS', 'nauli', '', 'completed', '2024-05-30T04:15:40Z'::timestamptz, '2024-05-30T04:15:40Z'::timestamptz, 'android_cashbook', 0.0, 1200.0, 0.0, NULL, '{"date":1717042540000,"cash_out":1200.0,"cash_in":0.0,"balance":0.0,"notes":"nauli","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('b7157a9e-8ca3-5457-996f-7dafb445e8a3'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-05-30T10:20:18Z'::timestamptz, 2000.0, 'expense', 'dr', 'Cash Account', 'TZS', 'Lunch kisutu', '', 'completed', '2024-05-30T10:20:18Z'::timestamptz, '2024-05-30T10:20:18Z'::timestamptz, 'android_cashbook', 0.0, 2000.0, 0.0, NULL, '{"date":1717064418000,"cash_out":2000.0,"cash_in":0.0,"balance":0.0,"notes":"Lunch kisutu","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('e6d59f3b-a6e0-5d9c-ba50-74f751f12436'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-05-30T10:25:03Z'::timestamptz, 1000.0, 'expense', 'dr', 'Cash Account', 'TZS', 'kitambaa', '', 'completed', '2024-05-30T10:25:03Z'::timestamptz, '2024-05-30T10:25:03Z'::timestamptz, 'android_cashbook', 0.0, 1000.0, 0.0, NULL, '{"date":1717064703000,"cash_out":1000.0,"cash_in":0.0,"balance":0.0,"notes":"kitambaa","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('1415af85-e1ef-52e6-b2ff-51977b53ed53'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-05-30T10:25:46Z'::timestamptz, 1000.0, 'expense', 'dr', 'Cash Account', 'TZS', 'M-pesa', '', 'completed', '2024-05-30T10:25:46Z'::timestamptz, '2024-05-30T10:25:46Z'::timestamptz, 'android_cashbook', 0.0, 1000.0, 0.0, NULL, '{"date":1717064746000,"cash_out":1000.0,"cash_in":0.0,"balance":0.0,"notes":"M-pesa","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('e13c1a22-0f89-5eb4-9cac-a98a1eead6fb'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-05-29T05:55:56Z'::timestamptz, 2500.0, 'expense', 'dr', 'Cash Account', 'TZS', 'Madaftari 2', '', 'completed', '2024-05-29T05:55:56Z'::timestamptz, '2024-05-29T05:55:56Z'::timestamptz, 'android_cashbook', 0.0, 2500.0, 0.0, NULL, '{"date":1716962156000,"cash_out":2500.0,"cash_in":0.0,"balance":0.0,"notes":"Madaftari 2","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('cd524cff-fd26-5582-a5b6-92a661901ebc'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-05-29T17:57:23Z'::timestamptz, 1200.0, 'expense', 'dr', 'Cash Account', 'TZS', 'Soda', '', 'completed', '2024-05-29T17:57:23Z'::timestamptz, '2024-05-29T17:57:23Z'::timestamptz, 'android_cashbook', 0.0, 1200.0, 0.0, NULL, '{"date":1717005443000,"cash_out":1200.0,"cash_in":0.0,"balance":0.0,"notes":"Soda","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('95ca6f84-b6fc-507f-8e9e-7f55a1264866'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-05-29T05:25:25Z'::timestamptz, 600.0, 'expense', 'dr', 'Cash Account', 'TZS', 'vitumbua', '', 'completed', '2024-05-29T05:25:25Z'::timestamptz, '2024-05-29T05:25:25Z'::timestamptz, 'android_cashbook', 0.0, 600.0, 0.0, NULL, '{"date":1716960325000,"cash_out":600.0,"cash_in":0.0,"balance":0.0,"notes":"vitumbua","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('b692e6af-a082-51c5-af3a-824e2d093ea5'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-05-29T14:03:26Z'::timestamptz, 400.0, 'expense', 'dr', 'Cash Account', 'TZS', 'mahindi', '', 'completed', '2024-05-29T14:03:26Z'::timestamptz, '2024-05-29T14:03:26Z'::timestamptz, 'android_cashbook', 0.0, 400.0, 0.0, NULL, '{"date":1716991406000,"cash_out":400.0,"cash_in":0.0,"balance":0.0,"notes":"mahindi","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('b170dec8-c7b2-5022-b94d-b07c112c4a1e'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-05-29T18:05:05Z'::timestamptz, 600.0, 'expense', 'dr', 'Cash Account', 'TZS', 'ndizi', '', 'completed', '2024-05-29T18:05:05Z'::timestamptz, '2024-05-29T18:05:05Z'::timestamptz, 'android_cashbook', 0.0, 600.0, 0.0, NULL, '{"date":1717005905000,"cash_out":600.0,"cash_in":0.0,"balance":0.0,"notes":"ndizi","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('79543f91-f535-5acd-bdb7-09284fb28adb'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-05-29T17:20:29Z'::timestamptz, 1500.0, 'expense', 'dr', 'Cash Account', 'TZS', 'kunyoa', '', 'completed', '2024-05-29T17:20:29Z'::timestamptz, '2024-05-29T17:20:29Z'::timestamptz, 'android_cashbook', 0.0, 1500.0, 0.0, NULL, '{"date":1717003229000,"cash_out":1500.0,"cash_in":0.0,"balance":0.0,"notes":"kunyoa","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('ead6eaa3-096a-5687-94bc-15152b47028a'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-05-29T14:15:21Z'::timestamptz, 2000.0, 'expense', 'dr', 'Cash Account', 'TZS', 'Sumu ya mende', '', 'completed', '2024-05-29T14:15:21Z'::timestamptz, '2024-05-29T14:15:21Z'::timestamptz, 'android_cashbook', 0.0, 2000.0, 0.0, NULL, '{"date":1716992121000,"cash_out":2000.0,"cash_in":0.0,"balance":0.0,"notes":"Sumu ya mende","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('16998847-5cbc-54f2-8d89-a8a21f60bafa'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-05-30T17:55:50Z'::timestamptz, 15000.0, 'expense', 'dr', 'Cash Account', 'TZS', 'vocha', '', 'completed', '2024-05-30T17:55:50Z'::timestamptz, '2024-05-30T17:55:50Z'::timestamptz, 'android_cashbook', 0.0, 15000.0, 0.0, NULL, '{"date":1717091750000,"cash_out":15000.0,"cash_in":0.0,"balance":0.0,"notes":"vocha","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('ab5a95b9-e563-5f4f-bc8c-938fab646ccc'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-05-30T19:55:59Z'::timestamptz, 500.0, 'expense', 'dr', 'Cash Account', 'TZS', 'ndizi', '', 'completed', '2024-05-30T19:55:59Z'::timestamptz, '2024-05-30T19:55:59Z'::timestamptz, 'android_cashbook', 0.0, 500.0, 0.0, NULL, '{"date":1717098959000,"cash_out":500.0,"cash_in":0.0,"balance":0.0,"notes":"ndizi","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('d27b0d6c-6d4e-56f9-b8b2-7d793e09c5aa'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-05-30T17:29:33Z'::timestamptz, 200.0, 'expense', 'dr', 'Cash Account', 'TZS', 'nyaya', '', 'completed', '2024-05-30T17:29:33Z'::timestamptz, '2024-05-30T17:29:33Z'::timestamptz, 'android_cashbook', 0.0, 200.0, 0.0, NULL, '{"date":1717090173000,"cash_out":200.0,"cash_in":0.0,"balance":0.0,"notes":"nyaya","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('ddb44a27-faad-599c-923f-40b3005dbf0c'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-05-31T08:00:53Z'::timestamptz, 1000.0, 'expense', 'dr', 'Cash Account', 'TZS', 'nauli', '', 'completed', '2024-05-31T08:00:53Z'::timestamptz, '2024-05-31T08:00:53Z'::timestamptz, 'android_cashbook', 0.0, 1000.0, 0.0, NULL, '{"date":1717142453000,"cash_out":1000.0,"cash_in":0.0,"balance":0.0,"notes":"nauli","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('ce56e66e-d2f6-5ae9-858f-51616e80a31d'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-05-31T10:25:30Z'::timestamptz, 300.0, 'expense', 'dr', 'Cash Account', 'TZS', 'Ummy pipi', '', 'completed', '2024-05-31T10:25:30Z'::timestamptz, '2024-05-31T10:25:30Z'::timestamptz, 'android_cashbook', 0.0, 300.0, 0.0, NULL, '{"date":1717151130000,"cash_out":300.0,"cash_in":0.0,"balance":0.0,"notes":"Ummy pipi","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('5b3114db-c781-504b-8fe2-ade5a3ba4d01'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-05-31T12:00:24Z'::timestamptz, 2000.0, 'expense', 'dr', 'Cash Account', 'TZS', 'Lunch kisutu', '', 'completed', '2024-05-31T12:00:24Z'::timestamptz, '2024-05-31T12:00:24Z'::timestamptz, 'android_cashbook', 0.0, 2000.0, 0.0, NULL, '{"date":1717156824000,"cash_out":2000.0,"cash_in":0.0,"balance":0.0,"notes":"Lunch kisutu","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('ac42bef7-8b0c-5959-b319-4bbda95e687c'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-05-31T13:30:32Z'::timestamptz, 1000.0, 'expense', 'dr', 'Cash Account', 'TZS', 'sokoni mfuko', '', 'completed', '2024-05-31T13:30:32Z'::timestamptz, '2024-05-31T13:30:32Z'::timestamptz, 'android_cashbook', 0.0, 1000.0, 0.0, NULL, '{"date":1717162232000,"cash_out":1000.0,"cash_in":0.0,"balance":0.0,"notes":"sokoni mfuko","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('3f6f7089-2d69-5432-804d-213499b3b3ac'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-05-31T11:32:09Z'::timestamptz, 500.0, 'expense', 'dr', 'Cash Account', 'TZS', 'msaada', '', 'completed', '2024-05-31T11:32:09Z'::timestamptz, '2024-05-31T11:32:09Z'::timestamptz, 'android_cashbook', 0.0, 500.0, 0.0, NULL, '{"date":1717155129000,"cash_out":500.0,"cash_in":0.0,"balance":0.0,"notes":"msaada","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('20e4e548-3127-5ee5-aa95-29a8c3cac30d'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-05-31T08:05:41Z'::timestamptz, 600.0, 'expense', 'dr', 'Cash Account', 'TZS', 'chapati', '', 'completed', '2024-05-31T08:05:41Z'::timestamptz, '2024-05-31T08:05:41Z'::timestamptz, 'android_cashbook', 0.0, 600.0, 0.0, NULL, '{"date":1717142741000,"cash_out":600.0,"cash_in":0.0,"balance":0.0,"notes":"chapati","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('037492e2-5e34-532e-89e3-09eed6fccad4'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-06-01T04:05:34Z'::timestamptz, 10000.0, 'income', 'cr', 'Cash Account', 'TZS', 'From budget', '', 'completed', '2024-06-01T04:05:34Z'::timestamptz, '2024-06-01T04:05:34Z'::timestamptz, 'android_cashbook', 10000.0, 0.0, 0.0, NULL, '{"date":1717214734000,"cash_out":0.0,"cash_in":10000.0,"balance":0.0,"notes":"From budget","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('0e8ee2d0-40b2-5e61-9f32-0cfc48892812'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-06-01T16:10:51Z'::timestamptz, 3000.0, 'expense', 'dr', 'Cash Account', 'TZS', 'boxer', '', 'completed', '2024-06-01T16:10:51Z'::timestamptz, '2024-06-01T16:10:51Z'::timestamptz, 'android_cashbook', 0.0, 3000.0, 0.0, NULL, '{"date":1717258251000,"cash_out":3000.0,"cash_in":0.0,"balance":0.0,"notes":"boxer","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('97c02293-24cf-5ef0-9052-92c71b15c196'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-06-01T18:09:56Z'::timestamptz, 1000.0, 'expense', 'dr', 'Cash Account', 'TZS', 'maharage', '', 'completed', '2024-06-01T18:09:56Z'::timestamptz, '2024-06-01T18:09:56Z'::timestamptz, 'android_cashbook', 0.0, 1000.0, 0.0, NULL, '{"date":1717265396000,"cash_out":1000.0,"cash_in":0.0,"balance":0.0,"notes":"maharage","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('a4a43de9-90e6-5285-baf5-fe9c52f94b80'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-06-01T15:47:18Z'::timestamptz, 1000.0, 'expense', 'dr', 'Cash Account', 'TZS', 'mchuzi wa pweza', '', 'completed', '2024-06-01T15:47:18Z'::timestamptz, '2024-06-01T15:47:18Z'::timestamptz, 'android_cashbook', 0.0, 1000.0, 0.0, NULL, '{"date":1717256838000,"cash_out":1000.0,"cash_in":0.0,"balance":0.0,"notes":"mchuzi wa pweza","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('462fd226-b4d0-5d90-becb-5dc406fd132a'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-05-31T17:02:13Z'::timestamptz, 10000.0, 'income', 'cr', 'Cash Account', 'TZS', 'From budget', '', 'completed', '2024-05-31T17:02:13Z'::timestamptz, '2024-05-31T17:02:13Z'::timestamptz, 'android_cashbook', 10000.0, 0.0, 0.0, NULL, '{"date":1717174933000,"cash_out":0.0,"cash_in":10000.0,"balance":0.0,"notes":"From budget","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('02b710fe-c9ea-577c-b691-970d6c84b108'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-05-31T17:14:48Z'::timestamptz, 5000.0, 'expense', 'dr', 'Cash Account', 'TZS', 'To mom', '', 'completed', '2024-05-31T17:14:48Z'::timestamptz, '2024-05-31T17:14:48Z'::timestamptz, 'android_cashbook', 0.0, 5000.0, 0.0, NULL, '{"date":1717175688000,"cash_out":5000.0,"cash_in":0.0,"balance":0.0,"notes":"To mom","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('61bd4973-82d1-5b41-b1f6-5d6e6657d262'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-06-01T15:08:26Z'::timestamptz, 500.0, 'expense', 'dr', 'Cash Account', 'TZS', 'Karanga', '', 'completed', '2024-06-01T15:08:26Z'::timestamptz, '2024-06-01T15:08:26Z'::timestamptz, 'android_cashbook', 0.0, 500.0, 0.0, NULL, '{"date":1717254506000,"cash_out":500.0,"cash_in":0.0,"balance":0.0,"notes":"Karanga","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('58bc749f-6370-5060-9f27-586c7c6b3b4b'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-06-01T04:07:24Z'::timestamptz, 500.0, 'expense', 'dr', 'Cash Account', 'TZS', 'nauli', '', 'completed', '2024-06-01T04:07:24Z'::timestamptz, '2024-06-01T04:07:24Z'::timestamptz, 'android_cashbook', 0.0, 500.0, 0.0, NULL, '{"date":1717214844000,"cash_out":500.0,"cash_in":0.0,"balance":0.0,"notes":"nauli","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('1ebfa1eb-6b26-5d3a-9659-4be32c62633f'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-06-01T10:11:15Z'::timestamptz, 2000.0, 'expense', 'dr', 'Cash Account', 'TZS', 'Lunch kisutu', '', 'completed', '2024-06-01T10:11:15Z'::timestamptz, '2024-06-01T10:11:15Z'::timestamptz, 'android_cashbook', 0.0, 2000.0, 0.0, NULL, '{"date":1717236675000,"cash_out":2000.0,"cash_in":0.0,"balance":0.0,"notes":"Lunch kisutu","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('58f02108-5d67-54be-ba4f-fe29b63661e6'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-06-01T16:40:33Z'::timestamptz, 200.0, 'expense', 'dr', 'Cash Account', 'TZS', 'mhindi', '', 'completed', '2024-06-01T16:40:33Z'::timestamptz, '2024-06-01T16:40:33Z'::timestamptz, 'android_cashbook', 0.0, 200.0, 0.0, NULL, '{"date":1717260033000,"cash_out":200.0,"cash_in":0.0,"balance":0.0,"notes":"mhindi","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('99992bc5-c99c-5ac1-9af3-77e6f3e54897'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-06-01T16:20:07Z'::timestamptz, 500.0, 'expense', 'dr', 'Cash Account', 'TZS', 'vibiriti', '', 'completed', '2024-06-01T16:20:07Z'::timestamptz, '2024-06-01T16:20:07Z'::timestamptz, 'android_cashbook', 0.0, 500.0, 0.0, NULL, '{"date":1717258807000,"cash_out":500.0,"cash_in":0.0,"balance":0.0,"notes":"vibiriti","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('56754077-9668-5af5-9b6a-249ee572fc5f'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-06-01T16:25:33Z'::timestamptz, 300.0, 'expense', 'dr', 'Cash Account', 'TZS', 'parachichi', '', 'completed', '2024-06-01T16:25:33Z'::timestamptz, '2024-06-01T16:25:33Z'::timestamptz, 'android_cashbook', 0.0, 300.0, 0.0, NULL, '{"date":1717259133000,"cash_out":300.0,"cash_in":0.0,"balance":0.0,"notes":"parachichi","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('6d94cad5-6e99-5641-8f72-83f1612e3162'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-05-31T17:40:00Z'::timestamptz, 1000.0, 'expense', 'dr', 'Cash Account', 'TZS', 'maharage', '', 'completed', '2024-05-31T17:40:00Z'::timestamptz, '2024-05-31T17:40:00Z'::timestamptz, 'android_cashbook', 0.0, 1000.0, 0.0, NULL, '{"date":1717177200000,"cash_out":1000.0,"cash_in":0.0,"balance":0.0,"notes":"maharage","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('97a64dda-be0b-51a9-b8a1-d898f8e2e1fb'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-05-31T17:47:44Z'::timestamptz, 400.0, 'expense', 'dr', 'Cash Account', 'TZS', 'ndizi', '', 'completed', '2024-05-31T17:47:44Z'::timestamptz, '2024-05-31T17:47:44Z'::timestamptz, 'android_cashbook', 0.0, 400.0, 0.0, NULL, '{"date":1717177664000,"cash_out":400.0,"cash_in":0.0,"balance":0.0,"notes":"ndizi","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('2337a8eb-54b4-5b93-ba5c-0d75cdda23a7'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-06-02T16:05:09Z'::timestamptz, 5000.0, 'expense', 'dr', 'Cash Account', 'TZS', 'nyama', '', 'completed', '2024-06-02T16:05:09Z'::timestamptz, '2024-06-02T16:05:09Z'::timestamptz, 'android_cashbook', 0.0, 5000.0, 0.0, NULL, '{"date":1717344309000,"cash_out":5000.0,"cash_in":0.0,"balance":0.0,"notes":"nyama","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('407eac68-7f23-5ab5-9dec-b69191b6baa3'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-06-03T04:54:32Z'::timestamptz, 500.0, 'expense', 'dr', 'Cash Account', 'TZS', 'nyaya + hoho + karoti', '', 'completed', '2024-06-03T04:54:32Z'::timestamptz, '2024-06-03T04:54:32Z'::timestamptz, 'android_cashbook', 0.0, 500.0, 0.0, NULL, '{"date":1717390472000,"cash_out":500.0,"cash_in":0.0,"balance":0.0,"notes":"nyaya + hoho + karoti","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('dc73fd84-8be7-5e39-9057-8e8b28229574'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-06-03T14:06:17Z'::timestamptz, 108000.0, 'income', 'cr', 'Cash Account', 'TZS', 'simbank', '', 'completed', '2024-06-03T14:06:17Z'::timestamptz, '2024-06-03T14:06:17Z'::timestamptz, 'android_cashbook', 108000.0, 0.0, 0.0, NULL, '{"date":1717423577000,"cash_out":0.0,"cash_in":108000.0,"balance":0.0,"notes":"simbank","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('9d391fd6-61eb-5a84-aa3b-7de012ec2be7'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-06-03T16:20:41Z'::timestamptz, 40000.0, 'expense', 'dr', 'Cash Account', 'TZS', 'kurudi kwenye budget', '', 'completed', '2024-06-03T16:20:41Z'::timestamptz, '2024-06-03T16:20:41Z'::timestamptz, 'android_cashbook', 0.0, 40000.0, 0.0, NULL, '{"date":1717431641000,"cash_out":40000.0,"cash_in":0.0,"balance":0.0,"notes":"kurudi kwenye budget","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('6598c3fa-992b-561c-9138-6afcc6c5d53f'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-06-05T17:50:52Z'::timestamptz, 1000.0, 'expense', 'dr', 'Cash Account', 'TZS', 'maharage', '', 'completed', '2024-06-05T17:50:52Z'::timestamptz, '2024-06-05T17:50:52Z'::timestamptz, 'android_cashbook', 0.0, 1000.0, 0.0, NULL, '{"date":1717609852000,"cash_out":1000.0,"cash_in":0.0,"balance":0.0,"notes":"maharage","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('a0f6a955-d4ee-5662-b189-ba6cf098e2f4'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-06-05T17:51:35Z'::timestamptz, 1300.0, 'expense', 'dr', 'Cash Account', 'TZS', 'mchele', '', 'completed', '2024-06-05T17:51:35Z'::timestamptz, '2024-06-05T17:51:35Z'::timestamptz, 'android_cashbook', 0.0, 1300.0, 0.0, NULL, '{"date":1717609895000,"cash_out":1300.0,"cash_in":0.0,"balance":0.0,"notes":"mchele","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('227a4cd6-317c-5697-bf22-eef17482a217'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-06-06T06:10:25Z'::timestamptz, 600.0, 'expense', 'dr', 'Cash Account', 'TZS', 'nauli', '', 'completed', '2024-06-06T06:10:25Z'::timestamptz, '2024-06-06T06:10:25Z'::timestamptz, 'android_cashbook', 0.0, 600.0, 0.0, NULL, '{"date":1717654225000,"cash_out":600.0,"cash_in":0.0,"balance":0.0,"notes":"nauli","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('8d574445-ddcb-5775-a6d2-aecdfd4a8f9e'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-06-06T13:10:02Z'::timestamptz, 500.0, 'expense', 'dr', 'Cash Account', 'TZS', 'tony karanga', '', 'completed', '2024-06-06T13:10:02Z'::timestamptz, '2024-06-06T13:10:02Z'::timestamptz, 'android_cashbook', 0.0, 500.0, 0.0, NULL, '{"date":1717679402000,"cash_out":500.0,"cash_in":0.0,"balance":0.0,"notes":"tony karanga","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('b3027b6f-f7e1-5a7c-8417-06a08600f906'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-06-05T17:20:00Z'::timestamptz, 2000.0, 'expense', 'dr', 'Cash Account', 'TZS', 'dagaa na ndizi', '', 'completed', '2024-06-05T17:20:00Z'::timestamptz, '2024-06-05T17:20:00Z'::timestamptz, 'android_cashbook', 0.0, 2000.0, 0.0, NULL, '{"date":1717608000000,"cash_out":2000.0,"cash_in":0.0,"balance":0.0,"notes":"dagaa na ndizi","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('75525fcf-5d9d-5ef9-b60f-d4423399e1b9'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-06-09T13:55:38Z'::timestamptz, 1800.0, 'expense', 'dr', 'Cash Account', 'TZS', 'nauli', '', 'completed', '2024-06-09T13:55:38Z'::timestamptz, '2024-06-09T13:55:38Z'::timestamptz, 'android_cashbook', 0.0, 1800.0, 0.0, NULL, '{"date":1717941338000,"cash_out":1800.0,"cash_in":0.0,"balance":0.0,"notes":"nauli","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('d442b668-fd46-5ce8-9a62-dbca27bd9fb2'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-06-09T10:56:27Z'::timestamptz, 2000.0, 'expense', 'dr', 'Cash Account', 'TZS', 'Lunch kisutu', '', 'completed', '2024-06-09T10:56:27Z'::timestamptz, '2024-06-09T10:56:27Z'::timestamptz, 'android_cashbook', 0.0, 2000.0, 0.0, NULL, '{"date":1717930587000,"cash_out":2000.0,"cash_in":0.0,"balance":0.0,"notes":"Lunch kisutu","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('7909453c-d6b1-55ac-8bf2-706a73770be5'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-06-09T12:56:54Z'::timestamptz, 800.0, 'expense', 'dr', 'Cash Account', 'TZS', 'maji', '', 'completed', '2024-06-09T12:56:54Z'::timestamptz, '2024-06-09T12:56:54Z'::timestamptz, 'android_cashbook', 0.0, 800.0, 0.0, NULL, '{"date":1717937814000,"cash_out":800.0,"cash_in":0.0,"balance":0.0,"notes":"maji","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('da8a4212-836e-5278-b293-72bfb2977d3e'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-06-09T12:57:11Z'::timestamptz, 500.0, 'expense', 'dr', 'Cash Account', 'TZS', 'sea food', '', 'completed', '2024-06-09T12:57:11Z'::timestamptz, '2024-06-09T12:57:11Z'::timestamptz, 'android_cashbook', 0.0, 500.0, 0.0, NULL, '{"date":1717937831000,"cash_out":500.0,"cash_in":0.0,"balance":0.0,"notes":"sea food","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('5428d99e-4ed4-59e6-a47a-def9faae48a6'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-06-09T13:57:12Z'::timestamptz, 200.0, 'expense', 'dr', 'Cash Account', 'TZS', 'bublish', '', 'completed', '2024-06-09T13:57:12Z'::timestamptz, '2024-06-09T13:57:12Z'::timestamptz, 'android_cashbook', 0.0, 200.0, 0.0, NULL, '{"date":1717941432000,"cash_out":200.0,"cash_in":0.0,"balance":0.0,"notes":"bublish","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('eec26846-8c50-52ab-9f31-415ddaa60c03'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-06-08T06:02:06Z'::timestamptz, 600.0, 'expense', 'dr', 'Cash Account', 'TZS', 'chapati', '', 'completed', '2024-06-08T06:02:06Z'::timestamptz, '2024-06-08T06:02:06Z'::timestamptz, 'android_cashbook', 0.0, 600.0, 0.0, NULL, '{"date":1717826526000,"cash_out":600.0,"cash_in":0.0,"balance":0.0,"notes":"chapati","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('66d77fb4-5fed-5864-a2fe-6a6bef15eaa3'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-06-07T06:04:53Z'::timestamptz, 1200.0, 'expense', 'dr', 'Cash Account', 'TZS', 'nauli', '', 'completed', '2024-06-07T06:04:53Z'::timestamptz, '2024-06-07T06:04:53Z'::timestamptz, 'android_cashbook', 0.0, 1200.0, 0.0, NULL, '{"date":1717740293000,"cash_out":1200.0,"cash_in":0.0,"balance":0.0,"notes":"nauli","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('a7b8ad00-7e57-53ca-87e3-932001cd578a'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-06-07T09:05:02Z'::timestamptz, 1000.0, 'expense', 'dr', 'Cash Account', 'TZS', 'glory+grace', '', 'completed', '2024-06-07T09:05:02Z'::timestamptz, '2024-06-07T09:05:02Z'::timestamptz, 'android_cashbook', 0.0, 1000.0, 0.0, NULL, '{"date":1717751102000,"cash_out":1000.0,"cash_in":0.0,"balance":0.0,"notes":"glory+grace","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('530a4f98-e288-5a64-9ce2-e1842189fd9c'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-06-03T22:07:02Z'::timestamptz, 2000.0, 'expense', 'dr', 'Cash Account', 'TZS', 'Lunch kisutu', '', 'completed', '2024-06-03T22:07:02Z'::timestamptz, '2024-06-03T22:07:02Z'::timestamptz, 'android_cashbook', 0.0, 2000.0, 0.0, NULL, '{"date":1717452422000,"cash_out":2000.0,"cash_in":0.0,"balance":0.0,"notes":"Lunch kisutu","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('07a89a4a-a7b0-5cce-a3eb-ec6bea14d3bd'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-06-03T10:09:23Z'::timestamptz, 2000.0, 'expense', 'dr', 'Cash Account', 'TZS', 'Lunch kisutu', '', 'completed', '2024-06-03T10:09:23Z'::timestamptz, '2024-06-03T10:09:23Z'::timestamptz, 'android_cashbook', 0.0, 2000.0, 0.0, NULL, '{"date":1717409363000,"cash_out":2000.0,"cash_in":0.0,"balance":0.0,"notes":"Lunch kisutu","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('599023e8-be41-5fa0-ac25-4832f97a2192'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-06-06T11:10:35Z'::timestamptz, 2000.0, 'expense', 'dr', 'Cash Account', 'TZS', 'Lunch kisutu', '', 'completed', '2024-06-06T11:10:35Z'::timestamptz, '2024-06-06T11:10:35Z'::timestamptz, 'android_cashbook', 0.0, 2000.0, 0.0, NULL, '{"date":1717672235000,"cash_out":2000.0,"cash_in":0.0,"balance":0.0,"notes":"Lunch kisutu","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('639e7de0-45ad-5a47-b458-7df378616cd4'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-06-05T10:11:18Z'::timestamptz, 2000.0, 'expense', 'dr', 'Cash Account', 'TZS', 'Lunch kisutu', '', 'completed', '2024-06-05T10:11:18Z'::timestamptz, '2024-06-05T10:11:18Z'::timestamptz, 'android_cashbook', 0.0, 2000.0, 0.0, NULL, '{"date":1717582278000,"cash_out":2000.0,"cash_in":0.0,"balance":0.0,"notes":"Lunch kisutu","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('826acadc-4dfc-572a-a1e7-9e38e2985728'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-06-09T12:13:23Z'::timestamptz, 10500.0, 'income', 'cr', 'Cash Account', 'TZS', 'simbank', '', 'completed', '2024-06-09T12:13:23Z'::timestamptz, '2024-06-09T12:13:23Z'::timestamptz, 'android_cashbook', 10500.0, 0.0, 0.0, NULL, '{"date":1717935203000,"cash_out":0.0,"cash_in":10500.0,"balance":0.0,"notes":"simbank","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('b593ba63-8144-5903-b15c-a5fcb38c9d65'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-06-07T17:16:55Z'::timestamptz, 600.0, 'expense', 'dr', 'Cash Account', 'TZS', 'mo passion', '', 'completed', '2024-06-07T17:16:55Z'::timestamptz, '2024-06-07T17:16:55Z'::timestamptz, 'android_cashbook', 0.0, 600.0, 0.0, NULL, '{"date":1717780615000,"cash_out":600.0,"cash_in":0.0,"balance":0.0,"notes":"mo passion","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('00fff55a-c9f2-55e6-b00a-fdbc62bb0771'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-06-08T19:18:48Z'::timestamptz, 2000.0, 'expense', 'dr', 'Cash Account', 'TZS', 'vitumbua', '', 'completed', '2024-06-08T19:18:48Z'::timestamptz, '2024-06-08T19:18:48Z'::timestamptz, 'android_cashbook', 0.0, 2000.0, 0.0, NULL, '{"date":1717874328000,"cash_out":2000.0,"cash_in":0.0,"balance":0.0,"notes":"vitumbua","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('b2fe0993-92b2-597a-89b8-2c9f27739ae2'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-06-03T15:36:40Z'::timestamptz, 5500.0, 'expense', 'dr', 'Cash Account', 'TZS', 'boxer', '', 'completed', '2024-06-03T15:36:40Z'::timestamptz, '2024-06-03T15:36:40Z'::timestamptz, 'android_cashbook', 0.0, 5500.0, 0.0, NULL, '{"date":1717429000000,"cash_out":5500.0,"cash_in":0.0,"balance":0.0,"notes":"boxer","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('1bb9f692-8ea7-5402-9c3f-80e0e3499b9f'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-06-04T05:00:49Z'::timestamptz, 1000.0, 'expense', 'dr', 'Cash Account', 'TZS', 'socks', '', 'completed', '2024-06-04T05:00:49Z'::timestamptz, '2024-06-04T05:00:49Z'::timestamptz, 'android_cashbook', 0.0, 1000.0, 0.0, NULL, '{"date":1717477249000,"cash_out":1000.0,"cash_in":0.0,"balance":0.0,"notes":"socks","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('0096091d-9dec-5ec7-87ae-1a5ebeda0434'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-06-04T05:00:26Z'::timestamptz, 600.0, 'expense', 'dr', 'Cash Account', 'TZS', 'nauli', '', 'completed', '2024-06-04T05:00:26Z'::timestamptz, '2024-06-04T05:00:26Z'::timestamptz, 'android_cashbook', 0.0, 600.0, 0.0, NULL, '{"date":1717477226000,"cash_out":600.0,"cash_in":0.0,"balance":0.0,"notes":"nauli","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('70c41c95-2f9b-5539-a1fb-6001466ba825'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-06-10T16:36:20Z'::timestamptz, 4000.0, 'expense', 'dr', 'Cash Account', 'TZS', 'kushona suruali', '', 'completed', '2024-06-10T16:36:20Z'::timestamptz, '2024-06-10T16:36:20Z'::timestamptz, 'android_cashbook', 0.0, 4000.0, 0.0, NULL, '{"date":1718037380000,"cash_out":4000.0,"cash_in":0.0,"balance":0.0,"notes":"kushona suruali","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('2cfd16bb-2aed-517e-a12a-9326c5e5b842'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-06-10T15:38:26Z'::timestamptz, 1000.0, 'expense', 'dr', 'Cash Account', 'TZS', 'Karanga tony n mm', '', 'completed', '2024-06-10T15:38:26Z'::timestamptz, '2024-06-10T15:38:26Z'::timestamptz, 'android_cashbook', 0.0, 1000.0, 0.0, NULL, '{"date":1718033906000,"cash_out":1000.0,"cash_in":0.0,"balance":0.0,"notes":"Karanga tony n mm","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('1d126eb9-f2d6-57ad-94e2-240ae2d651d7'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-06-10T08:38:12Z'::timestamptz, 500.0, 'expense', 'dr', 'Cash Account', 'TZS', 'nauli', '', 'completed', '2024-06-10T08:38:12Z'::timestamptz, '2024-06-10T08:38:12Z'::timestamptz, 'android_cashbook', 0.0, 500.0, 0.0, NULL, '{"date":1718008692000,"cash_out":500.0,"cash_in":0.0,"balance":0.0,"notes":"nauli","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('af4eb00c-f0ef-5a43-8d1e-f8ec673e1450'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-06-10T06:37:33Z'::timestamptz, 3500.0, 'expense', 'dr', 'Cash Account', 'TZS', 'Nora', '', 'completed', '2024-06-10T06:37:33Z'::timestamptz, '2024-06-10T06:37:33Z'::timestamptz, 'android_cashbook', 0.0, 3500.0, 0.0, NULL, '{"date":1718001453000,"cash_out":3500.0,"cash_in":0.0,"balance":0.0,"notes":"Nora","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('2b7e1692-bc42-560b-ae12-deb0e27e68f4'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-06-10T06:37:55Z'::timestamptz, 500.0, 'expense', 'dr', 'Cash Account', 'TZS', 'mihogo', '', 'completed', '2024-06-10T06:37:55Z'::timestamptz, '2024-06-10T06:37:55Z'::timestamptz, 'android_cashbook', 0.0, 500.0, 0.0, NULL, '{"date":1718001475000,"cash_out":500.0,"cash_in":0.0,"balance":0.0,"notes":"mihogo","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('cf5145ff-f13d-5cd0-83c3-a23cfaee31f7'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-06-10T16:15:49Z'::timestamptz, 500.0, 'expense', 'dr', 'Cash Account', 'TZS', 'parachichi', '', 'completed', '2024-06-10T16:15:49Z'::timestamptz, '2024-06-10T16:15:49Z'::timestamptz, 'android_cashbook', 0.0, 500.0, 0.0, NULL, '{"date":1718036149000,"cash_out":500.0,"cash_in":0.0,"balance":0.0,"notes":"parachichi","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('881f76f2-c7f5-52cb-b744-6686f2753f0e'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-06-07T12:41:05Z'::timestamptz, 1000.0, 'expense', 'dr', 'Cash Account', 'TZS', 'mchele usafiri', '', 'completed', '2024-06-07T12:41:05Z'::timestamptz, '2024-06-07T12:41:05Z'::timestamptz, 'android_cashbook', 0.0, 1000.0, 0.0, NULL, '{"date":1717764065000,"cash_out":1000.0,"cash_in":0.0,"balance":0.0,"notes":"mchele usafiri","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('ea2064b6-3f0f-5f08-a6d4-5d595b55d32c'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-06-10T17:42:12Z'::timestamptz, 6300.0, 'expense', 'dr', 'Cash Account', 'TZS', 'unknown uses', '', 'completed', '2024-06-10T17:42:12Z'::timestamptz, '2024-06-10T17:42:12Z'::timestamptz, 'android_cashbook', 0.0, 6300.0, 0.0, NULL, '{"date":1718041332000,"cash_out":6300.0,"cash_in":0.0,"balance":0.0,"notes":"unknown uses","bill":null,"accounts":"matumizi boom la pili"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('545dfb13-cd4f-5ca6-8870-3a4bc7dab618'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-07-26T16:46:32Z'::timestamptz, 4800.0, 'expense', 'dr', 'Cash Account', 'TZS', 'Opening Balance', '', 'completed', '2024-07-26T16:46:32Z'::timestamptz, '2024-07-26T16:46:32Z'::timestamptz, 'android_cashbook', 0.0, 4800.0, 0.0, NULL, '{"date":1722012392000,"cash_out":4800.0,"cash_in":0.0,"balance":0.0,"notes":"Opening Balance","bill":null,"accounts":"madeni"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('fcc82eea-d506-5055-991f-a785fffb6b3a'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-07-26T16:48:13Z'::timestamptz, 6000.0, 'expense', 'dr', 'Cash Account', 'TZS', 'nauli boda boda', '', 'completed', '2024-07-26T16:48:13Z'::timestamptz, '2024-07-26T16:48:13Z'::timestamptz, 'android_cashbook', 0.0, 6000.0, 0.0, NULL, '{"date":1722012493000,"cash_out":6000.0,"cash_in":0.0,"balance":0.0,"notes":"nauli boda boda","bill":null,"accounts":"madeni"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('ecf059ba-c9cc-53a3-81b3-01e7c1bfb259'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-07-26T16:48:45Z'::timestamptz, 6000.0, 'expense', 'dr', 'Cash Account', 'TZS', 'natakiwa kuchangia', '', 'completed', '2024-07-26T16:48:45Z'::timestamptz, '2024-07-26T16:48:45Z'::timestamptz, 'android_cashbook', 0.0, 6000.0, 0.0, NULL, '{"date":1722012525000,"cash_out":6000.0,"cash_in":0.0,"balance":0.0,"notes":"natakiwa kuchangia","bill":null,"accounts":"madeni"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

INSERT INTO public.transactions
  (id, user_id, date, amount, type, dc, account, currency, notes, category, status, created_at, updated_at, legacy_source, legacy_cash_in, legacy_cash_out, legacy_balance, legacy_bill, legacy_data)
VALUES
  ('1ca4d715-e2dd-5d77-817d-edff0af0ac2c'::uuid, '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid, '2024-09-03T02:59:35Z'::timestamptz, 9000.0, 'income', 'cr', 'Cash Account', 'TZS', 'Opening Balance', '', 'completed', '2024-09-03T02:59:35Z'::timestamptz, '2024-09-03T02:59:35Z'::timestamptz, 'android_cashbook', 9000.0, 0.0, 0.0, NULL, '{"date":1725332375000,"cash_out":0.0,"cash_in":9000.0,"balance":0.0,"notes":"Opening Balance","bill":null,"accounts":"Aggrey"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date, amount = EXCLUDED.amount, type = EXCLUDED.type, dc = EXCLUDED.dc,
  account = EXCLUDED.account, notes = EXCLUDED.notes, legacy_cash_in = EXCLUDED.legacy_cash_in,
  legacy_cash_out = EXCLUDED.legacy_cash_out, legacy_balance = EXCLUDED.legacy_balance,
  legacy_bill = EXCLUDED.legacy_bill, legacy_data = EXCLUDED.legacy_data;

COMMIT;

-- Expected: 0 imported accounts, 95 transactions, cash in 753850, cash out 518900.
SELECT count(*) AS imported_accounts FROM public.accounts WHERE user_id = '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid AND legacy_source = 'android_cashbook';
SELECT count(*) AS imported_transactions, sum(legacy_cash_in) AS cash_in, sum(legacy_cash_out) AS cash_out FROM public.transactions WHERE user_id = '83861d12-a541-47be-8cb6-15b5a6432dc3'::uuid AND legacy_source = 'android_cashbook';
