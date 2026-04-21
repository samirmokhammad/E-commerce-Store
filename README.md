# E-Commerce Store

A modern, full-stack e-commerce application built with React and Node.js. This project provides a complete shopping experience with user authentication, product browsing, shopping cart functionality, and order confirmation.

## 🎯 Features

### Frontend Features

- **User Authentication** - Sign up, login, and OAuth integration (Google & GitHub)
- **Product Store** - Browse products with category filtering (electronics, clothing, home, fitness)
- **Shopping Cart** - Add products to cart and manage orders
- **User Profile** - View and manage user account information
- **Order Confirmation** - Complete purchase flow with order confirmation
- **Responsive Design** - Clean, user-friendly interface with CSS styling

### Backend Features

- **Express.js API** - RESTful API for all client operations
- **PostgreSQL Database** - Secure data persistence
- **Authentication** - Passport.js with local and OAuth strategies
- **Session Management** - Secure user sessions with express-session
- **Password Security** - Bcrypt encryption for user passwords
- **CORS Support** - Secure cross-origin requests

## 🛠️ Tech Stack

### Frontend

- **React** 19.2.0 - UI framework
- **Vite** 8.0.1 - Build tool and dev server
- **React Router** 7.13.1 - Client-side routing
- **React Redux** 9.2.0 - State management (prepared)
- **ESLint** - Code quality linting

### Backend

- **Express.js** 5.2.1 - Web server framework
- **Node.js** - Runtime environment
- **PostgreSQL** 8.19.0 - Database
- **Passport.js** - Authentication middleware
  - Local strategy (username/password)
  - Google OAuth 2.0
  - GitHub OAuth 2.0
- **express-session** 1.19.0 - Session management
- **bcrypt** 6.0.0 - Password hashing
- **dotenv** 17.3.1 - Environment configuration
- **CORS** 2.8.6 - Cross-origin resource sharing

## 📁 Project Structure

```
E-commerce-Store/
├── components/              # React components
│   ├── App.jsx             # Main app component with routing
│   ├── Heading.jsx         # Navigation header
│   ├── Store.jsx           # Product store with filtering
│   ├── Cart.jsx            # Shopping cart management
│   ├── Profile.jsx         # User profile page
│   ├── SignUp.jsx          # Registration page
│   ├── LogIn.jsx           # Login page
│   └── Confirmation.jsx    # Order confirmation page
├── css/                     # Styling
│   ├── style.css           # Global styles
│   ├── store.css           # Store page styles
│   ├── cart.css            # Cart page styles
│   ├── profile.css         # Profile page styles
│   ├── signup.css          # Sign up page styles
│   ├── login.css           # Login page styles
│   ├── confirmation.css    # Confirmation page styles
│   └── heading.css         # Header styles
├── server/                  # Backend application
│   ├── app.js              # Express app configuration
│   ├── db.js               # Database connection
│   └── main.js             # Server entry point
├── main.jsx                # React app entry point
├── index.html              # HTML template
├── fn.js                   # Utility functions (password validation)
├── package.json            # Project dependencies
├── vite.config.js          # Vite configuration
└── eslint.config.js        # ESLint configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd E-commerce-Store
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the project root with the following:

   ```env
   # Frontend
   VITE_FRONTEND_URL=http://localhost:5173
   VITE_BACKEND_URL=http://localhost:4000

   # Backend
   NODE_ENV=development
   SESSION_SECRET=your_session_secret_key
   DATABASE_URL=postgresql://user:password@localhost:5432/ecommerce

   # OAuth (optional)
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   ```

4. **Set up the database**
   ```bash
   # Connect to PostgreSQL and create the database
   createdb ecommerce
   ```

### Running the Application

#### Development Mode

**Frontend (Terminal 1):**

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

**Backend (Terminal 2):**

```bash
node server/main.js
```

The backend API will be available at `http://localhost:4000`

#### Production Build

```bash
npm run build
npm run preview
```

### Available Scripts

- `npm run dev` - Start development server with Vite
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint code quality checks

## 🔐 Authentication Flow

1. **User Registration** - New users can sign up with username, email, and password
   - Password requirements: 8+ characters, uppercase, lowercase, number, special character
   - User credentials stored securely with bcrypt hashing

2. **User Login** - Authenticate with username/password or OAuth providers
   - Sessions managed via express-session

3. **Session Management** - Authenticated users maintain secure sessions

## 🛒 Shopping Flow

1. Browse products in the Store
2. Filter products by category
3. Add items to shopping cart
4. View and manage cart contents
5. Proceed to checkout
6. Confirm order
7. View order confirmation

## 🔌 API Endpoints

### Authentication

- `POST /api/signup` - Register new user
- `POST /api/login` - User login
- `GET /api/user` - Get current user info
- `POST /api/logout` - User logout

### Products

- `GET /api/products` - Get products (with optional category filter)

### Cart

- `POST /api/cart` - Add item to cart
- `GET /api/cart` - Get cart items
- `DELETE /api/cart/:itemId` - Remove item from cart

## 🎨 Password Validation

Password must meet the following requirements:

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (@, $, !, %, \*, ?, &)

Validation is performed in `fn.js` using regex patterns.

## 🔒 Security Features

- **Password Hashing** - Bcrypt encryption for passwords
- **Session Security** - HTTP-only cookies, CSRF protection
- **CORS** - Restricted cross-origin requests
- **Environment Variables** - Sensitive data in .env files
- **OAuth Support** - Secure third-party authentication

## 📝 Component Overview

- **App.jsx** - Main component with routing structure
- **Heading.jsx** - Navigation bar and header
- **Store.jsx** - Product listing with category filters
- **Cart.jsx** - Shopping cart display and management
- **Profile.jsx** - User account information
- **SignUp.jsx** - User registration form
- **LogIn.jsx** - User login form
- **Confirmation.jsx** - Order confirmation page

**Last Updated:** April 2026
