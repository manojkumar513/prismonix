import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import JoinNow from './pages/JoinNow';
import SignIn from './pages/SignIn';
import DeveloperForm from './pages/Forms/DeveloperForm';
import InnovatorForm from './pages/Forms/InnovatorForm';
import InvestorForm from './pages/Forms/InvestorForm';
import DeveloperHome from './pages/Home/DeveloperHome';
import InnovatorHome from './pages/Home/InnovatorHome';
import InvestorHome from './pages/Home/InvestorHome';
import MessagingPage from './pages/MessagingPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/join-now" element={<JoinNow />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/developer-form" element={<DeveloperForm />} />
        <Route path="/innovator-form" element={<InnovatorForm />} />
        <Route path="/investor-form" element={<InvestorForm />} />
        <Route path="/developerhome" element={<DeveloperHome />} />
        <Route path="/innovatorhome" element={<InnovatorHome />} />
        <Route path="/investorhome" element={<InvestorHome />} />
        <Route path="/messaging" element={<MessagingPage />} />
      </Routes>
    </Router>
  );
}
export default App;

