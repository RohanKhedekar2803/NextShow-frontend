# NextShow — Frontend

React frontend for **NextShow**, a distributed event booking platform. Handles browsing, booking, and payments with real-time seat availability.

<p>
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/OAuth%202.0-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="OAuth 2.0" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT" />
  <img src="https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white" alt="Stripe" />
  <img src="https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white" alt="shadcn/ui" />
</p>

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| 🧩 UI | React, Tailwind CSS, shadcn/ui, lucide-react icons |
| 🧭 Routing | react-router-dom |
| 🔐 Auth | Google OAuth 2.0, JWT (`jwt-decode`) |
| 💳 Payments | Stripe |
| 🔔 Notifications | react-hot-toast |
| 💾 Session storage | `localStorage` |

## ✨ Features

- **Google OAuth 2.0 login** — backend redirects back with tokens in the URL hash; frontend parses and stores them, no manual login form needed
- **JWT session handling** — access + refresh tokens decoded and persisted client-side, username pulled straight from the token
- **Event browsing** — homepage banner + genre-based filtering for discovering events fast
- **Interactive seat map** — section/row/seat grid rendered dynamically from backend layout data, with live available/selected/booked states
- **Section locking** — seat selection is locked to a single pricing section per booking to prevent invalid mixed-section carts
- **Booking status polling** — after submitting a booking, the frontend polls booking status until it's ready for payment, then redirects to Stripe
- **Stripe checkout** — secure payment redirect with webhook-confirmed booking status
- **Sold-seat sync** — booked seats are fetched per show and rendered as disabled/red on the seat map

## 🎟️ Booking Flow

1. User selects seats on the interactive seat map (locked to one pricing section at a time).
2. On confirm, seats are formatted with padded IDs (`S{show}-C{col}-R{row}`) and posted to the backend along with the computed total price.
3. Frontend polls booking status (up to 3 attempts, 4s apart) until it reads `"Ready for Payment"`.
4. Once ready, a Stripe Checkout URL is fetched and the browser is redirected to complete payment.
5. If polling times out or the checkout URL can't be fetched, the user gets a toast error instead of a silent failure.

## 🔑 Auth Flow

1. User logs in via Google OAuth on the backend.
2. Backend redirects to `/homepage#accessToken=...&refreshToken=...`.
3. Frontend reads the hash on first render, decodes the JWT (`jwt-decode`) to grab the username, and stores `token` / `refresh_token` / `username` in `localStorage`.
4. URL is cleaned up via `history.replaceState` so tokens never sit in the visible URL or browser history.

## 🚀 Getting Started

```bash
git clone https://github.com/RohanKhedekar2803/<nextshow-frontend-repo>.git
cd <nextshow-frontend-repo>
npm install
npm run dev
```

Requires the NextShow backend running and reachable for OAuth redirect + API calls — set the backend URL in your `.env`.

## 📂 Key Structure

```
src/
├── components/ui/       # Navbar, Banner, GenreButtonList, shadcn primitives
├── Services/
│   ├── auth.js           # getUserId and auth helpers
│   ├── theaters.js        # getShowById and event/show data fetching
│   └── Bookingpage.js      # postBooking, booking status polling, Stripe checkout
└── pages/
    ├── HomePage.jsx        # Token capture on OAuth redirect + landing view
    └── EventPage.jsx        # Seat map, section locking, booking + payment flow
```

## 👤 Author

**Rohan Khedekar**
[GitHub](https://github.com/RohanKhedekar2803) · [LinkedIn](https://www.linkedin.com/in/rohan-khedekar-1a5307206) · [LeetCode](https://leetcode.com/u/Rohan2803/)
