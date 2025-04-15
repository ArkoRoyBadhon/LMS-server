# Learning Management System (LMS)

## Overview
The Learning Management System (LMS) is a comprehensive platform for managing online courses. It supports two types of users, Admin and User, each with distinct functionalities. Users can explore and enroll in courses, while Admins can manage the entire course lifecycle, including creating and organizing content.

---

## Note**  (Must Watch) *******
- "Appliation not run on Incognito Mode"
- "Render api may slow due to inactivity"

---

## Technologies Used

### Frontend:
- Next.js
- TypeScript
- Redux Toolkit

### Backend:
- Node.js
- Express.js
- TypeScript
- Mongoose
- Cloudinary
- JWT

---

## Project Workflow

1. **User Roles:**
   - Two types of users: Admin and User.
   - Users register with the role of "User" by default.

2. **User Features:**
   - Register and log in.
   - Enroll in courses from the course detail page.
   - View enrolled courses in the dashboard.
   - Unlock video lectures sequentially using the "Next" button.
   - Access and download PDF files attached to lectures.

3. **Admin Features:**
   - Create, manage, and organize courses, modules, and lectures.
   - Maintain control over course content and user progress.

---

## Login Credentials

### Admin:
- **Email:** admin@gmail.com
- **Password:** 12345678

### User:
- **Email:** arko@gmail.com
- **Password:** 12345678

---

## How to Run the Project

### Prerequisites:
- Node.js installed.
- MongoDB database.
- Cloudinary account for media storage.

### Steps:
1. Clone the repository: `git clone <repository-url>`
2. Install dependencies:
   ```bash
   npm install


### server env
- DATABASE_URL=
- REFRESH_TOKEN_SECRET=
- ACCESS_TOKEN_SECRET=
- PORT=
- NODE_ENV=
- SERVER_URL=
- CN_Cloud_name=
- CN_Api_key=
- CN_Api_secret=
- CN_Folder=

### frontend env
- FRONTEND_URL=

