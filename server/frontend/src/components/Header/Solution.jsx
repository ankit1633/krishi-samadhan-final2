import React, { useContext, useState, useEffect } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, Box, styled, Dialog } from '@mui/material';
import { DataContext } from '../../context/DataProvider';
import { authenticateGetSolution } from '../../service/api';
import { useTranslation } from 'react-i18next';

// Styled components
const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    background-color: #f0f0f0;
    border-radius: 10px;
    width: 80%;
    max-width: 800px;
    height: 80%;
    max-height: 600px;
    @media (max-width: 600px) {
      width: 90%;
      max-width: none;
      height: 90%;
      max-height: none;
    }
  }
`;

const Solution = ({ openSolution, setSolutionDialog }) => {
    const { t } = useTranslation(); // Use translation hook
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
                        setError(t('error_loading_problems_no_data')); // Use translation key
                    }
                } else {
                    setError(t('no_user_email')); // Use translation key
                }
            } catch (error) {
                console.error(t('error_fetching_problems'), error); // Use translation key
                setError(t('error_loading_problems_network')); // Use translation key
            }
        };
    
        if (openSolution) {
            fetchProblems();
        }
    }, [openSolution, user, account, t]); // Add t to dependency array

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
            <TableContainer component={Paper} sx={{ boxShadow: 2, padding: { xs: '8px', sm: '16px' } }}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
                        <TableRow>
                            <TableCell sx={{ fontSize: { xs: '12px', sm: '14px' } }}>{t('user_email')}</TableCell> {/* Use translation key */}
                            <TableCell sx={{ fontSize: { xs: '12px', sm: '14px' } }}>{t('problem')}</TableCell> {/* Use translation key */}
                            <TableCell sx={{ fontSize: { xs: '12px', sm: '14px' } }}>{t('solution')}</TableCell> {/* Use translation key */}
                            <TableCell sx={{ fontSize: { xs: '12px', sm: '14px' } }}>{t('image')}</TableCell> {/* Use translation key */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {error ? (
                            <TableRow>
                                <TableCell colSpan={4}>
                                    <Typography sx={{ textAlign: 'center' }}>{error}</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            problems.map(problem => (
                                <TableRow key={problem._id} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' } }}>
                                    <TableCell sx={{ fontSize: { xs: '12px', sm: '14px' } }}>{problem.email}</TableCell>
                                    <TableCell sx={{ fontSize: { xs: '12px', sm: '14px' } }}>{problem.problem}</TableCell>
                                    <TableCell sx={{ fontSize: { xs: '12px', sm: '14px' } }}>{problem.answer}</TableCell>
                                    <TableCell>
                                        {problem.img && (
                                            <>
                                                <Button
                                                    variant='contained'
                                                    onClick={() => handleOpenImage(problem.img)}
                                                    sx={{ fontSize: { xs: '10px', sm: '14px' }, padding: { xs: '6px', sm: '8px' } }}
                                                >
                                                    {t('open_image')} {/* Use translation key */}
                                                </Button>
                                                {selectedImage === problem.img && (
                                                    <Box mt={2} sx={{ textAlign: 'center' }}>
                                                        <img
                                                            src={selectedImage}
                                                            alt={t('problem_image')} // Use translation key
                                                            style={{ maxWidth: '100%', height: 'auto' }}
                                                        />
                                                        <Button onClick={handleCloseImage} sx={{ marginTop: 1 }}>
                                                            {t('close_image')} {/* Use translation key */}
                                                        </Button>
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
