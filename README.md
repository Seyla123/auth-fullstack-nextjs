# Next.js Authentication Membership System

This project is a full-stack authentication membership system built entirely with **Next.js**, featuring server-side APIs and frontend functionality. It uses **JWT** for authentication, **SQLite** for database management, and **Brevo (Sendinblue)** for sending emails. The system is designed for universal API usage without relying on third-party authentication libraries.




## Features


### Authentication
- **Sign Up**: Users can register and receive a verification email.
![Screenshot 2024-11-28 at 8 14 09 PM](https://github.com/user-attachments/assets/95275cf3-61d0-4482-b858-a3ee463de3bd)
- **Sign In**: Secure login using email and password.
 ![Screenshot 2024-11-28 at 8 11 35 PM](https://github.com/user-attachments/assets/2fd16446-206f-4c76-9642-3617f971ca6c)
- **Email Verification**: Verify email addresses (resend verification limited to 3 times per day).
- **Forgot Password**: Request a password reset email.
- **Reset Password**: Securely update passwords via a reset token.
- **Change Password**: Change the current password from within the user account.
  



### User Invitations
- **Invite Users**:
 ![Screenshot 2024-11-28 at 8 15 55 PM](https://github.com/user-attachments/assets/a3d7da1a-1aa1-4d3c-a3d4-24337cd7544f)
  - Two roles: **Admin** and **User**.
  - Newly registered users are assigned the **User** role by default.
  - Invited users receive a verification email and can register via an invite link.
  - Invites are validated before allowing the user to register.

---

## Tech Stack

### Frontend
- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: 
  - [Tailwind CSS](https://tailwindcss.com/) for utility-first styling.
  - [Chadcn UI](https://ui.shadcn.com/) for component-based styling.
- **State Management & API Calls**: [React Toolkit Query](https://redux-toolkit.js.org/rtk-query/overview) for efficient data fetching and caching.

### Backend
- **Framework**: Next.js API routes (`/api/...`) for server-side functionality.
- **Database**: [SQLite](https://www.sqlite.org/index.html) for lightweight, file-based database management.
- **Authentication**: [JWT (JSON Web Tokens)](https://jwt.io/).
- **Email Service**: [Brevo (Sendinblue)](https://www.brevo.com/) for transactional emails.

---

## Installation

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 16 or above)
- [npm](https://www.npmjs.com/) (or Yarn)

### Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Set Up Environment Variables**: Create a .env.local file in the root directory and include the following:
  ```
# .env file for SQLite database in Next.js
DATABASE_URL="database.sqlite"

# Environment Mode
NODE_ENV=

# JWT Secret
JWT_SECRET=
JWT_EXPIRES_IN=
JWT_COOKIE_EXPIRES_IN=
JWT_INVITE_EXPIRES_IN=
JWT_EMAIL_VERIFY_TOKEN_EXPIRES_IN=
JWT_RESET_PASSWORD_TOKEN_EXPIRES_IN=

# brevo
BREVO_EMAIL=
BREVO_API_KEY=
```
4. **Start the Development Server**:
   ```
   npm run dev
   ```
5. **Access the Application**: Open http://localhost:3000 in your browser.

## API Endpoints

### Auth
- `POST /api/auth/signup` - Register a new user and send a verification email.
- `POST /api/auth/signin` - Login with email and password.
- `GET /api/auth/verify-reset-password-token` - Verify the reset password token.
- `GET /api/auth/get-me` - Retrieve the current authenticated user's information.
- `GET /api/auth/init-db` - Initialize the database (for development purposes).
- `POST /api/auth/signout` - Sign out the current user.
- `PATCH /api/auth/change-password` - Change the current user's password.
- `POST /api/auth/forgot-password` - Request a password reset email.
- `POST /api/auth/reset-password` - Reset the user's password using a valid token.
- `POST /api/auth/verify-user-signup` - Verify the user's email after signing up.
- `GET /api/auth/resend-verify-email` - Resend the email verification link.

### Admin > Users
#### Invite
- `POST /api/admin/invite` - Invite a new user with a specified role (`Admin` or `User`).
- `GET /api/admin/invite` - Retrieve all invited users.
- `GET /api/admin/invite/verify-token` - Verify an invitation token.
- `DELETE /api/admin/invite` - Delete an invitation.
- `GET /api/admin/invite/resend-link` - Resend the invitation email.

#### Register by Invited Link
- `GET /api/admin/register` - Register a new user using an invitation link.

#### User Management
- `GET /api/admin/users` - Retrieve all users.
- `GET /api/admin/users/:id` - Retrieve details of a specific user by ID.
- `DELETE /api/admin/users/:id` - Delete a specific user by ID.

---

## Project Structure

```
.                 
├── app                      
│   ├── (auth)               
│   │   ├── forgot-password   
│   │   ├── register-invited-user #
│   │   ├── reset-password    
│   │   ├── sign-in          
│   │   ├── sign-up           
│   │   ├── unauthorized    
│   │   ├── verify-account    
│   │   ├── verify-email     
│   │   └── layout.tsx       
│   ├── (root)                # General application pages
│   │   ├── admin            
│   │   │   ├── users       
│   │   │   └── layout.tsx    
│   │   └── page.tsx         
│   ├── api                   # API routes for backend functionalities
│   │   ├── admin             
│   │   ├── auth              
│   │   ├── initDb         
│   │   ├── send-email        
│   │   └── route.ts          
│   ├── fonts                 
│   ├── providers             # Context or state providers
│   ├── favicon.ico          
│   ├── globals.css          
│   ├── layout.tsx           
│   └── not-found.tsx        
├── components                
├── data                     
├── hooks                    
├── lib                       
├── middlewares               
├── public                               
├── .eslintrc.json            
├── .gitignore               
├── components.json           
├── Dockerfile               
├── middleware.ts            
├── next-env.d.ts            
├── next.config.ts            
├── package-lock.json       
├── package.json              
├── postcss.config.mjs       
├── tailwind.config.ts       
├── tsconfig.json             
└── README.md                 
```
## Contributing

Contributions are welcome! Feel free to fork the repository and submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Sendinblue/Brevo](https://www.brevo.com/)
- [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)

---

Thank you for checking out this project! Feedback and suggestions are always welcome.
