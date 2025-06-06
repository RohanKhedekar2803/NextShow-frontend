
import './App.css'
import SignUp from './pages/SignUp'
import About from './pages/About';

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/homepage';
import TheatersPage from './pages/TheatersPage';
import EventPage from './pages/EventPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailedPage from './pages/PaymentFailedPage';

function App() {


  return (

    <Router>

    {/* The Routes */}
    <Routes>
      <Route path="/" element={<SignUp />} />
      <Route path="/about" element={<About />} />
      <Route path="/homepage" element={<HomePage />} />
      <Route path="/theaterPage" element={<TheatersPage />} />
      <Route path="/theaterPage/:filtertitle" element={<TheatersPage />} />
      <Route path="/events/:id" element={<EventPage />} />
      <Route path="/paymentsucceded" element={<PaymentSuccessPage />} />
      <Route path="/failed" element={<PaymentFailedPage />} />
    </Routes>
  </Router>
    
  )
}

export default App
