# Course Selling Website

A GitHub-ready full-stack course-selling website built with:

- **Frontend:** React 19 + Vite + React Router
- **Backend:** Node.js + Express
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT + bcrypt
- **Validation:** Zod
- **Architecture:** Separate `frontend` and `backend` apps

## Features

### User
- Sign up / sign in
- Browse all courses
- View course details
- Purchase a course
- View purchased courses
- JWT-protected routes

### Admin
- Admin sign in
- Create courses
- Delete courses
- View courses
- JWT-protected admin routes

## Project Structure

```text
course-selling-website/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── index.js
│   ├── .env.example
│   └── package.json
├── .gitignore
└── README.md
```

## 1. Clone

```bash
git clone <your-github-repository-url>
cd course-selling-website
```

## 2. Backend setup

```bash
cd backend
npm install
```

Create `.env` from `.env.example`:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/course-selling
JWT_SECRET=replace_with_a_long_random_secret
PORT=3000
```

Start backend:

```bash
npm run dev
```

## 3. Frontend setup

Open another terminal:

```bash
cd frontend
npm install
```

Create `.env`:

```env
VITE_API_URL=http://localhost:3000
```

Start frontend:

```bash
npm run dev
```

## API

### User

- `POST /users/signup`
- `POST /users/signin`
- `GET /users/me`
- `GET /users/purchases`
- `POST /users/purchase`

### Courses

- `GET /courses`

### Admin

- `POST /admin/signup`
- `POST /admin/signin`
- `POST /admin/course`
- `DELETE /admin/remcourse`

## Authentication

The project follows the existing backend convention:

```text
Authorization: token <JWT>
```

The JWT payload contains:

```js
{ id: userId }
```

## MongoDB Models

### UserModel

```text
email
password
name
```

### CourseModel

```text
title
discription
price
image_url
creater_id
```

### PurchaseModel

```text
user_id
courses_id
```

> `discription` intentionally keeps the spelling used by the existing project structure.

## GitHub

Before pushing:

```bash
git init
git add .
git commit -m "Initial course selling website"
git branch -M main
git remote add origin <your-repository-url>
git push -u origin main
```

Do not commit `.env` files or secrets.
