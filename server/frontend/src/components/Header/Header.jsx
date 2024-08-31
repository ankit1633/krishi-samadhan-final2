import React from 'react';
import { AppBar, Toolbar, Box, styled } from '@mui/material';
import CustomButtons from './CustomButtons'; // Adjust path if necessary
import logo from './logo2.jpeg'; // Adjust path if necessary

const Header = () => {
    // Styled AppBar with media queries
    const StyledHeader = styled(AppBar)(({ theme }) => ({
        background: '#008000',
        height: 60,
        [theme.breakpoints.down('sm')]: {
            height: 50, // Adjust height for small screens
        },
    }));

    // Styled image with media queries
    const Image = styled('img')(({ theme }) => ({
        width: 100,
        height: 50,
        [theme.breakpoints.down('sm')]: {
            width: 80, // Adjust width for small screens
            height: 40, // Adjust height for small screens
        },
    }));

    return (
        <StyledHeader>
            <Toolbar>
                <Box style={{ display: 'flex', alignItems: 'center' }}>
                    <Image src={logo} alt='logo' /> {/* New logo */}
                    <CustomButtons /> {/* Existing custom buttons */}
                </Box>
            </Toolbar>
        </StyledHeader>
    );
};

export default Header;
