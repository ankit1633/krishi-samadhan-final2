import React, { useState } from 'react';
import { Dialog, TextField, Box, Button, styled, Snackbar, Alert } from '@mui/material';
import { authenticateAddAnswer } from '../../service/api.js';

const LoginButton = styled(Button)`
    text-transform: none;
    background: rgba(245,234,209,0.5);
    color: #fff;
    height: 48px;
    border-radius: 2px;
    
    @media (max-width: 600px) { /* Media query for smaller screens like Android phones */
        height: 40px;
        font-size: 14px;
    }
`;

const Wrapper = styled(Box)`
    padding: 25px 35px;
    display: flex;
    flex: 1;
    overflow: auto;
    flex-direction: column;
    & > div, & > button, & > p {
        margin-top: 20px;
    }

    @media (max-width: 600px) { /* Media query for smaller screens like Android phones */
        padding: 15px 20px;
    }
`;

const answerInitialValue = {
    body: ''
};

const AnswerQuestion = ({ open, onClose, email, question, selectedQuestion }) => {
    const [answer, setAnswer] = useState(answerInitialValue);
    const [successMessage, setSuccessMessage] = useState(false); // State to manage Snackbar visibility

    const onValueChange = (e) => {
        setAnswer({ ...answer, [e.target.name]: e.target.value });
    };

    const handleClose = () => {
        onClose(); // Close the dialog
        setAnswer(answerInitialValue); // Reset answer form fields
    };

    const handleSnackbarClose = () => {
        setSuccessMessage(false); // Hide the Snackbar
    };

    const submitAnswer = async () => {
        try {
            const response = await authenticateAddAnswer({
                body: answer.body,
                question: question 
            });
            if (response.status === 200) {
                setSuccessMessage(true); // Show success message
                handleClose(); // Close the dialog on successful submission
                console.log(response.data);
            } 
        } catch (error) {
            console.error("Error occurred while adding answer:", error);
        }
    };

    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <Wrapper>
                    <TextField
                        variant="standard"
                        onChange={(e) => onValueChange(e)}
                        name='body'
                        label='Enter answer'
                        value={answer.body}
                        multiline
                        rows={4}
                        fullWidth
                    />
                    <LoginButton onClick={submitAnswer}>Submit</LoginButton>
                </Wrapper>
            </Dialog>

            {/* Snackbar for success message */}
            <Snackbar
                open={successMessage}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    Answer added successfully!
                </Alert>
            </Snackbar>
        </div>
    );
}

export default AnswerQuestion;
