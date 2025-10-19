import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Meetings from './pages/Meetings';
import MyFirstMeeting from './pages/MyFirstMeeting';
import TwentyQuestions from './pages/TwentyQuestions';
import ContactUs from './pages/ContactUs';
import AboutGamblersAnonymous from './pages/AboutGamblersAnonymous';
import EventsAndAnnouncements from './pages/EventsAndAnnouncements';
import MembersOnly from './pages/MembersOnly';
import TwelveStepsAndUnityProgram from './pages/TwelveStepsAndUnityProgram';
import GAManon from './pages/GAManon';
import PublicRelations from './pages/PublicRelations';
import FAQ from './pages/FAQ';
import HelpForGambling from './pages/HelpForGambling';

// Protected Pages
import MembersOnlyPrivate from './pages/MembersOnlyPrivate';

// Auth Pages
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';

// Admin Pages
import AdminSetup from './components/Admin/AdminSetup';
import InitialSetup from './pages/InitialSetup';

/**
 * App Component - Main routing structure
 * 
 * Routes are organized as:
 * - Public pages (anyone can access)
 * - Protected pages (requires authentication - wrapped with ProtectedRoute)
 * - Auth pages (Login, SignUp)
 */
const App = () => {
  return (
    <Router>
      <Header />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/meetings" element={<Meetings />} />
          <Route path="/myfirstmeeting" element={<MyFirstMeeting />} />
          <Route path="/20questions" element={<TwentyQuestions />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/aboutgamblersanonymous" element={<AboutGamblersAnonymous />} />
          <Route path="/eventsandannouncements" element={<EventsAndAnnouncements />} />
          <Route path="/membersonly" element={<MembersOnly />} />
          <Route path="/12stepsandunityprogram" element={<TwelveStepsAndUnityProgram />} />
          <Route path="/gamanon" element={<GAManon />} />
          <Route path="/publicrelations" element={<PublicRelations />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/helpforgambling" element={<HelpForGambling />} />

          {/* Protected Routes - Requires Authentication */}
          <Route
            path="/membersonlyprivate"
            element={
              <ProtectedRoute>
                <MembersOnlyPrivate />
              </ProtectedRoute>
            }
          />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Admin Routes */}
          <Route path="/admin/setup" element={<AdminSetup />} />
          <Route path="/initial-setup" element={<InitialSetup />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
};

export default App;