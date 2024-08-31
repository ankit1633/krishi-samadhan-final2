import React, { useContext, useState } from 'react';
import { Box, Typography, TextField, Button, styled, Dialog, Snackbar, Alert } from '@mui/material';
import { authenticateProblem } from '../../service/api.js';
import { DataContext } from '../../context/DataProvider.jsx'; // Updated import path
import ProblemList from './ProblemList.jsx';

const StyledDialog = styled(Dialog)(({ theme }) => ({
    '.MuiDialog-paper': {
        background: '#f8f8f8',
        borderRadius: '10px',
        width: '80%',
        maxWidth: '600px',
        height: 'auto',
        [theme.breakpoints.down('sm')]: {
            width: '90%',
        },
    },
}));

const ContentBox = styled(Box)(({ theme }) => ({
    background: '#f8f8f8',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '10px',
    color: '#00796b',
    [theme.breakpoints.down('sm')]: {
        padding: '15px',
    },
}));

const LoginButton = styled(Button)(({ theme, enabled }) => ({
    textTransform: 'none',
    background: enabled ? '#fdd835' : '#f0f0f0',
    color: enabled ? '#000000' : '#bdbdbd',
    height: '48px',
    borderRadius: '2px',
    marginTop: '20px',
    '&:hover': {
        background: enabled ? '#fbc02d' : '#e0e0e0',
        color: '#000000',
    },
    [theme.breakpoints.down('sm')]: {
        width: '100%',
        fontSize: '14px',
    },
}));

const Error = styled(Typography)`
    font-size: 20px;
    color: #ff6161;
    margin-top: 5px;
`;

const Problem = ({ openProblem, setProblemDialog }) => {
    const { user } = useContext(DataContext);
    const [problem, setProblem] = useState({ name: '', email: '', problem: '', img: null });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState(false);

    const onFileChange = (e) => {
        setProblem({ ...problem, img: e.target.files[0] });
    };

    const onValueChange = (e) => {
        setProblem({ ...problem, [e.target.name]: e.target.value });
    };

    const handleClose = () => {
        setProblemDialog(false);
        setError('');
        setProblem({ name: '', email: '', problem: '', img: null });
    };

    const handleSnackbarClose = () => {
        setSuccessMessage(false);
    };

    const addProblem = async () => {
        try {
            const formData = new FormData();
            formData.append('name', problem.name);
            formData.append('email', problem.email);
            formData.append('problem', problem.problem);
            if (problem.img) {
                formData.append('img', problem.img);
            }

            const response = await authenticateProblem(formData);
            if (response.status === 200) {
                setSuccessMessage(true);
                handleClose();
            } else {
                setError(response.data.message || 'Error adding problem');
            }
        } catch (error) {
            console.error('Error occurred while adding problem:', error);
            setError('Error adding problem');
        }
    };

    const isButtonEnabled = problem.name && problem.email && problem.problem;

    return (
        <StyledDialog open={openProblem} onClose={handleClose}>
            {user === 'farmer' ? (
                <ContentBox>
                    <TextField
                        variant="standard"
                        onChange={onValueChange}
                        name="name"
                        label="Enter name"
                        required
                        InputLabelProps={{ style: { color: '#00796b' } }}
                        InputProps={{ style: { color: '#00796b' } }}
                    />
                    <TextField
                        variant="standard"
                        onChange={onValueChange}
                        name="email"
                        label="Enter email"
                        required
                        InputLabelProps={{ style: { color: '#00796b' } }}
                        InputProps={{ style: { color: '#00796b' } }}
                    />
                    <TextField
                        variant="standard"
                        onChange={onValueChange}
                        name="problem"
                        label="Describe your problem"
                        multiline
                        rows={8}
                        required
                        InputLabelProps={{ style: { color: '#00796b' } }}
                        InputProps={{ style: { color: '#00796b' } }}
                    />
                    <input
                        type="file"
                        name="img"
                        onChange={onFileChange}
                        style={{ marginTop: '10px' }}
                    />
                    {error && <Error>{error}</Error>}
                    <LoginButton onClick={addProblem} enabled={isButtonEnabled}>
                        Continue
                    </LoginButton>
                </ContentBox>
            ) : (
                <ContentBox>
                    <Box>
                        <ProblemList />
                    </Box>
                </ContentBox>
            )}
            <Snackbar open={successMessage} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    Problem added successfully!
                </Alert>
            </Snackbar>
        </StyledDialog>
    );
};

export default Problem;
