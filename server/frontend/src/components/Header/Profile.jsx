import { useState,useContext } from 'react';
import { Typography, Menu, MenuItem, Box, styled } from '@mui/material';
import { PowerSettingsNew } from '@mui/icons-material';
import { authenticateLogout } from '../../service/api';  // Adjust the import path as needed
import { DataContext } from '../../context/DataProvider';
const Component = styled(Menu)`
    margin-top: 5px;
`;

const Logout = styled(Typography)`
    font-size: 14px;
    margin-left: 20px;
`;

const Profile = ({ account, setAccount }) => {
    const [open, setOpen] = useState(false);
    const [error, setError] = useState(false); // To handle potential logout errors
    const {user,setUser } = useContext(DataContext);
    const handleClick = (event) => {
        setOpen(event.currentTarget);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const logoutUser = async () => {
        try {
            const response = await authenticateLogout();
            if (response && response.status === 200) {
                setAccount('');
                setUser("");
                handleClose();
                // Optionally redirect or show a success message
                console.log('Logout successful');
            } else {
                setError(true); // Handle logout error
                console.error('Logout failed:', response.statusText);
            }
        } catch (error) {
            setError(true);
            console.error('Error occurred during logout:', error);
        }
    };

    return (
        <>
            <Box onClick={handleClick}><Typography style={{ marginTop: 2, cursor:'pointer' }}>{account}</Typography></Box>
            <Component
                anchorEl={open}
                open={Boolean(open)}
                onClose={handleClose}
            >
                <MenuItem onClick={() => { logoutUser(); }}>
                    <PowerSettingsNew fontSize='small' color='primary'/> 
                    <Logout>Logout</Logout>
                </MenuItem>
            </Component>
            {error && <Typography color='error'>An error occurred during logout. Please try again.</Typography>}
        </>
    );
}

export default Profile;
