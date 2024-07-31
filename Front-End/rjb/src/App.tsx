import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login';
import Registration from './components/auth/Registration';
import Home from './components/Home/Home';
import NavBar from './components/NavBar/NavBar';
import ViewJobPostings from './components/roles/Employer/ViewJobPostings';
import AddJobPostings from './components/roles/Employer/AddJobPostings';
import JobPosting from './components/roles/Employer/JobPosting';
import JobApplicationControl from './components/roles/Employer/JobApplicationControl';
import CreateInterview from './components/roles/Employer/CreateInterview';
import ViewCandidates from './components/roles/CaseWorker/ViewCandidates';
import DisplayCandidate from './components/roles/CaseWorker/DisplayCandidate';
import SearchJobPostings from './components/roles/Candidate/searchJobPostings';
import CandidateJobPosting from './components/roles/Candidate/JobPosting';
import CandidateProfile from './components/roles/Candidate/CandidateProfile';
import ApplyForJob from './components/roles/Candidate/ApplyForJob';
import UpcomingInterviews from './components/roles/Employer/UpcomingInterviews';
import CandidateUpcomingInterviews from './components/roles/Candidate/UpcomingInterviews';
import JobOfferForm from './components/roles/Employer/JobOfferForm';
import CandidateJobOffers from './components/roles/Candidate/CandidateJobOffers';
import ApplicationStatus from './components/roles/Candidate/ApplicationStatus';
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
                    <Route path="/jobposting/:company/:jobId" element={<JobPosting />} />
                    <Route path="/jobapplication/:applicationId" element={<JobApplicationControl />} />
                    <Route path="/create-interview/:applicationId" element={<CreateInterview />} />
                    <Route path="/viewcandidates" element={<ViewCandidates />} />
                    <Route path="/candidate/:email" element={<DisplayCandidate />} />
                    <Route path="/searchjobpostings" element={<SearchJobPostings />} />
                    <Route path="/candidate-job-view/:company/:jobId" element={<CandidateJobPosting />} />
                    <Route path="/profile" element={<CandidateProfile />} />
                    <Route path="/applyForJob/:company/:jobTitle/:jobId" element={<ApplyForJob />} />
                    <Route path="/candidateProfile" element={<CandidateProfile />} />
                    <Route path="/upcoming-interviews" element={<UpcomingInterviews />} />
                    <Route path="/candidate-upcoming-interviews" element={<CandidateUpcomingInterviews />} />
                    <Route path="/joboffer/:applicationId" element={<JobOfferForm />} />
                    <Route path="/candidate-job-offers" element={<CandidateJobOffers />} />
                    <Route path="/job-applications" element={<ApplicationStatus />} />
                </Routes>
            </Router>
        </GlobalStateProvider>
    );
}

export default App;