# Turkish with Cats

*Kedi ile Türkçe* — a cat-themed practice site for a weekly Turkish class taught to English speakers.
Each week's lesson gets the same eight activities, generated from that week's content:

| Activity | What it does |
|---|---|
| Flashcards | Flip cards with the word, meaning and pronunciation |
| Quiz | Ten mixed questions: listen and choose, meanings, alphabet and pronunciation |
| Fill in the Blank | Choose the missing word |
| Drag & Drop | Drag each Turkish word onto its meaning (tap works too) |
| Build the Sentence | Put shuffled words in the right order |
| Word Search | Find hidden words in a letter grid |
| Crossword | Solve clues with an on-screen Turkish keyboard |
| Memory Game | Match each word with its picture |

Built with Next.js (App Router). Deployed on Vercel.

## Running locally

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and fill in the values first.

## Accounts and login

The site is private. Students log in with a username and password.

- The teacher logs in on the same page with `YONETICI_ADI` / `YONETICI_SIFRE` and is taken to the admin screen at `/yonetici`.
- On the admin screen the teacher adds students, changes their passwords, or deletes them. Changes take effect immediately; no redeploy needed.
- Passwords are stored hashed (scrypt) and cannot be read back. Deleting a student or changing their password ends their open sessions.
- Accounts are stored in Upstash Redis under the key `kedi:kullanicilar`. Without Redis settings, local development falls back to `data/db.json`.

## Environment variables

| Variable | Purpose |
|---|---|
| `YONETICI_ADI` | Teacher (admin) username. Defaults to `ogretmen`. |
| `YONETICI_SIFRE` | Teacher (admin) password. |
| `OTURUM_GIZLI` | Long random string used to sign session cookies (`openssl rand -hex 32`). |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | Upstash Redis. Added automatically when the store is connected in Vercel. |

## Deploying to Vercel

1. Import this repository in Vercel (Add New → Project).
2. Storage → create or connect an **Upstash for Redis** database for the project.
3. Settings → Environment Variables → add `YONETICI_ADI`, `YONETICI_SIFRE` and `OTURUM_GIZLI`.
4. Deploy, then log in as the teacher and add students at `/yonetici`.

## Adding a new week

1. Copy `content/hafta1.js` to `content/hafta2.js` and replace the content with the new lesson.
2. Import it in `content/index.js` and add it to the `haftalar` list.

The activities are built from the content fields: `kelimeler` (words: flashcards, quiz, drag & drop, word search, memory),
`sorular` (extra quiz questions), `bosluklar` (fill in the blank), `cumleler` (sentences) and `bulmaca` (crossword).

## Listening

Words are read aloud with the browser's built-in Turkish voice, so no audio files are needed.
On devices without a Turkish voice the listen buttons are hidden and listening questions become reading questions.

## Notes

- Activity progress (the paw stamps) is saved in each student's browser, not on the server.
- Code identifiers and file names are in Turkish; the interface is English with Turkish labels.
