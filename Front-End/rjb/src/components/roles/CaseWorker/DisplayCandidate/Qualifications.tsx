import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';

interface Qualification {
  id: number;
  school: string;
  qualification: string;
  start_year: number;
  end_year: number;
  candidate_id: number;
}

interface QualificationsProps {
  qualifications: Qualification[];
}

const Qualifications: React.FC<QualificationsProps> = ({ qualifications }) => {
  return (
    <Box mt={3}>
      <Card>
        <CardContent>
          <Typography variant="h6" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <SchoolIcon style={{ marginRight: '8px' }} /> Qualifications
          </Typography>
          {qualifications.map(qualification => (
            <Card key={qualification.id} variant="elevation" elevation={3} style={{ marginBottom: '10px', borderRadius: '8px' }}>
              <CardContent>
                <Typography variant="body2">
                  <strong>{qualification.school}</strong>, {qualification.qualification} ({qualification.start_year} - {qualification.end_year})
                </Typography>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Qualifications;