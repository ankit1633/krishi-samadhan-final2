import React from 'react';
import { AppBar, Toolbar, Box, styled } from '@mui/material';
import CustomButtons from './CustomButtons'; // Adjust path if necessary
import logo from './logo2.jpeg'; // Adjust path if necessary

const Header = () => {
    const StyledHeader = styled(AppBar)`
        background: #008000;
        height: 60px;
        position: relative; /* Ensure relative positioning */
    `;

    const Image = styled('img')({
        width: 100,
        height: 50
    });

    return (
        <StyledHeader>
            <Toolbar>
                <Box style={{ display: 'flex', alignItems: 'center' }}>
                    <Image src={logo} alt='logo' />
                    <CustomButtons />
                </Box>
            </Toolbar>
        </StyledHeader>
    );
};

export default Header;
