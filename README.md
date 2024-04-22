# Auth App - NextJS

This is a [Next.js](https://nextjs.org/) project with [`Auth.js`](https://authjs.dev/) including authentication (credentials and third-party OAuth) and authorization for some simple profile and settings pages.

## Getting Started

First, install all dependencies:

```bash
npm install
```

Then, create `.env` file in the root directory of the project:

```env
AUTH_SECRET=""
DATABASE_URL=""
AUTH_GITHUB_ID=""
AUTH_GITHUB_SECRET=""
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""
RESEND_API_KEY=""
NEXT_PUBLIC_APP_URL=""
```

After the setup, start the web app by:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- Next.js
- Prisma
- Auth.js
- shadcn/ui
- Tailwind CSS
- Resend
- PostgreSQL
