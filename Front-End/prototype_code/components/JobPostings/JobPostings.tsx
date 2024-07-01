import React from 'react';
import { Card, CardContent, Typography, Grid, Button, Box, Chip } from '@mui/material';

// Define interface for job postings
interface JobPosting {
  job_id: number;
  employer_id: number;
  job_title: string;
  job_description: string;
  requirements: string;
  location: string;
  compensation_amount: number;
  compensation_type: string;
  job_type: string;
  employment_type: string;
  job_duration: string;
  status: string;
  created_at: string;
  updated_at: string;
  immigration_salary_list: boolean;
  skills: string[];
}

interface Data {
  jobPostings: JobPosting[];
}

// Sample data
const data: Data = {
  jobPostings: [
    {
      job_id: 1,
      employer_id: 2,
      job_title: 'Software Developer',
      job_description: 'We are looking for a skilled software developer with experience in JavaScript and React. The ideal candidate will have a strong understanding of web development principles and be able to work in a fast-paced environment. Responsibilities include developing new user-facing features, building reusable code and libraries for future use, and ensuring the technical feasibility of UI/UX designs.',
      requirements: '2+ years of experience',
      location: 'London',
      compensation_amount: 40000,
      compensation_type: 'Per Hour',
      job_type: 'Full Time',
      employment_type: 'Remote',
      job_duration: 'Permanent',
      status: 'Open',
      created_at: '2024-06-01T10:00:00Z',
      updated_at: '2024-06-02T12:00:00Z',
      immigration_salary_list: true,
      skills: ['JavaScript', 'React', 'Node.js']
    },
    {
      job_id: 2,
      employer_id: 3,
      job_title: 'Data Analyst',
      job_description: 'Seeking a data analyst with proficiency in SQL and Python. The candidate will be responsible for analyzing large datasets to provide actionable insights for our business. Responsibilities include data mining, data cleaning, and data visualization to support decision-making processes.',
      requirements: '1+ years of experience',
      location: 'Manchester',
      compensation_amount: 35000,
      compensation_type: 'Monthly',
      job_type: 'Part Time',
      employment_type: 'On Site',
      job_duration: '6 Months',
      status: 'Open',
      created_at: '2024-05-25T10:00:00Z',
      updated_at: '2024-05-26T12:00:00Z',
      immigration_salary_list: false,
      skills: ['SQL', 'Python', 'Excel']
    },
    {
      job_id: 3,
      employer_id: 4,
      job_title: 'Marketing Manager',
      job_description: 'Seeking an experienced marketing manager to lead our marketing efforts. The candidate will develop and implement marketing strategies to increase brand awareness and drive sales. Responsibilities include managing marketing campaigns, analyzing market trends, and collaborating with the sales team to align marketing strategies with business goals.',
      requirements: '5+ years of experience',
      location: 'Birmingham',
      compensation_amount: 80000,
      compensation_type: 'Annual',
      job_type: 'Full Time',
      employment_type: 'On Site',
      job_duration: 'Permanent',
      status: 'Open',
      created_at: '2024-07-01T10:00:00Z',
      updated_at: '2024-07-02T12:00:00Z',
      immigration_salary_list: true,
      skills: ['Marketing', 'SEO', 'Analytics']
    },
    {
      job_id: 4,
      employer_id: 5,
      job_title: 'Nurse',
      job_description: 'Seeking a compassionate and dedicated nurse to join our healthcare team. Responsibilities include providing patient care, administering medications, and collaborating with doctors to develop care plans.',
      requirements: '3+ years of experience in nursing',
      location: 'Bristol',
      compensation_amount: 30000,
      compensation_type: 'Annual',
      job_type: 'Full Time',
      employment_type: 'On Site',
      job_duration: 'Permanent',
      status: 'Open',
      created_at: '2024-06-10T10:00:00Z',
      updated_at: '2024-06-11T12:00:00Z',
      immigration_salary_list: true,
      skills: ['Patient Care', 'Medication Administration', 'Care Planning']
    },
    {
      job_id: 5,
      employer_id: 6,
      job_title: 'Teacher',
      job_description: 'Looking for an experienced teacher to educate students and create engaging lesson plans. Responsibilities include preparing lessons, grading assignments, and maintaining a positive learning environment.',
      requirements: '2+ years of teaching experience',
      location: 'Liverpool',
      compensation_amount: 35000,
      compensation_type: 'Annual',
      job_type: 'Full Time',
      employment_type: 'On Site',
      job_duration: 'Permanent',
      status: 'Open',
      created_at: '2024-06-15T10:00:00Z',
      updated_at: '2024-06-16T12:00:00Z',
      immigration_salary_list: true,
      skills: ['Teaching', 'Lesson Planning', 'Classroom Management']
    },
    {
      job_id: 6,
      employer_id: 7,
      job_title: 'Civil Engineer',
      job_description: 'Seeking a civil engineer to design, plan, and oversee construction projects. Responsibilities include conducting site investigations, preparing engineering plans, and ensuring projects comply with regulations.',
      requirements: '4+ years of experience',
      location: 'Glasgow',
      compensation_amount: 50000,
      compensation_type: 'Annual',
      job_type: 'Full Time',
      employment_type: 'On Site',
      job_duration: 'Permanent',
      status: 'Open',
      created_at: '2024-07-01T10:00:00Z',
      updated_at: '2024-07-02T12:00:00Z',
      immigration_salary_list: true,
      skills: ['Design', 'Planning', 'Regulations']
    },
    {
      job_id: 7,
      employer_id: 8,
      job_title: 'Accountant',
      job_description: 'Looking for an accountant to manage financial records, prepare reports, and ensure compliance with financial regulations. Responsibilities include managing accounts payable and receivable, preparing financial statements, and conducting audits.',
      requirements: '3+ years of experience',
      location: 'Edinburgh',
      compensation_amount: 40000,
      compensation_type: 'Annual',
      job_type: 'Full Time',
      employment_type: 'Hybrid',
      job_duration: 'Permanent',
      status: 'Open',
      created_at: '2024-06-20T10:00:00Z',
      updated_at: '2024-06-21T12:00:00Z',
      immigration_salary_list: true,
      skills: ['Financial Analysis', 'Taxation', 'Auditing']
    },
    {
      job_id: 8,
      employer_id: 9,
      job_title: 'Electrician',
      job_description: 'Seeking a skilled electrician to install, maintain, and repair electrical systems. Responsibilities include reading blueprints, troubleshooting electrical issues, and ensuring compliance with safety standards.',
      requirements: '3+ years of experience',
      location: 'Sheffield',
      compensation_amount: 35000,
      compensation_type: 'Annual',
      job_type: 'Full Time',
      employment_type: 'On Site',
      job_duration: 'Permanent',
      status: 'Open',
      created_at: '2024-06-25T10:00:00Z',
      updated_at: '2024-06-26T12:00:00Z',
      immigration_salary_list: true,
      skills: ['Electrical Installation', 'Troubleshooting', 'Safety']
    },
    {
      job_id: 9,
      employer_id: 10,
      job_title: 'Chef',
      job_description: 'Seeking a chef to prepare and cook meals according to recipes and standards. Responsibilities include menu planning, managing kitchen staff, and ensuring food safety.',
      requirements: '5+ years of experience',
      location: 'Brighton',
      compensation_amount: 32000,
      compensation_type: 'Annual',
      job_type: 'Full Time',
      employment_type: 'On Site',
      job_duration: 'Permanent',
      status: 'Open',
      created_at: '2024-07-05T10:00:00Z',
      updated_at: '2024-07-06T12:00:00Z',
      immigration_salary_list: true,
      skills: ['Cooking', 'Menu Planning', 'Food Safety']
    },
    {
      job_id: 10,
      employer_id: 11,
      job_title: 'Pharmacist',
      job_description: 'Looking for a pharmacist to dispense medications and provide pharmaceutical care. Responsibilities include reviewing prescriptions, advising patients on medication use, and managing inventory.',
      requirements: '4+ years of experience',
      location: 'Oxford',
      compensation_amount: 45000,
      compensation_type: 'Annual',
      job_type: 'Full Time',
      employment_type: 'On Site',
      job_duration: 'Permanent',
      status: 'Open',
      created_at: '2024-06-10T10:00:00Z',
      updated_at: '2024-06-11T12:00:00Z',
      immigration_salary_list: true,
      skills: ['Pharmaceutical Care', 'Medication Management', 'Patient Counseling']
    },
    {
      job_id: 11,
      employer_id: 12,
      job_title: 'Construction Worker',
      job_description: 'Looking for a construction worker to assist in building and maintaining structures. Responsibilities include operating machinery, following safety guidelines, and assisting skilled workers.',
      requirements: '2+ years of experience',
      location: 'Leeds',
      compensation_amount: 30000,
      compensation_type: 'Annual',
      job_type: 'Full Time',
      employment_type: 'On Site',
      job_duration: 'Permanent',
      status: 'Open',
      created_at: '2024-07-01T10:00:00Z',
      updated_at: '2024-07-02T12:00:00Z',
      immigration_salary_list: false,
      skills: ['Machinery Operation', 'Safety', 'Assisting']
    },
    {
      job_id: 12,
      employer_id: 13,
      job_title: 'Customer Support Specialist',
      job_description: 'Looking for a customer support specialist with great communication skills. The candidate will be responsible for handling customer inquiries, providing product support, and ensuring customer satisfaction. Responsibilities include responding to customer queries, resolving issues, and maintaining a positive relationship with customers.',
      requirements: '2+ years of experience',
      location: 'Remote',
      compensation_amount: 40000,
      compensation_type: 'Annual',
      job_type: 'Full Time',
      employment_type: 'Remote',
      job_duration: 'Permanent',
      status: 'Open',
      created_at: '2024-06-05T10:00:00Z',
      updated_at: '2024-06-06T12:00:00Z',
      immigration_salary_list: false,
      skills: ['Support', 'Communication', 'Empathy']
    },
    {
      job_id: 13,
      employer_id: 14,
      job_title: 'Data Scientist',
      job_description: 'Seeking a data scientist with experience in machine learning. The candidate will be responsible for developing algorithms to analyze complex data sets and generate insights. Responsibilities include building predictive models, implementing machine learning techniques, and collaborating with other teams to integrate data-driven solutions.',
      requirements: '3+ years of experience',
      location: 'Remote',
      compensation_amount: 90000,
      compensation_type: 'Annual',
      job_type: 'Full Time',
      employment_type: 'Remote',
      job_duration: 'Permanent',
      status: 'Open',
      created_at: '2024-05-01T10:00:00Z',
      updated_at: '2024-05-02T12:00:00Z',
      immigration_salary_list: true,
      skills: ['Python', 'R', 'SQL']
    },
    {
      job_id: 14,
      employer_id: 15,
      job_title: 'Business Analyst',
      job_description: 'Looking for a business analyst with experience in data analysis. The candidate will be responsible for gathering and interpreting data, analyzing results, and providing ongoing reports. Responsibilities include developing analysis and reporting capabilities, monitoring performance and quality control plans to identify improvements.',
      requirements: '3+ years of experience',
      location: 'Remote',
      compensation_amount: 70000,
      compensation_type: 'Annual',
      job_type: 'Full Time',
      employment_type: 'Remote',
      job_duration: '1 Year',
      status: 'Open',
      created_at: '2024-07-01T10:00:00Z',
      updated_at: '2024-07-02T12:00:00Z',
      immigration_salary_list: false,
      skills: ['Analysis', 'SQL', 'Excel']
    },
    {
      job_id: 15,
      employer_id: 16,
      job_title: 'System Administrator',
      job_description: 'Seeking a system administrator to manage our IT infrastructure. The candidate will be responsible for ensuring the smooth operation of our computer systems, overseeing system security, and managing network configurations. Responsibilities include installing and configuring software and hardware, managing servers and networks, and ensuring data is backed up.',
      requirements: '4+ years of experience',
      location: 'Remote',
      compensation_amount: 80000,
      compensation_type: 'Annual',
      job_type: 'Full Time',
      employment_type: 'Remote',
      job_duration: 'Permanent',
      status: 'Open',
      created_at: '2024-06-15T10:00:00Z',
      updated_at: '2024-06-16T12:00:00Z',
      immigration_salary_list: false,
      skills: ['Linux', 'Windows', 'Networks']
    },
    {
      job_id: 16,
      employer_id: 17,
      job_title: 'Full Stack Developer',
      job_description: 'Looking for a full stack developer with experience in JavaScript and Python. The candidate will be responsible for developing both client and server software. Responsibilities include writing front-end and back-end code, developing databases and servers, and ensuring cross-platform optimization and responsiveness.',
      requirements: '3+ years of experience',
      location: 'San Diego',
      compensation_amount: 90000,
      compensation_type: 'Annual',
      job_type: 'Full Time',
      employment_type: 'On Site',
      job_duration: 'Permanent',
      status: 'Open',
      created_at: '2024-05-25T10:00:00Z',
      updated_at: '2024-05-26T12:00:00Z',
      immigration_salary_list: true,
      skills: ['JavaScript', 'Python', 'Django']
    },
    {
      job_id: 17,
      employer_id: 18,
      job_title: 'Network Engineer',
      job_description: 'Seeking an experienced network engineer to maintain our network infrastructure. The candidate will be responsible for the design, implementation, and maintenance of network systems. Responsibilities include monitoring network performance, troubleshooting network problems, and ensuring network security.',
      requirements: '4+ years of experience',
      location: 'Houston',
      compensation_amount: 85000,
      compensation_type: 'Annual',
      job_type: 'Full Time',
      employment_type: 'On Site',
      job_duration: 'Permanent',
      status: 'Open',
      created_at: '2024-05-15T10:00:00Z',
      updated_at: '2024-05-16T12:00:00Z',
      immigration_salary_list: false,
      skills: ['Networking', 'Security', 'Cisco']
    },
    {
      job_id: 18,
      employer_id: 19,
      job_title: 'Mobile Developer',
      job_description: 'Looking for a mobile developer with experience in Android and iOS development. The candidate will be responsible for developing mobile applications that meet the needs of our users. Responsibilities include designing and building advanced applications for the Android and iOS platforms, collaborating with cross-functional teams to define, design, and ship new features, and continuously discovering, evaluating, and implementing new technologies to maximize development efficiency.',
      requirements: '3+ years of experience',
      location: 'Remote',
      compensation_amount: 70000,
      compensation_type: 'Annual',
      job_type: 'Contract',
      employment_type: 'Remote',
      job_duration: '1 Year',
      status: 'Open',
      created_at: '2024-07-05T10:00:00Z',
      updated_at: '2024-07-06T12:00:00Z',
      immigration_salary_list: true,
      skills: ['Android', 'iOS', 'ReactNative']
    },
    {
      job_id: 19,
      employer_id: 20,
      job_title: 'Content Writer',
      job_description: 'Looking for a content writer with excellent writing skills. The candidate will be responsible for creating engaging content for various digital platforms. Responsibilities include researching topics, writing and editing articles, and optimizing content for search engines.',
      requirements: '2+ years of experience',
      location: 'Remote',
      compensation_amount: 40000,
      compensation_type: 'Annual',
      job_type: 'Part Time',
      employment_type: 'Remote',
      job_duration: '1 Year',
      status: 'Open',
      created_at: '2024-06-01T10:00:00Z',
      updated_at: '2024-06-02T12:00:00Z',
      immigration_salary_list: false,
      skills: ['Writing', 'Editing', 'SEO']
    },
    {
      job_id: 20,
      employer_id: 21,
      job_title: 'SEO Specialist',
      job_description: 'Looking for an SEO specialist to improve our search engine rankings. The candidate will be responsible for developing and implementing SEO strategies to increase online visibility and organic traffic. Responsibilities include keyword research, optimizing website content, and analyzing SEO performance to make data-driven decisions.',
      requirements: '3+ years of experience',
      location: 'Remote',
      compensation_amount: 60000,
      compensation_type: 'Annual',
      job_type: 'Contract',
      employment_type: 'Remote',
      job_duration: '1 Year',
      status: 'Open',
      created_at: '2024-07-01T10:00:00Z',
      updated_at: '2024-07-02T12:00:00Z',
      immigration_salary_list: true,
      skills: ['SEO', 'Analytics', 'Content']
    }
  ]
};

const JobPostings: React.FC = () => {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Job Postings
      </Typography>
      <Grid container spacing={3}>
        {data.jobPostings.map((job) => (
          <Grid item xs={12} md={6} key={job.job_id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5">{job.job_title}</Typography>
                <Typography sx={{ marginTop: 1, marginBottom: 2 }} variant="body2">{job.job_description}</Typography>
                <Typography variant="body2"><strong>Requirements:</strong> {job.requirements}</Typography>
                <Typography variant="body2"><strong>Location:</strong> {job.location}</Typography>
                <Typography variant="body2"><strong>Compensation:</strong> {job.compensation_amount} ({job.compensation_type})</Typography>
                <Typography variant="body2"><strong>Job Type:</strong> {job.job_type}</Typography>
                <Typography variant="body2"><strong>Employment Type:</strong> {job.employment_type}</Typography>
                <Typography variant="body2"><strong>Job Duration:</strong> {job.job_duration}</Typography>
                {job.immigration_salary_list && (
                  <Chip label="Immigration Salary List" color="secondary" sx={{ marginTop: 2 }} />
                )}
                <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
                  {job.skills.map((skill, index) => (
                    <Chip key={index} label={skill} color="success" sx={{ borderRadius: '16px' }} />
                  ))}
                </Box>
              </CardContent>
              <Box mt={2} sx={{ flexGrow: 0 }}>
                <Button sx={{ marginBottom: 2, marginLeft: 2 }} variant="contained" color="primary">
                  View Details
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default JobPostings;
