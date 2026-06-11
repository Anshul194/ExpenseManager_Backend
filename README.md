# Smart Expense Tracker — Backend

A backend API for tracking personal expenses with AI-powered insights. Built with Node.js, Express, MongoDB, and OpenAI.

## Tech Stack

- **Node.js** + **Express.js** — REST API
- **MongoDB** + **Mongoose** — Database & ODM
- **JWT** — Access + Refresh token auth (HTTP-only cookie)
- **bcryptjs** — Password hashing
- **OpenAI API** — AI-generated financial insights
- **express-validator** — Request validation

## Project Structure

```
├── server.js
├── seed/
│   └── seed.js
└── src/
    ├── app.js
    ├── config/
    │   ├── db.js
    │   ├── env.js
    │   └── openai.js
    ├── constants/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    │   └── index.js     ← central route entry
    ├── services/
    ├── utils/
    └── validations/
```

## Getting Started

```bash
# 1. Clone the repo
git clone <repo-url>
cd Expense_Tracker_Backend

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Fill in MONGODB_URI, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, OPENAI_API_KEY

# 4. Seed the database
npm run seed

# 5. Start the dev server
npm run dev
```

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `ACCESS_TOKEN_SECRET` | JWT access token secret |
| `REFRESH_TOKEN_SECRET` | JWT refresh token secret |
| `OPENAI_API_KEY` | OpenAI API key |
| `CLIENT_URL` | Frontend origin for CORS |

## Seed Credentials

After running `npm run seed`:

- **Email:** testuser@gmail.com
- **Password:** Test@1234

## API Endpoints

### Auth
| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get current user |

### Categories
| Method | Route | Description |
|---|---|---|
| POST | `/api/categories` | Create category |
| GET | `/api/categories` | Get all categories |
| GET | `/api/categories/:id` | Get single category |
| PUT | `/api/categories/:id` | Update category |
| DELETE | `/api/categories/:id` | Delete category |

### Expenses
| Method | Route | Description |
|---|---|---|
| POST | `/api/expenses` | Add expense |
| GET | `/api/expenses` | Get expenses (with filters) |
| GET | `/api/expenses/:id` | Get single expense |
| PUT | `/api/expenses/:id` | Update expense |
| DELETE | `/api/expenses/:id` | Delete expense |

**Expense Query Filters:** `categoryId`, `startDate`, `endDate`, `minAmount`, `maxAmount`, `paymentMethod`, `search`, `page`, `limit`, `sortBy`, `order`

### Dashboard
| Method | Route | Description |
|---|---|---|
| GET | `/api/dashboard/summary` | Monthly spending summary |
| GET | `/api/dashboard/category-breakdown` | Spending by category |
| GET | `/api/dashboard/trends` | Last 7 days daily trend |
| GET | `/api/dashboard/budget-status` | Budget vs spent per category |
| GET | `/api/dashboard/top-expenses` | Top N expenses this month |

### AI Insights
| Method | Route | Description |
|---|---|---|
| POST | `/api/ai/insights` | Generate AI financial analysis |
| GET | `/api/ai/insights/latest` | Get latest saved insight |

### Health
```
GET /health  →  { "success": true, "message": "Server is running" }
```

## Notes

- Access token expires in **15 minutes**
- Refresh token expires in **7 days** and is stored in an **HTTP-only cookie**
- All protected routes require `Authorization: Bearer <accessToken>`
- Deleting a category that has linked expenses will return a `409` error
