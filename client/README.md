# 📝 Make Notes (Frontend)

A modern **Note-Taking App** built with **Angular 19** as part of the full-stack MEAN application.  
It allows users to **sign up, log in, create, edit, and securely store notes** with encryption.

---

## 🚀 Features
- ✨ User Authentication (JWT-based login & signup)
- 🔐 Encrypted notes for privacy
- 🖊️ Create, edit, delete, and view notes
- 📱 Responsive UI (Angular Material + Tailwind)
- ⚡ Fast, optimized Angular 19 frontend

---

## 📂 Project Structure

│── src/ # Angular source code
│── dist/ # Production build output
│── angular.json # Angular project configuration
│── package.json # Dependencies & scripts
│── README.md # Project documentation

---

## 🖥️ Development Setup

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Start local dev server**
   ```bash
   ng serve -o
   ```
3. Then open http://localhost:4200 in your web browser to see the User Interface of the project

4. 🏗️ Build for Production
    ```bash
   ng build --configuration production
   ```
   Output will be stored in the dist/ folder.