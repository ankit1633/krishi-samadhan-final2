import React, { useState, useContext } from 'react';
import { Dialog, TextField, Box, Typography, Button, styled, Snackbar, Alert } from '@mui/material';
import { authenticateSignup, authenticateLogin } from '../../service/api';
import { DataContext } from '../../context/DataProvider';

const LoginButton = styled(Button)`
  text-transform: none;
  background: #FB641B;
  color: #fff;
  height: 48px;
  border-radius: 2px;
`;

const RequestOTP = styled(Button)`
  text-transform: none;
  background: #fff;
  color: #2874f0;
  height: 48px;
  border-radius: 2px;
  box-shadow: 0 2px 4px 0 rgb(0 0 0 / 20%);
`;

const Text = styled(Typography)`
  color: #878787;
  font-size: 12px;
`;

const CreateAccount = styled(Typography)`
  margin: auto 0 5px 0;
  text-align: center;
  color: #2874f0;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
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

const loginInitialValues = {
  email: '',
  password: ''
};

const signupInitialValues = {
  firstname: '',
  lastname: '',
  username: '',
  email: '',
  password: '',
  phone: ''
};

const accountInitialValues = {
  login: { view: 'login' },
  signup: { view: 'signup' }
};

const FarmerLogin = ({ open, onClose, onSuccess }) => {
  const { setAccount, updateUser } = useContext(DataContext);
  const [account, toggleAccount] = useState(accountInitialValues.login);
  const [signup, setSignup] = useState(signupInitialValues);
  const [login, setLogin] = useState(loginInitialValues);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);  // State for managing success snackbar

  const onValueChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  const toggleSignup = () => {
    toggleAccount(accountInitialValues.signup);
  };

  const handleClose = () => {
    onClose();
    toggleAccount(accountInitialValues.login);
    setError(false);
    setSuccess(false);  // Reset success state on close
  };

  const onInputChange = (e) => {
    setSignup({ ...signup, [e.target.name]: e.target.value });
  };

  const signupUser = async () => {
    try {
      const response = await authenticateSignup(signup);
      if (response && response.status === 200) {
        handleClose();
        setAccount(signup.username);
        updateUser('farmer');
        onSuccess();  // Notify success
      } else {
        setError(true);
      }
    } catch (error) {
      console.error('Error occurred during signup:', error);
      setError(true);
    }
  };

  const loginUser = async () => {
    try {
      const response = await authenticateLogin({
        email: login.email,
        password: login.password
      });
      if (response && response.status === 200) {
        handleClose();
        setAccount(login.email);
        updateUser('farmer');
        setSuccess(true);  // Show success message on successful login
        onSuccess();  // Notify success
      } else {
        setError(true);
      }
    } catch (error) {
      console.error('Error occurred during login:', error);
      setError(true);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <Wrapper>
        {account.view === 'login' ? (
          <>
            <TextField
              variant="standard"
              onChange={onValueChange}
              name="email"
              label="Enter Email"
              fullWidth
            />
            {error && <Error>Please enter valid Email and Password</Error>}
            <TextField
              variant="standard"
              onChange={onValueChange}
              name="password"
              label="Enter Password"
              type="password"
              fullWidth
            />
            <Text>
              By continuing, you agree to Krishi-samadhan's Terms of Use and Privacy Policy.
            </Text>
            <LoginButton onClick={loginUser} fullWidth>Login</LoginButton>
            <Text style={{ textAlign: 'center' }}>OR</Text>
            <RequestOTP>Request OTP</RequestOTP>
            <CreateAccount onClick={toggleSignup}>New to Krishi-samadhan? Create an account</CreateAccount>
          </>
        ) : (
          <>
            <TextField
              variant="standard"
              onChange={onInputChange}
              name="firstname"
              label="Enter Firstname"
              fullWidth
            />
            <TextField
              variant="standard"
              onChange={onInputChange}
              name="lastname"
              label="Enter Lastname"
              fullWidth
            />
            <TextField
              variant="standard"
              onChange={onInputChange}
              name="username"
              label="Enter Username"
              fullWidth
            />
            <TextField
              variant="standard"
              onChange={onInputChange}
              name="email"
              label="Enter Email"
              fullWidth
            />
            <TextField
              variant="standard"
              onChange={onInputChange}
              name="password"
              label="Enter Password"
              type="password"
              fullWidth
            />
            <TextField
              variant="standard"
              onChange={onInputChange}
              name="phone"
              label="Enter Phone"
              fullWidth
            />
            <LoginButton onClick={signupUser} fullWidth>Continue</LoginButton>
          </>
        )}
      </Wrapper>

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
    </Dialog>
  );
};

export default FarmerLogin;
