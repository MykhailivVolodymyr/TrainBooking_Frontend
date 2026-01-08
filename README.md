# 🚂 TrainBooking Frontend

Train Ticket Booking System (analogous to Ukrzaliznytsia) - Frontend Client Application

> Frontend client for the [TrainBooking Backend API](https://github.com/MykhailivVolodymyr/TrainBooking_Backend)

## 📋 Project Overview

TrainBooking Frontend is a web application for online train ticket booking, built with React and TypeScript. This is the client-side interface that connects to the TrainBooking Backend API, providing users with an intuitive platform for searching trains, booking tickets, and managing their reservations.

## 🔗 Related Projects

- **Backend API**: [TrainBooking_Backend](https://github.com/MykhailivVolodymyr/TrainBooking_Backend)
- **API Documentation**: Available at backend Swagger UI

## 🏗️ Project Structure

```
TrainBooking_Frontend/
├── trainBookingClient/
│   ├── src/
│   │   ├── app/
│   │   │   └── Schedule/       # Schedule management module
│   │   ├── analytics/          # Analytics page
│   │   ├── changeSchedule/     # Schedule editing functionality
│   │   ├── components/         # Reusable React components
│   │   ├── login/              # Login page
│   │   ├── mytickets/          # User tickets page
│   │   ├── register/           # Registration page
│   │   ├── services/           # API service layer
│   │   └── types/              # TypeScript type definitions
│   ├── public/                 # Static assets
│   └── package.json            # Dependencies
├── .gitignore
└── README.md
```

## ✨ Key Features

### For Users:
- 🔍 **Route Search** - Search for trains by stations and date
- 🎫 **Ticket Booking** - Book train tickets
- 🎟️ **My Tickets** - View and manage personal bookings
- 🔐 **Authentication** - Secure login and registration system

### For Administrators:
- 📊 **Analytics Dashboard** - View system statistics
- 📅 **Schedule Management** - View and edit train schedules
- 🔄 **Schedule Updates** - Modify existing schedules

## 🛠️ Technology Stack

### Core Technologies
- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **React Router** - Client-side routing
- **MUI (Material UI)** – React component library for building modern user interfaces

### Additional Tools
- **Axios** - HTTP client for API calls
- **ESLint & Prettier** - Code quality tools

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- Running instance of [TrainBooking Backend API](https://github.com/MykhailivVolodymyr/TrainBooking_Backend)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/MykhailivVolodymyr/TrainBooking_Frontend.git
cd TrainBooking_Frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Configure API endpoint:
Update the API base URL in your service files to match your backend configuration.

4. Start the development server:
```bash
npm start
# or
yarn start
```

5. Open your browser and navigate to:
```
http://localhost:3000
```

## 📱 Application Pages

### Public Pages
- **Login** (`/login`) - User authentication
- **Register** (`/register`) - New user registration

### Protected Pages (Require Authentication)
- **My Tickets** (`/mytickets`) - User's ticket history
- **Schedule** - View train schedules
- **Change Schedule** - Edit schedule information (admin)
- **Analytics** - System analytics and statistics (admin)

## 🔐 Authentication Flow

1. User registers or logs in via `/login` or `/register`
2. JWT token is stored in localStorage
3. Token is included in Authorization header for protected API calls
4. Redirect to login on authentication failure


## 🔗 Links

- **Backend Repository**: [TrainBooking_Backend](https://github.com/MykhailivVolodymyr/TrainBooking_Backend)
- **API Documentation**: Backend Swagger UI
