import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home';
import NavBar from './components/NavBar/NavBar';
import ProfileManagement from './components/ProfileManagement/ProfileManagement';
import JobPostings from './components/JobPostings/JobPostings';
import JobPostingDetails from './components/JobPostingDetails/JobPostingDetails'; // Import the JobPostingDetails component
import JobApplication from './components/JobApplication/JobApplication'; // Import the JobApplication component
import InterviewScheduling from './components/InterviewScheduling/InterviewScheduling'; // Import the InterviewScheduling component
import ActivityMonitoringDashboard from './components/ActivityMonitoringDashboard/ActivityMonitoringDashboard'; // Import the new component

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile-management" element={<ProfileManagement />} />
        <Route path="/job-postings" element={<JobPostings />} />
        <Route path="/job-posting-details" element={<JobPostingDetails />} />
        <Route path="/job-application" element={<JobApplication />} />
        <Route path="/interview-scheduling" element={<InterviewScheduling />} />
        <Route path="/activity-monitoring-dashboard" element={<ActivityMonitoringDashboard />} /> {/* Add new route */}
      </Routes>
    </Router>
  );
}

export default App;
