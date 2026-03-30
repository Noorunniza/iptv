# IPTV Backend

This folder contains the Express + MongoDB backend for the IPTV project.

For the full combined project documentation, see:

- [`README.md`](D:/ReactNativeApps/README.md)

## Quick Start

```bash
npm install
```

Create a `.env` file from `.env.example`, then run:

```bash
npm run dev
```

or

```bash
npm start
```

## Environment Variables

- `MONGO_URI`
- `JWT_SECRET`
- `EMAIL_USER`
- `EMAIL_PASS`

## Main Responsibilities

- registration and login
- JWT authentication
- password reset email flow
- user profile read/update
- favorites storage per user
- mobile deep-link redirect for password reset
