import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';

interface WorkExperience {
  id: number;
  company: string;
  role: string;
  start_year: number;
  end_year: number;
  description: string;
  candidate_id: number;
}

interface WorkExperiencesProps {
  workExperiences: WorkExperience[];
}

const WorkExperiences: React.FC<WorkExperiencesProps> = ({ workExperiences }) => {
  return (
    <Box mt={3}>
      <Card>
        <CardContent>
          <Typography variant="h6" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <WorkIcon style={{ marginRight: '8px' }} /> Work Experiences
          </Typography>
          {workExperiences.map(experience => (
            <Box key={experience.id} mb={2}>
              <Card variant="elevation" elevation={3} style={{ marginBottom: '10px', borderRadius: '8px' }}>
                <CardContent>
                  <Box display="flex" mb={1}>
                    <Typography variant="body2" style={{ minWidth: '100px' }}><strong>Company:</strong></Typography>
                    <Typography variant="body2">{experience.company}</Typography>
                  </Box>
                  <Box display="flex" mb={1}>
                    <Typography variant="body2" style={{ minWidth: '100px' }}><strong>Role:</strong></Typography>
                    <Typography variant="body2">{experience.role}</Typography>
                  </Box>
                  <Box display="flex" mb={1}>
                    <Typography variant="body2" style={{ minWidth: '100px' }}><strong>Years:</strong></Typography>
                    <Typography variant="body2">{experience.start_year} - {experience.end_year}</Typography>
                  </Box>
                  <Box display="flex" mb={1}>
                    <Typography variant="body2" style={{ minWidth: '100px' }}><strong>Description:</strong></Typography>
                    <Typography variant="body2">{experience.description}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))}
        </CardContent>
      </Card>
    </Box>
  );
};

export default WorkExperiences;