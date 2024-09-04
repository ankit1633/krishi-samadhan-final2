import React, { useContext, useState } from 'react';
import { Box, Typography, TextField, Button, styled, Dialog, Snackbar, Alert } from '@mui/material';
import { authenticateQuestion } from '../../service/api.js';
import DataProvider, { DataContext } from '../../context/DataProvider.jsx';
import QuestionList from './QuestionList.jsx';
import { useTranslation } from 'react-i18next';

// Styled Dialog component
const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    background-color: #f5f5f5; /* More off-white background */
    border-radius: 10px;
    width: 60%;
    height: 50%;
    @media (max-width: 600px) {
      width: 90%; /* Full width on small screens */
      height: auto; /* Adjust height on small screens */
    }
  }
`;

// Styled Box component
const ContentBox = styled(Box)`
  background-color: #f5f5f5; /* More off-white background */
  padding: 20px;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  color: #00796b; /* Teal text color */
  @media (max-width: 600px) {
    padding: 15px; /* Less padding on small screens */
  }
`;

// Styled Button component
const LoginButton = styled(Button)`
  text-transform: none;
  background: ${({ enabled }) => (enabled ? '#fdd835' : '#d3d3d3')}; /* Change the background to a more visible light gray when disabled */
  color: ${({ enabled }) => (enabled ? '#000000' : '#808080')}; /* Change text color to a darker gray when disabled */
  height: 48px;
  border-radius: 2px;
  margin-top: 20px;
  &:hover {
    background: ${({ enabled }) => (enabled ? '#fbc02d' : '#d3d3d3')}; /* Maintain visible color when hovering */
    color: #000000; /* Ensure the text color remains black on hover for contrast */
  }
  @media (max-width: 600px) {
    height: 40px; /* Smaller height on small screens */
    margin-top: 15px; /* Less margin on small screens */
  }
`;

// Styled Typography for Error messages
const Error = styled(Typography)`
  font-size: 10px;
  color: #ff6161;
  margin-top: 5px;
`;

const Question = ({ openQuestion, setQuestionDialog }) => {
    const { t } = useTranslation();
    const { user } = useContext(DataContext);
    const [question, setQuestion] = useState({ name: '', email: '', question: '' });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState(false); // State to manage Snackbar visibility

    const onValueChange = (e) => {
        setQuestion({ ...question, [e.target.name]: e.target.value });
    };

    const handleClose = () => {
        setQuestionDialog(false);
        setError('');
        setQuestion({ name: '', email: '', question: '' });
    };

    const handleSnackbarClose = () => {
        setSuccessMessage(false); // Hide the Snackbar
    };

    const addQuestion = async () => {
        try {
            const response = await authenticateQuestion(question);
            if (response.status === 200) {
                setSuccessMessage(true); // Show success message
                handleClose();
                console.log(response.data);
            } else {
                setError(response.data.message || t('error_adding_question'));
            }
        } catch (error) {
            console.error(t('error_occurred_while_adding_question'), error);
            setError(t('error_adding_question'));
        }
    };

    return (
        <div>
            <StyledDialog open={openQuestion} onClose={handleClose}>
                {user === "farmer" ? (
                    <ContentBox>
                        <TextField
                            variant="standard"
                            onChange={onValueChange}
                            name="name"
                            label={t('enter_name')}
                            InputLabelProps={{ style: { color: '#00796b' } }} // Teal label color
                            InputProps={{ style: { color: '#00796b' } }} // Teal input text color
                            sx={{ 
                                mb: 2,
                                fontSize: { xs: '12px', sm: '14px' } // Responsive font size
                            }}
                        />
                        <TextField
                            variant="standard"
                            onChange={onValueChange}
                            name="email"
                            label={t('enter_email')}
                            InputLabelProps={{ style: { color: '#00796b' } }} // Teal label color
                            InputProps={{ style: { color: '#00796b' } }} // Teal input text color
                            sx={{ 
                                mb: 2,
                                fontSize: { xs: '12px', sm: '14px' } // Responsive font size
                            }}
                        />
                        <TextField
                            variant="standard"
                            onChange={onValueChange}
                            name="question"
                            label={t('enter_question')}
                            multiline
                            rows={8}
                            InputLabelProps={{ style: { color: '#00796b' } }} // Teal label color
                            InputProps={{ style: { color: '#00796b' } }} // Teal input text color
                            sx={{ 
                                mb: 2,
                                fontSize: { xs: '12px', sm: '14px' } // Responsive font size
                            }}
                        />
                        {error && <Error>{error}</Error>}
                        <LoginButton onClick={addQuestion} enabled={question.name && question.email && question.question}>
                            {t('continue')} {/* Use translation key */}
                        </LoginButton>
                    </ContentBox>
                ) : (
                    <ContentBox>
                        <Box>
                            <QuestionList />
                        </Box>
                    </ContentBox>
                )}
            </StyledDialog>

            {/* Snackbar for success message */}
            <Snackbar
                open={successMessage}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    {t('question_added_successfully')} {/* Use translation key */}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default Question;
