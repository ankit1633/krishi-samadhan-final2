import React, { useState, useContext } from 'react';
import { Dialog, TextField, Box, Typography, Button, styled, Snackbar, Alert } from '@mui/material';
import { authenticateExpertLogin } from '../../service/api.js';
import { DataContext } from '../../context/DataProvider.jsx';

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

const Error = styled(Typography)`
    font-size: 10px;
    color: #ff6161;
    line-height: 0;
    margin-top: 10px;
    font-weight: 600;
`;

const expertLoginInitialValues = {
    username: '',
    password: ''
};

const ExpertLogin = ({ open, onClose, onSuccess }) => {
    const { setAccount, setUser, updateUser } = useContext(DataContext);
    const [expertLogin, setExpertLogin] = useState(expertLoginInitialValues);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false); // State for managing success snackbar

    const onValueChange = (e) => {
        setExpertLogin({ ...expertLogin, [e.target.name]: e.target.value });
    };

    const handleClose = () => {
        onClose(); // Close the dialog
        setError(false); // Reset error state
        setExpertLogin(expertLoginInitialValues); // Reset login form fields
    };

    const loginExpert = async () => {
        try {
            const response = await authenticateExpertLogin(expertLogin);
            if (response.status === 200) {
                handleClose(); // Close the dialog on successful login
                setAccount(expertLogin.username);
                updateUser("expert");
                setUser("expert");
                setSuccess(true); // Show success message on successful login
                onSuccess(); // Call onSuccess to close all dialogs
            } else {
                setError(true); // Display error message if login fails
            }
        } catch (error) {
            console.error("Error occurred during expert login:", error);
            setError(true); // Display error message on error
        }
    };

    return (
        <>
            <Dialog open={open} onClose={handleClose} >
                <Wrapper>
                    <TextField
                        variant="standard"
                        onChange={onValueChange}
                        name='username'
                        label='Enter Email/Mobile number'
                        value={expertLogin.username} // Bind value to state
                    />
                    {error && <Error>Please enter valid Email ID/Mobile number</Error>}
                    <TextField
                        variant="standard"
                        onChange={onValueChange}
                        name='password'
                        label='Enter Password'
                        type="password"
                        value={expertLogin.password} // Bind value to state
                    />
                    <LoginButton onClick={loginExpert}>Login</LoginButton>
                </Wrapper>
            </Dialog>

            {/* Snackbar for Success Message */}
            <Snackbar
                open={success}
                autoHideDuration={4000}
                onClose={() => setSuccess(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
                    Successfully logged in!
                </Alert>
            </Snackbar>
        </>
    );
};

export default ExpertLogin;
