/*
# Create vocabulary tables for language learning memory game

## Summary
Creates the data layer for a single-tenant (no sign-in) language learning memory game.
The game matches words across languages (e.g. English "apple" <-> Spanish "manzana").
No user accounts are required, so all policies allow anon + authenticated access.

## New Tables

### languages
- `id` (uuid, primary key)
- `code` (text, unique, not null) — ISO 639-1 code e.g. "en", "es", "fr"
- `name` (text, not null) — display name e.g. "English", "Spanish"
- `flag_emoji` (text) — flag emoji for UI
- `created_at` (timestamptz)

### categories
- `id` (uuid, primary key)
- `slug` (text, unique, not null) — e.g. "animals", "food"
- `name` (text, not null) — display name
- `icon` (text) — lucide icon name hint
- `description` (text)
- `created_at` (timestamptz)

### words
- `id` (uuid, primary key)
- `category_id` (uuid, references categories, on delete cascade)
- `language_code` (text, not null) — which language this word is in
- `word` (text, not null) — the word text
- `translation_key` (uuid, not null) — groups words that are translations of each other
- `created_at` (timestamptz)
- Unique constraint on (translation_key, language_code) so each language has one word per concept

### game_scores
- `id` (uuid, primary key)
- `language_code` (text, not null) — language being learned
- `category_id` (uuid, references categories, on delete cascade)
- `score` (integer, not null)
- `moves` (integer, not null)
- `time_seconds` (integer, not null)
- `created_at` (timestamptz)

## Security
- RLS enabled on all tables.
- All tables are intentionally public/shared (no-auth single-tenant app).
- anon + authenticated have full CRUD via TO anon, authenticated with USING (true).
*/
CREATE TABLE IF NOT EXISTS languages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  flag_emoji text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE languages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_languages" ON languages;
CREATE POLICY "anon_select_languages" ON languages FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_languages" ON languages;
CREATE POLICY "anon_insert_languages" ON languages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_languages" ON languages;
CREATE POLICY "anon_update_languages" ON languages FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_languages" ON languages;
CREATE POLICY "anon_delete_languages" ON languages FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  icon text,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_categories" ON categories;
CREATE POLICY "anon_select_categories" ON categories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_categories" ON categories;
CREATE POLICY "anon_insert_categories" ON categories FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_categories" ON categories;
CREATE POLICY "anon_update_categories" ON categories FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_categories" ON categories;
CREATE POLICY "anon_delete_categories" ON categories FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS words (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  language_code text NOT NULL,
  word text NOT NULL,
  translation_key uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (translation_key, language_code)
);

ALTER TABLE words ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_words" ON words;
CREATE POLICY "anon_select_words" ON words FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_words" ON words;
CREATE POLICY "anon_insert_words" ON words FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_words" ON words;
CREATE POLICY "anon_update_words" ON words FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_words" ON words;
CREATE POLICY "anon_delete_words" ON words FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS game_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  language_code text NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  score integer NOT NULL,
  moves integer NOT NULL,
  time_seconds integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE game_scores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_game_scores" ON game_scores;
CREATE POLICY "anon_select_game_scores" ON game_scores FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_game_scores" ON game_scores;
CREATE POLICY "anon_insert_game_scores" ON game_scores FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_game_scores" ON game_scores;
CREATE POLICY "anon_update_game_scores" ON game_scores FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_game_scores" ON game_scores;
CREATE POLICY "anon_delete_game_scores" ON game_scores FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_words_category ON words(category_id);
CREATE INDEX IF NOT EXISTS idx_words_language ON words(language_code);
CREATE INDEX IF NOT EXISTS idx_words_translation_key ON words(translation_key);
CREATE INDEX IF NOT EXISTS idx_game_scores_language ON game_scores(language_code);
CREATE INDEX IF NOT EXISTS idx_game_scores_category ON game_scores(category_id);
