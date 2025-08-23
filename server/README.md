# ⚙️ Make Notes (Backend)

This is the **backend API** for the Make Notes app, built with **Node.js, Express, and MongoDB**.  
It provides secure **JWT authentication**, manages **access & refresh tokens**, and handles **CRUD operations** for notes.

---

## 🚀 Features
- 🔐 User Authentication (Signup & Login with JWT + Refresh Tokens)
- 📝 Notes CRUD API (Create, Read, Update, Delete)
- 💾 MongoDB Atlas Database Integration
- ⚡ Secure Token Management
- 🌍 Deployed on [Render](https://render.com)

---

## 📂 Project Structure

1. config/ -> **Database & environment setup**
2. controllers/ -> **Auth & notes logic**
3. middleware/ -> **Auth verification (JWT)**
4. models/ -> **MongoDB schemas**
5. routes/ -> **API routes (auth & notes)**
6. server.js -> **Entry point**
7. package.json -> **Dependencies & scripts**
8. README.md -> **Backend documentation**

---

## 🛠️ Installation (Local Development)

   ```bash
   # Clone the repo
   git clone https://github.com/Chiragmanral/Make-Notes.git
   cd Make-Notes/server

   # Install dependencies
   npm install

   # Set up environment variables
   Create a .env file in the server/ folder:
   
   PORT=5000
MONGO_URL=your_mongodb_atlas_connection_string
ACCESS_TOKEN_SECRET=your_secret_key
REFRESH_TOKEN_SECRET=your_refresh_secret
NOTE_SECRET_KEY=your_note_secret

# Start the server
npm start
or
nodemon server.js (Use nodemon for hot reload)

# Now your backend runs on http://localhost:5000

```

---

## API Endpoints

- api -> https://make-notes-qyc8.onrender.com

🔑 Auth

1. POST api/auth/signup → Register user
2. POST api/auth/login → Login & get tokens
3. POST api/auth/refreshAccessToken → Refresh access token
4. POST api/auth/logout -> Logs out the user
5. POST api/auth/isTokensValid -> Checks the validity of both access and refresh tokens.

📝 Notes

1. POST api/notes/create → Create note
2. GET api/notes/myNotes → Get all notes
3. POST api/notes/get → Get single note
4. POST api/notes/update → Update note
5. POST api/notes/delete → Delete note
6. POST api/notes/view -> View any note without password only for author

---

## 📜 License
This project is licensed under the MIT License.
