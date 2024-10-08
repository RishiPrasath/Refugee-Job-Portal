import React from 'react';
import { Box, Typography, Card, CardContent, Chip } from '@mui/material';
import SkillIcon from '@mui/icons-material/Build';

interface SkillsProps {
    skills: string[];
}

const Skills: React.FC<SkillsProps> = ({ skills }) => {
    return (
        <Box mt={3}>
            <Card>
                <CardContent>
                    <Typography variant="h6" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <SkillIcon style={{ marginRight: '8px' }} /> Skills
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                        {skills.map((skill, index) => (
                            <Chip key={index} label={skill} style={{ backgroundColor: 'green', color: 'white' }} />
                        ))}
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Skills;