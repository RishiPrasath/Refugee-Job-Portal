import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login';
import Registration from './components/auth/Registration';
import Home from './components/Home/Home';
import NavBar from './components/NavBar/NavBar';
import ViewJobPostings from './components/roles/Employer/ViewJobPostings';
import AddJobPostings from './components/roles/Employer/AddJobPostings';
import EmployerJobPosting from './components/roles/Employer/JobPosting'; // Renamed to avoid confusion
import ViewCandidates from './components/roles/CaseWorker/ViewCandidates';
import DisplayCandidate from './components/roles/CaseWorker/DisplayCandidate';
import SearchJobPostings from './components/roles/Candidate/searchJobPostings';
import CandidateJobPosting from './components/roles/Candidate/JobPosting'; 
import CandidateProfile from './components/roles/Candidate/CandidateProfile'; // Import the CandidateProfile component
import ApplyForJob from './components/roles/Candidate/ApplyForJob'; 
import { GlobalStateProvider } from './globalState/globalState';
import './App.css';

const App = () => {
    return (
        <GlobalStateProvider>
            <Router>
                <NavBar />
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Registration />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/viewjobpostings" element={<ViewJobPostings />} />
                    <Route path="/addjobpostings" element={<AddJobPostings />} />
                    <Route path="/jobposting/:company/:jobId" element={<EmployerJobPosting />} /> {/* Renamed to avoid confusion */}
                    <Route path="/viewcandidates" element={<ViewCandidates />} />
                    <Route path="/candidate/:email" element={<DisplayCandidate />} />
                    <Route path="/searchjobpostings" element={<SearchJobPostings />} />
                    <Route path="/candidate-job-view/:company/:jobId" element={<CandidateJobPosting />} /> {/* Updated to correct component */}
                    <Route path="/profile" element={<CandidateProfile />} />
                    <Route path="/applyForJob/:company/:jobTitle/:jobId" element={<ApplyForJob />} />
                    <Route path="/candidateProfile" element={<CandidateProfile />} /> {/* Add the CandidateProfile route */}
                </Routes>
            </Router>
        </GlobalStateProvider>
    );
}

export default App;