import React, { useState, useEffect } from 'react';
import { Box, List, ListItem, ListItemText, Typography, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import { useGlobalState } from '../../globalState/globalState';

interface Chat {
    id: number;
    name: string;
    lastMessage: string;
}

const ChatMenu: React.FC = () => {
    const [chats, setChats] = useState<Chat[]>([]);
    const { userID } = useGlobalState();

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const response = await fetch(`http://localhost:8000/chats/getchats/${userID}/`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setChats(data);
                console.log("Chats: ", data);
            } catch (error) {
                console.error('Error fetching chats:', error);
            }
        };

        fetchChats();
    }, [userID]);

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', p: 2 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>Your Chats</Typography>
            <Paper elevation={3} sx={{ flexGrow: 1, overflowY: 'auto' }}>
                <List>
                    {chats.map(chat => (
                        <ListItem button component={Link} to={`/chat/${chat.id}`} key={chat.id}>
                            <ListItemText
                                primary={chat.name}
                                secondary={chat.lastMessage}
                            />
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Box>
    );
};

export default ChatMenu;