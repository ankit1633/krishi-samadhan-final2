import React, { useState, useContext } from 'react';
import { Box, Typography, Menu, MenuItem, styled, Snackbar, Alert } from '@mui/material';
import { PowerSettingsNew } from '@mui/icons-material';
import { authenticateLogout } from '../../service/api'; // Adjust the import path as needed
import { DataContext } from '../../context/DataProvider';
import { useTranslation } from 'react-i18next';

// Styled Menu component
const Component = styled(Menu)`
    margin-top: 5px;
`;

// Styled Typography for Logout
const Logout = styled(Typography)`
    font-size: 14px;
    margin-left: 20px;
`;

// Profile component
const Profile = ({ account, setAccount }) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(null);
    const [error, setError] = useState(false); // To handle potential logout errors
    const [successMessage, setSuccessMessage] = useState(false); // State for success message
    const { setUser } = useContext(DataContext);

    const handleClick = (event) => {
        setOpen(event.currentTarget);
    };

    const handleClose = () => {
        setOpen(null);
    };

    const logoutUser = async () => {
        try {
            const response = await authenticateLogout();
            if (response && response.status === 200) {
                setAccount('');
                setUser('');
                setSuccessMessage(true); // Show success message
                handleClose(); // Close the menu
            } else {
                setError(true); // Handle logout error
                console.error('Logout failed:', response.statusText);
            }
        } catch (error) {
            setError(true);
            console.error('Error occurred during logout:', error);
        }
    };

    const handleSnackbarClose = () => {
        setSuccessMessage(false); // Hide success message
        setError(false); // Hide error message
    };

    return (
        <>
            <Box
                onClick={handleClick}
                sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    cursor: 'pointer',
                    fontSize: { xs: '12px', sm: '14px' } // Responsive font size
                }}
            >
                <Typography 
                    sx={{ 
                        display: { xs: 'none', sm: 'block' }, // Hide on small screens
                        marginTop: 2 
                    }}
                >
                    {account}
                </Typography>
            </Box>
            <Component
                anchorEl={open}
                open={Boolean(open)}
                onClose={handleClose}
                sx={{
                    '& .MuiMenu-paper': { 
                        width: { xs: '100%', sm: 'auto' } // Full width on small screens
                    }
                }}
            >
                <MenuItem 
                    onClick={logoutUser}
                    sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        padding: { xs: '8px 10px', sm: '8px 16px' } // Responsive padding
                    }}
                >
                    <PowerSettingsNew fontSize='small' color='primary' />
                    <Logout sx={{ 
                        fontSize: { xs: '12px', sm: '14px' }, // Responsive font size
                        marginLeft: { xs: 1, sm: 2 } // Responsive margin
                    }}>{t('logout')}</Logout> {/* Use translation key */}
                </MenuItem>
            </Component>

            {/* Snackbar for success message */}
            <Snackbar
                open={successMessage}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    {t('logout_success')} {/* Use translation key */}
                </Alert>
            </Snackbar>

            {/* Snackbar for error message */}
            <Snackbar
                open={error}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
                    {t('logout_error')} {/* Use translation key */}
                </Alert>
            </Snackbar>
        </>
    );
};

export default Profile;
