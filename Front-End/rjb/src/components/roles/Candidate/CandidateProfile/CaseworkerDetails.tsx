import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';

interface Caseworker {
  full_name: string;
  email: string;
}

interface CaseworkerDetailsProps {
  caseworker: Caseworker | null;
}

const CaseworkerDetails: React.FC<CaseworkerDetailsProps> = ({ caseworker }) => (
  caseworker && (
    <Box mt={3}>
      <Card>
        <CardContent>
          <Typography variant="h6" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <ContactEmergencyIcon style={{ marginRight: '8px' }} /> Caseworker Details
          </Typography>
          <Typography variant="body1"><strong>Full Name:</strong> {caseworker.full_name}</Typography>
          <Typography variant="body1"><strong>Email:</strong> {caseworker.email}</Typography>
        </CardContent>
      </Card>
    </Box>
  )
);

export default CaseworkerDetails;