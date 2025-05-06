# 🌟 JobHub | Modern Full-Stack Job Board

<div align="center">
  <img src="https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
</div>

<p align="center">
  A modern, responsive job board application with advanced features like real-time search, intelligent error handling, elegant animations, and optimized performance for handling 10,000+ job listings.
</p>

---

## ✨ Features

### 🎨 Frontend Features

#### User Interface

- **Modern Design**: Clean, minimalist UI with focus on readability and accessibility
- **Fully Responsive**: Optimized for all devices (mobile, tablet, desktop)
- **Elegant Animations**: Smooth transitions and loading states
- **Focus Mode**: Background blur and dimming when viewing job details
- **Interactive Components**: Hover effects and visual feedback for all interactive elements

#### Performance Optimizations

- **Efficient Data Handling**: Client-side filtering and sorting of 10,000+ jobs
- **Optimized Rendering**: Proper pagination with intelligent page number display
- **Loading Skeletons**: Realistic placeholders that match content layout during loading
- **Lazy Loading**: Components load as needed for faster initial page loads

#### Advanced Functionality

- **Powerful Search**: Filter jobs by location with real-time feedback
- **Experience Filtering**: Sort jobs by required experience levels
- **Pagination Controls**: Easy navigation through large result sets with first/prev/next/last buttons
- **Job Detail Modal**: Focus-enhancing modal with backdrop blur effect
- **Responsive Typography**: Font sizes adapt to different screen sizes

#### Error Handling & UX Improvements

- **Intelligent Error States**: Different visualizations based on error type
- **Network Status Detection**: Automatic reconnection attempts when network is available
- **Retry Logic**: Exponential backoff for API request retries
- **User-Friendly Error Messages**: Clear instructions on how to resolve common issues

### 🖥️ Backend Features

#### API Endpoints

- **Optimized Queries**: Efficient database operations for fast response times
- **Flexible Pagination**: Configurable page size with metadata
- **All-Results Option**: Special endpoint parameter to retrieve all jobs at once
- **Location-Based Filtering**: Search by job location with case-insensitive matching

#### Data Management

- **Type Safety**: Full TypeScript implementation for robust code
- **Schema Validation**: Mongoose models with proper field validation
- **Error Handling**: Comprehensive error catching and reporting
- **MongoDB Integration**: Efficient document queries and indexing

---

## 🏗️ Project Structure

```
├── backend/               # Backend code
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── controllers/   # Request handlers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── scripts/       # Utility scripts
│   │   └── server.ts      # Entry point
│   ├── .env               # Environment variables
│   └── package.json       # Dependencies
│
├── frontend/              # Frontend code
│   ├── src/
│   │   ├── app/           # Next.js app router
│   │   ├── api/           # API client
│   │   ├── components/    # React components
│   │   │   ├── JobCard.tsx    # Job listing card
│   │   │   ├── JobModal.tsx   # Job details modal
│   │   │   ├── Filters.tsx    # Search filters
│   │   │   └── SearchBar.tsx  # Search interface
│   │   └── types/         # TypeScript types
│   ├── tailwind.config.js # Tailwind CSS configuration
│   └── package.json       # Dependencies
│
└── Jobs.json              # Job data for import
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB database (local or Atlas)

### Setup and Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/jobhub.git
   cd jobhub
   ```

2. **Backend setup**:

   ```bash
   cd backend
   npm install
   ```

   Create a `.env` file in the backend directory with your MongoDB connection:

   ```
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   ```

   Import job data:

   ```bash
   npm run import-data
   ```

   Start the backend server:

   ```bash
   npm run dev
   ```

3. **Frontend setup**:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

---

## 🔌 API Endpoints

| Endpoint                 | Method | Description                     | Query Parameters            |
| ------------------------ | ------ | ------------------------------- | --------------------------- |
| `/api/jobs`              | GET    | Get all jobs with pagination    | `page`, `limit`, `location` |
| `/api/jobs?limit=0`      | GET    | Get all jobs without pagination | `location` (optional)       |
| `/api/jobs?limit=all`    | GET    | Alternative to get all jobs     | `location` (optional)       |
| `/api/jobs?location=xyz` | GET    | Filter jobs by location         | `page`, `limit` (optional)  |

---

## 🛠️ Technologies Used

### Frontend

- **Next.js**: React framework for production-grade applications
- **TypeScript**: Type-safe JavaScript for better developer experience
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Axios**: Promise-based HTTP client for API requests
- **React Icons**: Icon components for React applications

### Backend

- **Node.js**: JavaScript runtime for server-side code
- **Express.js**: Web framework for building APIs
- **TypeScript**: Type safety across the entire stack
- **MongoDB**: NoSQL database for storing job data
- **Mongoose**: MongoDB object modeling for Node.js

---

## 📱 Responsive Design

The application is fully responsive and optimized for:

- **Mobile devices**: Compact layouts with touch-friendly controls
- **Tablets**: Enhanced layouts with appropriate spacing
- **Desktops**: Advanced filtering and detailed information display
- **Large screens**: Multi-column display for efficient browsing

---

## ✅ Advanced Features

- **Skeleton Loading**: Realistic loading placeholders that match the layout
- **Error Recovery**: Automatic retry logic for network failures
- **Modal Animation**: Smooth entrance and exit animations with focus effects
- **Pagination Optimization**: Smart pagination controls that adapt to screen size
- **Performance Optimization**: Efficient rendering for large datasets

---

## 🔒 Future Enhancements

- User authentication and saved job lists
- Advanced filtering (salary, job category, company)
- Job application tracking
- Company profiles and verified listings
- Email notifications for new job matches

---

<p align="center">
  Made with ❤️ by Your Name
</p>
