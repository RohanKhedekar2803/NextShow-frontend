import './App.css';
import SignUp from './pages/SignUp';
import About from './pages/About';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/homepage';
import TheatersPage from './pages/TheatersPage';
import EventPage from './pages/EventPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailedPage from './pages/PaymentFailedPage';
import ProtectedRoute from './pages/ProtectedRoute';
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/theaterPage" element={<TheatersPage />} />
        <Route path="/theaterPage/:filtertitle" element={<TheatersPage />} />

        {/* 🔒 Protected route */}
        <Route
          path="/events/:id"
          element={
            <ProtectedRoute>
              <EventPage />
            </ProtectedRoute>
          }
        />

        <Route path="/paymentsucceded" element={<PaymentSuccessPage />} />
        <Route path="/failed" element={<PaymentFailedPage />} />
      </Routes>

      <Toaster position="top-right" />
    </Router>
  );
}

export default App;
