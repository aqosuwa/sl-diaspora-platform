# SL Diaspora Connect — Frontend

A fully-functioning frontend prototype for a web platform connecting the
Sierra Leonean diaspora in the UK with the Sierra Leone High Commission, UK.
Built with **React + Vite + Tailwind CSS v4**. There is no backend — all data
is seeded dummy data held in React state and persisted to the browser's
`localStorage`, so every action (registering, submitting a case, applying to
a job, verifying a member, matching a referral, etc.) actually changes the
app's state and survives a page reload.


## Features

- **Member accounts** — register, log in (by email), profile page
- **Consular Services** — apply for a new passport, passport or National ID renewal, visa, or emergency
  travel certificate, and track them through a status timeline
- **Payments** — fee schedule per application, paid by Orange Money, Afrimoney, Visa/Mastercard or bank transfer; receipts, refunds on withdrawal, and staff confirmation of bank transfers. Payments are simulated (no real money moves; no payment provider is connected)
- **Confidential Referrals** — request a verified immigration lawyer, GP,
  accountant, family lawyer, or therapist; requests are only ever visible to
  the member and to Commission staff, never to other members
- **Jobs Board** — browse published jobs by city/category, apply in one
  click, or post your own listing (goes to a moderation queue)
- **Business Directory** — browse verified Sierra Leonean-owned UK
  businesses, or submit your own for review
- **Events & News** — community events in the UK and Sierra Leone, plus Commission announcements
- **Youth connection** — community board (post, delete your own) and youth events; admins can remove posts
- **Commission Admin Dashboard** — a separate staff login with:
  - member & professional verification queue
  - consular case management (advance status, add notes)
  - referral management (match members to verified professionals, close cases)
  - job & business listing moderation (approve/reject)
  - events & news publishing

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL in your browser.

To build a production bundle:

```bash
npm run build
npm run preview
```

## Demo accounts

On the **Login** page, use the "Demo accounts" panel to sign in instantly as
one of the seeded members (no password needed — this is a prototype). Use
**Commission staff login** from the footer or `/admin/login` to enter the
admin dashboard (also no password — click "Enter Admin Dashboard").

You can also register a brand-new member account from scratch, or post a
job/business listing and then switch to the admin dashboard to approve it.

## How "fully functioning" works here

- All app data (members, professionals, jobs, businesses, consular cases,
  referrals, events, news, and the current session) lives in a single React
  Context (`src/context/AppContext.jsx`) and is written to `localStorage` on
  every change.
- There is no real backend, authentication, or email/SMS — logging in by
  email and admin login are both simulated for demo purposes.
- Refreshing the page keeps your data. To reset the prototype back to the
  original seed data, clear `localStorage` for this site (or open dev tools
  → Application → Local Storage → delete the `sl-diaspora-platform-state-v1`
  key) and reload.

## Project structure

```
src/
  components/     shared UI: Navbar, Footer, Layout, Modal, Card, StatusPill, forms, route guards
  context/        AppContext.jsx — global state + all actions
  data/           seed.js — dummy starter data
  lib/            id.js — id/case-reference generators
  pages/
    public/       Landing, Register, Login, AdminLogin
    member/       Dashboard, Consular, Referrals, Jobs, Businesses, Events, Profile
    admin/        AdminOverview, AdminVerification, AdminConsular, AdminReferrals, AdminListings, AdminContent
```

## Tech stack

- React 19 + Vite
- React Router v7
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- No external state library — React Context + `useState`
