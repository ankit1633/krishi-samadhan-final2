import React, { useState } from 'react';
import { Dialog, TextField, Box, Button, styled, Typography, Snackbar, Alert } from '@mui/material';
import { authenticateAddProblemAnswer } from '../../service/api.js';
import { useTranslation } from 'react-i18next';

const LoginButton = styled(Button)`
    text-transform: none;
    background: #FB641B;
    color: #fff;
    height: 48px;
    border-radius: 2px;
    margin-top: 20px;

    @media (max-width: 600px) { /* Media query for mobile screens */
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

    @media (max-width: 600px) { /* Media query for mobile screens */
        padding: 15px 20px;
    }
`;

const answerInitialValue = {
    body: ''
};

const AnswerProblem = ({ open, onClose, email, problem }) => {
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
            const response = await authenticateAddProblemAnswer({
                body: answer.body,
                problem: problem
            });

            console.log('Response Status:', response.status);
            console.log('Response Data:', response.data);

            if (response.status === 200) {
                console.log('Submission successful:', response.data);
                setSuccessMessage(true); // Show success message
                handleClose(); // Close the dialog on successful submission
            } else {
                setError(t('submission_failed')); // Use translation key for error
            }
        } catch (error) {
            console.error("Error occurred while adding answer:", error);
            setError(t('error_occurred')); // Use translation key for error
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        onClose();
        setAnswer(answerInitialValue);
    };

    const handleSnackbarClose = () => {
        setSuccessMessage(false); // Hide success message
    };

    return (
        <div>
            <Dialog open={open} onClose={handleClose} fullWidth>
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
                        label={t('enter_answer')} // Use translation key
                        value={answer.body}
                        multiline
                        rows={4}
                    />
                    <LoginButton 
                        onClick={submitAnswer}
                        disabled={loading}
                    >
                        {loading ? t('submitting') : t('submit')} {/* Use translation keys */}
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
                    {t('answer_success')} {/* Use translation key */}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default AnswerProblem;
