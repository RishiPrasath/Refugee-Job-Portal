import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button, Typography, Paper, useMediaQuery, useTheme } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useGlobalState } from '../../globalState/globalState';

interface Message {
    chatGroupId: number;
    messageId: number;
    content: string;
    senderId: number;
    timestamp: string;
}

const Chat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [recipientName, setRecipientName] = useState('');
    const [recipientRole, setRecipientRole] = useState('');
    const { chatGroupId } = useParams<{ chatGroupId: string }>();
    const { userID: currentUserId } = useGlobalState();
    const currentUserIdNumber = Number(currentUserId);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [chatSocket, setChatSocket] = useState<WebSocket | null>(null);
    const [isSocketOpen, setIsSocketOpen] = useState(false);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch(`http://localhost:8000/chats/getmessages/${chatGroupId}/${currentUserIdNumber}/`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setMessages(data.messages);
                setRecipientName(data.recipient_name);
                setRecipientRole(data.recipient_role);
                console.log("Messages: ", data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();
    }, [chatGroupId, currentUserIdNumber]);

    useEffect(() => {
        const socket = new WebSocket(`ws://localhost:8000/ws/chat/${chatGroupId}/`);
        socket.onopen = () => {
            console.log(`Connected to chat group: ${chatGroupId}`);
            setIsSocketOpen(true);
        };

        socket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            console.log('Received message:', data);
            setMessages((prevMessages) => [...prevMessages, data]);
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        socket.onclose = (e) => {
            console.error('Chat socket closed unexpectedly:', e);
            setIsSocketOpen(false);
        };

        setChatSocket(socket);

        return () => {
            console.log('Closing WebSocket connection');
            socket.close();
        };
    }, [chatGroupId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSendMessage = () => {
        if (newMessage.trim() && chatSocket && isSocketOpen) {
            const message: Message = {
                chatGroupId: Number(chatGroupId),
                messageId: 0,
                content: newMessage,
                senderId: currentUserIdNumber,
                timestamp: new Date().toISOString(),
            };
            chatSocket.send(JSON.stringify(message));
            setNewMessage('');
        } else {
            console.error('WebSocket is not open. Unable to send message.');
        }
    };

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6">{recipientName} ({recipientRole})</Typography>
            </Box>
            <Paper 
                elevation={3} 
                sx={{ 
                    flexGrow: 1, 
                    overflowY: 'auto', 
                    p: 2, 
                    display: 'flex', 
                    flexDirection: 'column'
                }}
            >
                {messages.map((message) => (
                    <Box
                        key={message.messageId}
                        sx={{
                            display: 'flex',
                            justifyContent: message.senderId === currentUserIdNumber ? 'flex-end' : 'flex-start',
                            mb: 1,
                        }}
                    >
                        <Box>
                            <Paper
                                elevation={1}
                                sx={{
                                    p: 1,
                                    backgroundColor: message.senderId === currentUserIdNumber ? 'primary.light' : 'grey.300',
                                    color: message.senderId === currentUserIdNumber ? 'white' : 'black',
                                    maxWidth: '70%',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                }}
                            >
                                <Typography variant="body1">{message.content}</Typography>
                            </Paper>
                            <Typography variant="caption" sx={{ ml: 1 }}>
                                {new Date(message.timestamp).toLocaleTimeString()}
                            </Typography>
                        </Box>
                    </Box>
                ))}
                <div ref={messagesEndRef} />
            </Paper>
            <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', display: 'flex', alignItems: 'center' }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    sx={{ mx: 1 }}
                />
                <Button variant="contained" onClick={handleSendMessage}>
                    Send
                </Button>
            </Box>
        </Box>
    );
};

export default Chat;