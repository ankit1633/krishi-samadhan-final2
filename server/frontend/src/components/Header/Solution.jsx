import React, { useContext, useState, useEffect } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, Box, styled, Dialog } from '@mui/material';
import { DataContext } from '../../context/DataProvider';
import { authenticateGetSolution } from '../../service/api';

const URL = 'http://localhost:8000';  // Your server URL

const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    background-color: #f0f0f0;
    border-radius: 10px;
    width: 80%;
    max-width: 800px;
    height: 80%;
    max-height: 600px;
  }
`;

const Solution = ({ openSolution, setSolutionDialog }) => {
    const { user, account } = useContext(DataContext);
    const [problems, setProblems] = useState([]);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                if (user) {
                    const response = await authenticateGetSolution(account);
                    console.log('API Response:', response);  // Log the response
    
                    if (response.data && response.data.data) {
                        setProblems(response.data.data);  // Set problems from response
                        setError(null);
                    } else {
                        setError('Error loading problems: No data found');
                    }
                } else {
                    setError('No user email provided');
                }
            } catch (error) {
                console.error("Error occurred while fetching problems:", error);
                setError('Error loading problems: Network error');
            }
        };
    
        if (openSolution) {
            fetchProblems();
        }
    }, [openSolution, user, account]);

    const handleOpenImage = (imageUrl) => {
        setSelectedImage(imageUrl); // Set the selected image URL
    };

    const handleCloseImage = () => {
        setSelectedImage(null);
    };

    const handleClose = () => {
        setSolutionDialog(false);
    };

    return (
        <StyledDialog open={openSolution} onClose={handleClose}>
            <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
                        <TableRow>
                            <TableCell>User Email</TableCell>
                            <TableCell>Problem</TableCell>
                            <TableCell>Solution</TableCell>
                            <TableCell>Image</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {error ? (
                            <TableRow>
                                <TableCell colSpan={4}>
                                    <Typography>{error}</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            problems.map(problem => (
                                <TableRow key={problem._id} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' } }}>
                                    <TableCell>{problem.email}</TableCell>
                                    <TableCell>{problem.problem}</TableCell>
                                    <TableCell>{problem.answer}</TableCell>
                                    <TableCell>
                                        {problem.img && (
                                            <>
                                                <Button
                                                    variant='contained'
                                                    onClick={() => handleOpenImage(problem.img)}
                                                >
                                                    Open image
                                                </Button>
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
                                            </>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </StyledDialog>
    );
};

export default Solution;
