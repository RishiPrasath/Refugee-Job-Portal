import React from 'react';
import { Box, Typography, Card, CardContent, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface Qualification {
    school: string;
    qualification: string;
    start_year: number;
    end_year: number;
}

interface QualificationsProps {
    qualifications: Qualification[];
}

const Qualifications: React.FC<QualificationsProps> = ({ qualifications }) => {
    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" style={{ display: 'flex', alignItems: 'center' }}>
                    <SchoolIcon style={{ marginRight: '8px' }} /> Qualifications
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Box mt={3}>
                    {qualifications.map((qualification, index) => (
                        <Card key={index} variant="elevation" elevation={3} style={{ marginBottom: '10px', borderRadius: '8px' }}>
                            <CardContent>
                                <Typography variant="body2">
                                    <strong>{qualification.school}</strong>, {qualification.qualification} ({qualification.start_year} - {qualification.end_year})
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </AccordionDetails>
        </Accordion>
    );
};

export default Qualifications;