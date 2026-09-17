# Backend

Express backend for the MERN Week5 Capstone project.

## Requirements
- Node.js (14+)

## Setup
1. Install dependencies

```bash
npm install
```

2. Start the server

```bash
node Server.js
# or, if a start script exists
npm start
```

## Structure
- `APIS/` — API route handlers
- `Middlewares/` — Express middleware
- `Models/` — Mongoose models
- `Services/` — Business logic / services

## Notes
- If environment variables are required, create a `.env` file at the project root.
- Password verification emails require `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and optionally `SMTP_FROM` and `SMTP_SECURE=true`.
- See `Server.js` for the server entrypoint.
