# LifeOS — Plan, Goals & Money

A single personal dashboard for your calendar, short/medium/long-term goals, tasks, and money tracking.

## Files
- `index.html` — page structure/markup
- `styles.css` — all styling, including light/dark theme
- `app.js` — app logic (calendar, tasks, goals, money, language switching)

## Running it
Just open `index.html` in a browser — no build step, no server, no dependencies.

## Data
Everything is saved to your browser's `localStorage` (key `lifeos_v1`), so your data stays on your device and persists between visits. Nothing is sent anywhere.

## Features
- **Dashboard** — daily snapshot of tasks, goal progress, balance, and upcoming events
- **Calendar** — click a day to add events/deadlines
- **Planner** — tasks with priority, due date, and filters (all / today / this week / done)
- **Goals** — short-term, medium-term, and long-term goals with progress bars
- **Money** — income/expense tracking, monthly summary, savings rate
- **Language** — English, French, Arabic (with right-to-left layout)
- **Theme** — light/dark, follows system preference by default
