import React, { useState, useEffect } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, Box } from '@mui/material';
import { authenticateGetProblem } from '../../service/api.js';
import AnswerProblem from '../Header/AnswerProblem.jsx';

const ProblemList = () => {
    const [problems, setProblems] = useState([]);
    const [error, setError] = useState(null);
    const [openAnswerDialog, setOpenAnswerDialog] = useState(false);
    const [selectedProblem, setSelectedProblem] = useState({ email: '', problem: '' });
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const response = await authenticateGetProblem();
                if (response.status === 200) {
                    setProblems(response.data.data);
                } else {
                    setError('Error loading problems');
                }
            } catch (error) {
                console.error("Error occurred while fetching problems :", error);
                setError('Error loading problems');
            }
        };

        fetchProblems();
    }, []);

    const handleOpenAnswerDialog = (email, problem) => {
        setSelectedProblem({ email, problem });
        setOpenAnswerDialog(true);
    };

    const handleCloseAnswerDialog = () => {
        setOpenAnswerDialog(false);
        setSelectedProblem({ email: '', problem: '' });
    };

    const handleOpenImage = (imageUrl) => {
        setSelectedImage(imageUrl);
    };

    const handleCloseImage = () => {
        setSelectedImage(null);
    };

    return (
        <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
            <Table>
                <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
                    <TableRow>
                        <TableCell>User Email</TableCell>
                        <TableCell>Problem</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {error ? (
                        <TableRow>
                            <TableCell colSpan={3}>
                                <Typography>{error}</Typography>
                            </TableCell>
                        </TableRow>
                    ) : (
                        problems.map(problem => (
                            <TableRow key={problem._id} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' } }}>
                                <TableCell>{problem.email}</TableCell>
                                <TableCell>{problem.problem}</TableCell>
                                <TableCell>
                                    {problem.img && (
                                        <Button
                                            variant='contained'
                                            onClick={() => handleOpenImage(problem.img)}
                                        >
                                            Open image
                                        </Button>
                                    )}
                                    {selectedImage === problem.img && (
                                        <Box mt={2}>
                                            <img
                                                src={selectedImage}
                                                alt="Problem Image"
                                                style={{ maxWidth: '100%', height: 'auto' }}
                                            />
                                            <Button onClick={handleCloseImage}>Close image</Button>
                                        </Box>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        onClick={() => handleOpenAnswerDialog(problem.email, problem.problem)}
                                        variant="contained"
                                        color="primary"
                                    >
                                        Answer
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
            <AnswerProblem
                open={openAnswerDialog}
                onClose={handleCloseAnswerDialog}
                email={selectedProblem.email}
                problem={selectedProblem.problem}
            />
        </TableContainer>
    );
};

export default ProblemList;
