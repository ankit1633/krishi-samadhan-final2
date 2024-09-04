import React, { useState } from 'react';
import { Dialog, TextField, Box, Button, styled, Snackbar, Alert,Typography } from '@mui/material';
import { authenticateAddAnswer } from '../../service/api.js';
import { useTranslation } from 'react-i18next';

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

const AnswerQuestion = ({ open, onClose, email, question }) => {
    const { t } = useTranslation();
    const [answer, setAnswer] = useState(answerInitialValue);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(false); // State to manage Snackbar visibility

    const onValueChange = (e) => {
        setAnswer({ ...answer, [e.target.name]: e.target.value });
    };

    const submitAnswer = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await authenticateAddAnswer({
                body: answer.body,
                question: question
            });

            if (response.status === 200) {
                setSuccessMessage(true); // Show success message
                handleClose(); // Close the dialog on successful submission
            } else {
                setError(t('submission_failed')); // Use translation key for error message
            }
        } catch (error) {
            console.error("Error occurred while adding answer:", error);
            setError(t('submission_error')); // Use translation key for error message
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        onClose(); // Close the dialog
        setAnswer(answerInitialValue); // Reset answer form fields
    };

    const handleSnackbarClose = () => {
        setSuccessMessage(false); // Hide success message
    };

    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <Wrapper>
                    {error && (
                        <Typography color="error" variant="body2">
                            {error}
                        </Typography>
                    )}
                    <TextField
                        variant="standard"
                        onChange={onValueChange}
                        name='body'
                        label={t('enter_answer')} // Use translation key for label
                        value={answer.body}
                        multiline
                        rows={4}
                    />
                    <LoginButton 
                        onClick={submitAnswer}
                        disabled={loading}
                    >
                        {loading ? t('submitting') : t('submit')} // Use translation keys for button text
                    </LoginButton>
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
                    {t('answer_added_success')} // Use translation key for success message
                </Alert>
            </Snackbar>
        </div>
    );
};

export default AnswerQuestion;
