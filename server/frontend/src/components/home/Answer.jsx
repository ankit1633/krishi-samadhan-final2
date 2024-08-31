import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, styled, useTheme } from '@mui/material';
import { authenticateGetAnswer } from '../../service/api';

// Updated styling with media queries
const StyledAnswerContainer = styled(Box)(({ theme }) => ({
  padding: '20px',
  backgroundColor: 'rgba(247, 247, 247, 0.5)',
  borderRadius: '8px',
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  marginBottom: '20px',
  [theme.breakpoints.down('sm')]: {
    padding: '15px', // Adjust padding for smaller screens
  },
}));

const StyledQuestion = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: '10px',
  color: '#000',
  fontSize: '18px',
  [theme.breakpoints.down('sm')]: {
    fontSize: '16px', // Smaller font size for smaller screens
  },
}));

const StyledAnswer = styled(Typography)(({ theme }) => ({
  marginBottom: '10px',
  color: '#000',
  fontSize: '16px',
  [theme.breakpoints.down('sm')]: {
    fontSize: '14px', // Smaller font size for smaller screens
  },
}));

const StyledHeader = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  fontSize: '24px',
  fontWeight: 'bold',
  marginBottom: '20px',
  color: '#000',
  [theme.breakpoints.down('sm')]: {
    fontSize: '20px', // Smaller font size for smaller screens
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  display: 'block',
  margin: '0 auto',
  marginTop: '20px',
  padding: '10px 20px',
  [theme.breakpoints.down('sm')]: {
    width: '100%', // Full-width button for smaller screens
  },
}));

const Answer = () => {
  const theme = useTheme(); // Accessing the MUI theme object

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
    <Box sx={{ padding: '20px', maxWidth: '800px', margin: 'auto', [theme.breakpoints.down('sm')]: { padding: '10px' } }}>
      <StyledHeader>FAQs</StyledHeader>
      {error && <Typography color="error">{error}</Typography>}
      {answers.map((answer, index) => (
        <StyledAnswerContainer key={index}>
          <StyledQuestion>Question: {answer.question}</StyledQuestion>
          {answer.answer && <StyledAnswer>Answer: {answer.answer}</StyledAnswer>}
        </StyledAnswerContainer>
      ))}
      <StyledButton variant="contained" color="primary" onClick={reloadAnswers}>Reload Answers</StyledButton>
    </Box>
  );
};

export default Answer;
