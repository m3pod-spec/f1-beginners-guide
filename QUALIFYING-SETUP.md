# Qualifying — leaderboard setup

The game runs on GitHub Pages. The shared leaderboard needs a Supabase project.

## 1. Create a free Supabase project

1. Go to https://supabase.com and create an account.
2. Create a new project. Choose a strong database password and keep it private.
3. Wait for the project to finish setting up.

Supabase's free plan has usage limits and can change over time. Check its current plan details before relying on it long-term.

## 2. Create the leaderboard table

1. Open your Supabase project.
2. Go to SQL Editor and create a new query.
3. Copy all the contents of supabase-qualifying.sql into the query.
4. Run it.

This creates a public-read leaderboard and allows anonymous score submissions. It does not allow visitors to edit or delete entries.

## 3. Connect the website

1. In Supabase, open Project Settings → API (or Connect, depending on the dashboard layout).
2. Copy the Project URL.
3. Copy the anon / publishable key.
4. Open qualifying-config.js in this GitHub repository.
5. Put those two public values into the matching quotes.
6. Save the file. GitHub Pages will publish the change.

Never use a service_role or secret key in the website. The browser file is public. The SQL policies restrict database access.

## A note about score integrity

This first version is a public nickname-and-score board. Anyone can submit a score from a browser, so it is suitable for a friendly game but it is not cheat-proof. A stricter version would need a server-side function to validate completed games before accepting scores.

Every submitted attempt appears in the all-time leaderboard, ordered by score (highest first). Equal scores share the same rank, with earlier submissions listed first. Names are public, so players should use nicknames rather than private identifying information.
