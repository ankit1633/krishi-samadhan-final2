import React, { useState, useEffect } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, styled } from '@mui/material';
import { authenticateGetQuestion } from '../../service/api.js';
import AnswerQuestion from './AnswerQuestion.jsx';

const StyledTableContainer = styled(TableContainer)`
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
    @media (max-width: 600px) {
        padding: 0 10px; /* Add padding on small screens */
    }
`;

const StyledTable = styled(Table)`
    @media (max-width: 600px) {
        font-size: 12px; /* Reduce font size on small screens */
    }
`;

const StyledTableCell = styled(TableCell)`
    @media (max-width: 600px) {
        padding: 8px; /* Reduce padding on small screens */
    }
`;

const QuestionList = () => {
    const [questions, setQuestions] = useState([]);
    const [error, setError] = useState(null);
    const [openAnswerDialog, setOpenAnswerDialog] = useState(false); // State to control the visibility of the AnswerQuestion dialog
    const [selectedQuestion, setSelectedQuestion] = useState({ email: '', question: '' }); // State to store the selected question

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await authenticateGetQuestion();
                if (response.status === 200) {
                    setQuestions(response.data.data);
                } else {
                    setError('Error loading questions');
                }
            } catch (error) {
                console.error("Error occurred while fetching questions :", error);
                setError('Error loading questions');
            }
        };

        fetchQuestions();
    }, []); // Empty dependency array ensures useEffect runs only once

    // Function to handle opening the AnswerQuestion dialog
    const handleOpenAnswerDialog = (email, question) => {
        setSelectedQuestion({ email, question }); // Set the selected question
        setOpenAnswerDialog(true); // Open the AnswerQuestion dialog
    };

    return (
        <StyledTableContainer component={Paper}>
            <StyledTable>
                <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
                    <TableRow>
                        <StyledTableCell>User Email</StyledTableCell>
                        <StyledTableCell>Question</StyledTableCell>
                        <StyledTableCell>Action</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {error ? (
                        <TableRow>
                            <StyledTableCell colSpan={3}>
                                <Typography>{error}</Typography>
                            </StyledTableCell>
                        </TableRow>
                    ) : (
                        questions.map(question => (
                            <TableRow key={question._id} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' } }}>
                                <StyledTableCell>{question.email}</StyledTableCell>
                                <StyledTableCell>{question.question}</StyledTableCell>
                                <StyledTableCell>
                                    <Button
                                        onClick={() => handleOpenAnswerDialog(question.email, question.question)} // Call handleOpenAnswerDialog with email and question parameters
                                        variant="contained"
                                        color="primary"
                                        sx={{ 
                                            fontSize: { xs: '10px', sm: '14px' }, // Responsive font size for button
                                            padding: { xs: '8px', sm: '12px' } // Responsive padding for button
                                        }}
                                    >
                                        Answer
                                    </Button>
                                </StyledTableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </StyledTable>
            {/* Render AnswerQuestion dialog if openAnswerDialog is true */}
            <AnswerQuestion
                open={openAnswerDialog}
                onClose={() => setOpenAnswerDialog(false)}
                email={selectedQuestion.email}
                question={selectedQuestion.question}
            />
        </StyledTableContainer>
    );
};

export default QuestionList;
