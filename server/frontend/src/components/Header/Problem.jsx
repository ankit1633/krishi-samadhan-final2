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

const UploadState = {
    IDLE: 1,
    UPLOADING: 2,
    UPLOADED: 3,
};
Object.freeze(UploadState);

const Problem = ({ openProblem, setProblemDialog }) => {
    const { user } = useContext(DataContext);
    const [uploadState, setUploadState] = useState(UploadState.IDLE);
    const [problem, setProblem] = useState({ name: '', email: '', problem: '', img: null });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState(false);
    const [imgUrl, setImgUrl] = useState('');

    const onFileChange = async (e) => {
        setUploadState(UploadState.UPLOADING);
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        try {
            // Use the same endpoint for both image upload and problem submission
            const res = await fetch('/api/problems', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                setImgUrl(data.secure_url);
                setProblem({ ...problem, img: file });
                setUploadState(UploadState.UPLOADED);
            } else {
                setError(data.message || 'Error uploading image');
                setUploadState(UploadState.IDLE);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            setError('Error uploading image');
            setUploadState(UploadState.IDLE);
        }
    };

    const onValueChange = (e) => {
        setProblem({ ...problem, [e.target.name]: e.target.value });
    };

    const handleClose = () => {
        setProblemDialog(false);
        setError('');
        setProblem({ name: '', email: '', problem: '', img: null });
        setImgUrl('');
        setUploadState(UploadState.IDLE);
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

            const response = await fetch('/problems', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (response.ok) {
                setSuccessMessage(true);
                handleClose();
            } else {
                setError(data.message || 'Error adding problem');
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
                    <label
                        htmlFor="image"
                        className="block bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-center"
                    >
                        {uploadState === UploadState.UPLOADING ? (
                            <span>Uploading...</span>
                        ) : (
                            <span>Upload</span>
                        )}
                        <input
                            type="file"
                            name="file"
                            id="image"
                            className="hidden"
                            onChange={onFileChange}
                        />
                    </label>
                    {uploadState === UploadState.UPLOADED && imgUrl && (
                        <div className="w-96 text-green-500">
                            <span className="block py-2 px-3 text-green-500 text-center">
                                Uploaded!
                            </span>
                            <img className="w-full" src={imgUrl} alt="Uploaded image" />
                        </div>
                    )}
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
