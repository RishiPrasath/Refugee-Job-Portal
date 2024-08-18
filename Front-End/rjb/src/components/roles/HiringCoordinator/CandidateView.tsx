import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import CandidateProfile from './CandidateView/CandidateProfile';
import Qualifications from './CandidateView/Qualifications';
import WorkExperiences from './CandidateView/WorkExperiences';
import JobOffers from './CandidateView/JobOffers';
import Applications from './CandidateView/Applications';
import Interviews from './CandidateView/Interviews';
import Skills from './CandidateView/Skills';
import Events from './CandidateView/Events';

interface Event {
    description: string;
    created_at: string; // ISO date string
}

interface Application {
    id: number;
    job_title: string;
    employer: string;
    employer_logo_url: string;
    application_status: string;
    cover_letter: string;
    cv_url: string;
    created_at: string;
}

interface Interview {
    id: number;
    application_id: number;
    date: string;
    start_time: string;
    end_time: string;
    interview_location: string;
    meeting_link: string;
    additional_details: string;
    status: string;
    feedback: string | null;
    job_title: string;
    employer: string;
    interview_type: string;
    logo_url: string | null;
}

interface JobOffer {
    job_title: string;
    employer: string; // Added employer field
    offer_date: string; // Changed to match the new structure
    status: string;
    additional_details: string;
    job_offer_document: string;
}

interface Qualification {
    school: string;
    qualification: string;
    start_year: number;
    end_year: number;
}

interface WorkExperience {
    job_title: string;
    employer: string;
    start_date: string; // ISO date string
    end_date: string; // ISO date string
    description: string; // Added description property
}

interface CandidateProfileData {
    full_name: string;
    email: string;
    date_of_birth: string; // ISO date string
    contact_phone: string;
    emergency_contact_name: string;
    emergency_contact_phone: string;
    linkedin_profile: string;
    github_profile: string;
    summary: string;
    skills: string[];
    accessibility_requirements: string;
    immigration_status: string;
    profile_picture: string; // URL string
    status: string;
    case_worker: string;
    events: Event[];
    applications: Application[];
    interviews: Interview[];
    job_offers: JobOffer[];
    qualifications: Qualification[];
    work_experiences: WorkExperience[];
}

const CandidateView: React.FC = () => {
    const { candidateId } = useParams<{ candidateId: string }>();
    const [candidateData, setCandidateData] = useState<CandidateProfileData | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        fetchCandidateView();
    }, [candidateId]);

    const fetchCandidateView = async () => {
        try {
            const response = await fetch(`http://localhost:8000/coordinators/candidateView/${candidateId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: CandidateProfileData = await response.json();
            console.log(data);
            setCandidateData(data);
        } catch (error) {
            console.error('Error fetching candidate view:', error);
            setMessage('Failed to fetch candidate view.');
        }
    };

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                Candidate View
            </Typography>
            <Typography variant="body1">
                Candidate ID: {candidateId}
            </Typography>
            {message && (
                <Typography variant="body1" color="primary">
                    {message}
                </Typography>
            )}
            {candidateData && (
                <div>
                    <CandidateProfile profile={{
                        full_name: candidateData.full_name,
                        email: candidateData.email,
                        contact_phone: candidateData.contact_phone,
                        profile_picture: candidateData.profile_picture,
                        immigration_status: candidateData.immigration_status,
                        accessibility_requirements: candidateData.accessibility_requirements,
                        date_of_birth: candidateData.date_of_birth,
                        emergency_contact_name: candidateData.emergency_contact_name,
                        emergency_contact_phone: candidateData.emergency_contact_phone,
                        summary: candidateData.summary,
                        linkedin_profile: candidateData.linkedin_profile,
                        github_profile: candidateData.github_profile,
                    }} />
                    
                    {candidateData.skills && candidateData.skills.length > 0 && (
                        <Skills skills={candidateData.skills} />
                    )}
                    {candidateData.qualifications && candidateData.qualifications.length > 0 && (
                        <Qualifications qualifications={candidateData.qualifications} />
                    )}
                    {candidateData.work_experiences && candidateData.work_experiences.length > 0 && (
                        <WorkExperiences workExperiences={candidateData.work_experiences} />
                    )}
                    {candidateData.events && candidateData.events.length > 0 && (
                        <Events events={candidateData.events} />
                    )}
                    {candidateData.job_offers && candidateData.job_offers.length > 0 && (
                        <JobOffers jobOffers={candidateData.job_offers} />
                    )}
                    {candidateData.applications && candidateData.applications.length > 0 && (
                        <Applications applications={candidateData.applications} />
                    )}
                    {candidateData.interviews && candidateData.interviews.length > 0 && (
                        <Interviews interviews={candidateData.interviews} />
                    )}
                    
                </div>
            )}
        </Box>
    );
};

export default CandidateView;