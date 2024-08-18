import React from 'react';
import { Box, Typography, Grid, Card } from '@mui/material';
import { Link } from 'react-router-dom';
import CandidateCard from './CandidateCard';
import JobPostingCard from './JobPostingCard';
import EmployerCard from './EmployerCard';

interface SearchResultsProps {
  results: any[];
  standardizedHeight: number | null;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, standardizedHeight }) => (
  <Box sx={{ mt: 4, width: '100%' }}>
    <Typography variant="h6" gutterBottom>
      Search Results
    </Typography>
    {results.length > 0 ? (
      <Grid container spacing={2}>
        {results.map((result, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Link to={result.routetopage || '/'} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Card sx={{ minHeight: standardizedHeight ? `${standardizedHeight}px` : 'auto' }}>
                {result.type === 'candidate' && <CandidateCard result={result} />}
                {result.type === 'job_posting' && <JobPostingCard result={result} />}
                {result.type === 'employer' && <EmployerCard result={result} />}
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    ) : (
      <Typography variant="body1">
        No results found. Try searching for something!
      </Typography>
    )}
  </Box>
);

export default SearchResults;