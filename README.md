# 🔙 Link Saver Backend

This is the Express.js + SQLite backend for the Link Saver + Auto-Summary app. It handles user authentication, URL metadata scraping, bookmark management, and AI-powered summaries via Jina AI.


## 📦 Features

- JWT-based authentication  
- Password hashing using bcrypt  
- Bookmark saving and deleting  
- Title & favicon scraping  
- Auto-summary generation via [Jina AI](https://r.jina.ai)  
- SQLite as the database


---

## 🧱 Tech Stack

- **Frontend**: React + Tailwind CSS (via Vite)
- **Backend**: Node.js + Express
- **Database**: SQLite
- **Authentication**: JWT
- **Jina AI API**: [Jina AI Scrapper API](https://r.jina.ai)

---


## 🚀 Getting Started


### Setup Instructions

1. Install dependencies:

```bash
npm install
```
2. Create a .env file:
```bash
JWT_SECRET=your_jwt_secret_key
PORT = your_port
```
3. Run the server:
```bash
node server.js
```

## Project Structure
```

backend/             
├── routes/
│   ├── auth.js              # Signup/Login routes
│   └── bookmarks.js         # Bookmark CRUD
├── middleware/
│   └── auth.js              # JWT verification
├── utils/
│   ├── db.js                # SQLite database config
│   └── scraper.js           # Metadata and favicon fetcher
├── server.js                # Express entry point
├── package.json
└── .env
```

## 🔗 API Endpoints

### Auth
POST /api/auth/register → { email, password }

POST /api/auth/login → { email, password }

### Bookmarks (Requires JWT)
POST /api/bookmarks → { url }

GET /api/bookmarks

DELETE /api/bookmarks/:id
