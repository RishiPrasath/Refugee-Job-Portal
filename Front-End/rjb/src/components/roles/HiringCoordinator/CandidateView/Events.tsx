import React from 'react';
import { Box, Typography, Card, CardContent, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import EventNoteIcon from '@mui/icons-material/EventNote';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface Event {
    description: string;
    created_at: string; // ISO date string
}

interface EventsProps {
    events: Event[];
}

const Events: React.FC<EventsProps> = ({ events }) => {
    // Sort events by timestamp in descending order
    const sortedEvents = events.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" style={{ display: 'flex', alignItems: 'center' }}>
                    <EventNoteIcon style={{ marginRight: '8px' }} /> Event Log
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Box mt={3}>
                    {sortedEvents.map((event, index) => (
                        <Card key={index} variant="elevation" elevation={3} style={{ marginBottom: '10px', borderRadius: '8px' }}>
                            <CardContent>
                                <Typography variant="body2">
                                    <strong>{new Date(event.created_at).toLocaleString()}:</strong> {event.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </AccordionDetails>
        </Accordion>
    );
}

export default Events;