import React, { useState } from 'react';
import { Dialog, TextField, Box, Button, styled, Typography } from '@mui/material';
import { authenticateAddProblemAnswer } from '../../service/api.js';

const LoginButton = styled(Button)`
    text-transform: none;
    background: #FB641B;
    color: #fff;
    height: 48px;
    border-radius: 2px;
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
`;

const answerInitialValue = {
    body: ''
};

const AnswerProblem = ({ open, onClose, email, problem }) => {
    const [answer, setAnswer] = useState(answerInitialValue);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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
                handleClose(); // Close the dialog on successful submission
            } else {
                setError('Submission failed. Please try again.');
            }
        } catch (error) {
            console.error("Error occurred while adding answer:", error);
            setError('An error occurred while submitting your answer.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        onClose();
        setAnswer(answerInitialValue);
    };

    return (
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
                    label='Enter answer'
                    value={answer.body}
                    multiline
                    rows={4}
                />
                <LoginButton 
                    onClick={submitAnswer}
                    disabled={loading}
                >
                    {loading ? 'Submitting...' : 'Submit'}
                </LoginButton>
            </Wrapper>
        </Dialog>
    );
}

export default AnswerProblem;
