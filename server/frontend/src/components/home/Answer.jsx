import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, styled } from '@mui/material';
import { authenticateGetAnswer } from '../../service/api';

// Updated styling
const StyledAnswerContainer = styled(Box)({
  padding: '20px',
  backgroundColor: 'rgba(247, 247, 247, 0.5)', // Semi-transparent background
  borderRadius: '8px',
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  marginBottom: '20px',
});

const StyledQuestion = styled(Typography)({
  fontWeight: 'bold',
  marginBottom: '10px',
  color: '#000', // Adjust text color for visibility
});

const StyledAnswer = styled(Typography)({
  marginBottom: '10px',
  color: '#000', // Adjust text color for visibility
});

const StyledHeader = styled(Typography)({
  textAlign: 'center',
  fontSize: '24px',
  fontWeight: 'bold',
  marginBottom: '20px',
  color: '#000', // Adjust text color for visibility
});

const StyledButton = styled(Button)({
  display: 'block',
  margin: '0 auto',
  marginTop: '20px',
});

const Answer = () => {
    const [answers, setAnswers] = useState([]);
    const [error, setError] = useState("");

    const fetchAnswer = async () => {
        try {
            const response = await authenticateGetAnswer();
            if (response.status === 200) {
                setAnswers(response.data.data); // Adjust based on your API response structure
            } else {
                setError('Error loading answers');
            }
        } catch (error) {
            console.error("Error occurred while fetching answers:", error);
            setError('Error loading answers');
        }
    };

    useEffect(() => {
        fetchAnswer();
    }, []);

    const reloadAnswers = () => {
        fetchAnswer();
    };

    return (
        <Box>
            <StyledHeader>FAQs</StyledHeader>
            {error && <Typography color="error">{error}</Typography>}
            {answers.map((answer, index) => (
                <StyledAnswerContainer key={index}>
                    <StyledQuestion>Question: {answer.question}</StyledQuestion>
                    {answer.answer && <StyledAnswer>Answer: {answer.answer}</StyledAnswer>} {/* Adjust based on your answer object's structure */}
                </StyledAnswerContainer>
            ))}
            <StyledButton variant="contained" color="primary" onClick={reloadAnswers}>Reload Answers</StyledButton>
        </Box>
    );
};

export default Answer;
