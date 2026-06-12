# Smart Expense Tracker — Backend

A backend API for tracking personal expenses with AI-powered insights. Built with Node.js, Express, MongoDB, and Gemini AI.

## Live Links

| Service | URL |
|---|---|
| **Backend** | [https://expensemanager-backend-i4kn.onrender.com](https://expensemanager-backend-i4kn.onrender.com) |
| **Health Endpoint** | [https://expensemanager-backend-i4kn.onrender.com/health](https://expensemanager-backend-i4kn.onrender.com/health) |
| **Frontend** | [https://expense-tracker-frontend.vercel.app](https://expense-tracker-frontend.vercel.app) |

## Dummy Credentials

| Field | Value |
|---|---|
| **Email** | testuser@gmail.com |
| **Password** | Test@1234 |

## Tech Stack

- **Node.js** + **Express.js** — REST API
- **MongoDB** + **Mongoose** — Database & ODM
- **JWT** — Access + Refresh token auth (HTTP-only cookie)
- **bcryptjs** — Password hashing
- **Google Gemini AI** — AI-generated financial insights
- **OpenAI** — Alternative AI provider
- **express-validator** — Request validation

## Project Structure

```
server/
├── server.js                       # Entry point
├── seed/
│   └── seed.js                     # Database seeder
├── .env.example
├── package.json
└── src/
    ├── app.js                      # Express app setup
    ├── config/
    │   ├── db.js                   # MongoDB connection
    │   ├── openai.js               # OpenAI client
    │   └── anthropic.js            # Anthropic client
    ├── constants/
    │   └── index.js                # Default categories, payment methods
    ├── controllers/
    │   ├── auth.controller.js
    │   ├── expense.controller.js
    │   ├── category.controller.js
    │   ├── dashboard.controller.js
    │   ├── ai.controller.js
    │   └── user.controller.js
    ├── middleware/
    │   ├── auth.middleware.js      # JWT verification
    │   ├── errorHandler.middleware.js
    │   └── validate.middleware.js  # express-validator runner
    ├── models/
    │   ├── User.js
    │   ├── Expense.js
    │   ├── Category.js
    │   └── AIInsight.js
    ├── repositories/
    │   └── user.repository.js
    ├── routes/
    │   ├── index.js                # Central route aggregator
    │   ├── auth.routes.js
    │   ├── expense.routes.js
    │   ├── category.routes.js
    │   ├── dashboard.routes.js
    │   ├── ai.routes.js
    │   └── user.routes.js
    ├── services/
    │   ├── auth.service.js
    │   ├── expense.service.js
    │   ├── category.service.js
    │   ├── dashboard.service.js
    │   └── ai.service.js           # AI prompt construction + API call
    ├── utils/
    │   ├── jwt.js                   # Token generation & verification
    │   └── ApiError.js             # Custom error class
    └── validations/
        ├── auth.validation.js
        ├── expense.validation.js
        └── category.validation.js
```

## Local Setup

### Prerequisites

- Node.js >= 18
- npm >= 9
- MongoDB instance (local or Atlas)

### Steps

```bash
# 1. Clone the repository
git clone <repo-url>
cd server

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env
# Fill in MONGODB_URI, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, GEMINI_API_KEY

# 4. Seed the database
npm run seed

# 5. Start the dev server
npm run dev
```

The API will be available at `http://localhost:5000`.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Server port (default: 5000) |
| `NODE_ENV` | No | Environment (development/production) |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `ACCESS_TOKEN_SECRET` | Yes | JWT access token signing secret |
| `REFRESH_TOKEN_SECRET` | Yes | JWT refresh token signing secret |
| `OPENAI_API_KEY` | No | OpenAI API key (for AI insights) |
| `ANTHROPIC_API_KEY` | No | Anthropic API key (alternative AI) |
| `GEMINI_API_KEY` | No | Google Gemini API key (for AI insights) |
| `CLIENT_URL` | Yes | Frontend origin for CORS |

> **Note:** At least one AI provider key (OPENAI_API_KEY, GEMINI_API_KEY, or ANTHROPIC_API_KEY) is required for AI insights to work.

## API Endpoints

### Auth
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register a new user |
| POST | `/api/auth/login` | No | Login |
| POST | `/api/auth/refresh` | Cookie | Refresh access token |
| POST | `/api/auth/logout` | Yes | Logout |
| GET | `/api/auth/me` | Yes | Get current user |

### Categories
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/categories` | Yes | Create category |
| GET | `/api/categories` | Yes | Get all categories |
| GET | `/api/categories/:id` | Yes | Get single category |
| PUT | `/api/categories/:id` | Yes | Update category |
| DELETE | `/api/categories/:id` | Yes | Delete category |

### Expenses
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/expenses` | Yes | Add expense |
| GET | `/api/expenses` | Yes | Get expenses (with filters) |
| GET | `/api/expenses/:id` | Yes | Get single expense |
| PUT | `/api/expenses/:id` | Yes | Update expense |
| DELETE | `/api/expenses/:id` | Yes | Delete expense |

**Expense Query Filters:** `categoryId`, `startDate`, `endDate`, `minAmount`, `maxAmount`, `paymentMethod`, `search`, `page`, `limit`, `sortBy`, `order`

### Dashboard
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/dashboard/summary` | Yes | Monthly spending summary |
| GET | `/api/dashboard/category-breakdown` | Yes | Spending by category |
| GET | `/api/dashboard/trends` | Yes | Last 7 days daily trend |
| GET | `/api/dashboard/budget-status` | Yes | Budget vs spent per category |
| GET | `/api/dashboard/top-expenses` | Yes | Top N expenses this month |

### AI Insights
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/ai/insights` | Yes | Generate AI financial analysis |
| GET | `/api/ai/insights/latest` | Yes | Get latest saved insight |

### Health
```
GET /health  →  { "success": true, "message": "Server is running" }
```

## AI Insights Feature

The AI Insights endpoint (`POST /api/ai/insights`) works as follows:

1. Fetches the **last 60 days** of expense data for the authenticated user
2. Aggregates spending by category
3. Constructs a structured prompt with total spending, average monthly spend, and per-category breakdown
4. Sends the prompt to **Google Gemini AI** (or OpenAI/Anthropic as fallback)
5. Parses the JSON response containing:
   - Predicted monthly spending
   - Highest risk spending category
   - Risk explanation
   - Savings recommendation
   - Budget score (0–100)
6. Saves the insight to the database and returns it to the frontend

AI API calls are **never made from the frontend** — all calls originate from the backend.

## AI Usage Disclosure

AI assistance (Claude) was used for:
- Implementing the AI-powered prediction and insight feature (AI prompt construction, response parsing)
- Code documentation and README generation

AI was NOT used for:
- Database schema design
- CRUD API implementation
- Authentication implementation
- Middleware logic

## Known Limitations

- **Database**: Currently uses **MongoDB + Mongoose**. Migration to **PostgreSQL + Prisma ORM** is pending (see assessment requirements).
- **No CI/CD**: GitHub Actions workflow not yet configured.
- **No tests**: Unit/integration tests are not yet implemented.
- **AI fallback**: If Gemini fails, falls back to error message rather than trying alternate providers automatically.
- **Refresh token rotation**: Token is rotated on refresh but old tokens are not blacklisted.
- **Rate limiting**: No rate limiting on auth endpoints.
- **Seed script**: Current seed generates random 50 records instead of the required 60-day patterned data.

## Notes

- Access token expires in **15 minutes**
- Refresh token expires in **7 days** and is stored in an **HTTP-only cookie**
- All protected routes require `Authorization: Bearer <accessToken>`
- Deleting a category that has linked expenses will return a `409` error
