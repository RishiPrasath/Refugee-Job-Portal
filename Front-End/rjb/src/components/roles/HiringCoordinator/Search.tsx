import React, { useState } from 'react';
import { TextField, InputAdornment, Box, Container, Typography, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SearchResults from './Search/SearchResults';

const Search: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [standardizedHeight, setStandardizedHeight] = useState<number | null>(null);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:8000/coordinators/search?q=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const uniqueResults = new Map();

      [...data.candidates, ...data.job_postings, ...data.employers].forEach(result => {
        uniqueResults.set(result.id, result);
      });

      const resultsArray = Array.from(uniqueResults.values());
      setSearchResults(resultsArray);

      const heights = resultsArray.map(result => {
        const tempCard = document.createElement('div');
        tempCard.style.visibility = 'hidden';
        tempCard.style.position = 'absolute';
        tempCard.style.width = '100%';
        tempCard.style.padding = '16px';
        tempCard.innerHTML = `
          <div style="display: flex; flex-direction: column;">
            <div style="display: flex; align-items: center;">
              <img src="${result.image || ''}" style="width: 56px; height: 56px; margin-right: 8px;" />
              <h6>${result.full_name || result.job_title}</h6>
            </div>
            <div>Email: ${result.email || ''}</div>
            <div>Immigration Status: ${result.immigration_status || ''}</div>
            <div>Location: ${result.location || ''}</div>
            <div>Compensation: ${result.compensation_amount || ''} ${result.compensation_type || ''}</div>
            <div>Job Type: ${result.job_type || ''}</div>
            <div>Employment Term: ${result.employment_term || ''}</div>
            <div>${result.ISL ? 'Immigration Salary List' : ''}</div>
            <div>Skills: ${result.skills ? result.skills.join(', ') : ''}</div>
          </div>
        `;
        document.body.appendChild(tempCard);
        const height = tempCard.offsetHeight;
        document.body.removeChild(tempCard);
        return height;
      });

      const maxHeight = Math.max(...heights);
      setStandardizedHeight(maxHeight);
    } catch (error) {
      console.error('Error searching:', error);
      setSearchResults([]);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Container maxWidth="md">
      <Box display="flex" flexDirection="column" alignItems="center" mt={8}>
        <Typography variant="h4" gutterBottom>
          Search
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for candidates, job postings, or employers..."
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyPress={handleKeyPress}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSearch} edge="end">
                  <SearchIcon color="primary" />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            maxWidth: '600px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '28px',
              '& fieldset': {
                borderColor: 'primary.main',
                borderWidth: 2,
              },
              '&:hover fieldset': {
                borderColor: 'primary.dark',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.dark',
              },
            },
            '& .MuiInputBase-input': {
              padding: '14px 14px 14px 20px',
            },
          }}
        />
      </Box>

      <SearchResults results={searchResults} standardizedHeight={standardizedHeight} />
    </Container>
  );
};

export default Search;