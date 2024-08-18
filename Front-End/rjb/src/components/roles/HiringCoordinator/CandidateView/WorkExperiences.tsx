import React from 'react';
import { Box, Typography, Card, CardContent, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface WorkExperience {
    job_title: string;
    employer: string;
    start_date: string;
    end_date: string;
    description: string;
}

interface WorkExperiencesProps {
    workExperiences: WorkExperience[];
}

const WorkExperiences: React.FC<WorkExperiencesProps> = ({ workExperiences }) => {
    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" style={{ display: 'flex', alignItems: 'center' }}>
                    <WorkIcon style={{ marginRight: '8px' }} /> Work Experiences
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Box mt={3}>
                    {workExperiences.map((experience, index) => (
                        <Box key={index} mb={2}>
                            <Card variant="elevation" elevation={3} style={{ marginBottom: '10px', borderRadius: '8px' }}>
                                <CardContent>
                                    <Box display="flex" mb={1}>
                                        <Typography variant="body2" style={{ minWidth: '100px' }}><strong>Job Title:</strong></Typography>
                                        <Typography variant="body2">{experience.job_title}</Typography>
                                    </Box>
                                    <Box display="flex" mb={1}>
                                        <Typography variant="body2" style={{ minWidth: '100px' }}><strong>Employer:</strong></Typography>
                                        <Typography variant="body2">{experience.employer}</Typography>
                                    </Box>
                                    <Box display="flex" mb={1}>
                                        <Typography variant="body2" style={{ minWidth: '100px' }}><strong>Duration:</strong></Typography>
                                        <Typography variant="body2">{experience.start_date} - {experience.end_date}</Typography>
                                    </Box>
                                    <Box display="flex" mb={1}>
                                        <Typography variant="body2" style={{ minWidth: '100px' }}><strong>Description:</strong></Typography>
                                        <Typography variant="body2">{experience.description}</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Box>
                    ))}
                </Box>
            </AccordionDetails>
        </Accordion>
    );
};

export default WorkExperiences;