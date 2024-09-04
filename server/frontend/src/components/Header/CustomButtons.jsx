import React, { useState, useContext } from 'react';
import { Box, Button, Typography, styled, Menu, MenuItem, IconButton, Drawer, List, ListItem, ListItemText, Dialog, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';
import LoginDialog from '../login/LoginDialog';
import Profile from './Profile';
import Question from './Question';
import Problem from './Problem';
import Solution from './Solution';
import Warehouse from './Warehouse';
import Weather from './Weather';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import { DataContext } from '../../context/DataProvider';
import LanguageSelector from './LanguageSelector';

// Styled Button
const LoginButton = styled(Button)`
    color: #008000;
    background: #F3CA52;
    text-transform: none;
    font-weight: 600;
    border-radius: 50px;
    padding: 8px 20px;
    height: 40px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
    width: 180px;
    transition: width 0.3s ease, background-color 0.3s ease;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
        width: 220px;
        background: #E0B646;
    }

    @media (max-width: 600px) {
        width: 150px;
        font-size: 14px;
    }
`;

// Styled Profile Button
const ProfileButton = styled(IconButton)`
    color: #008000;
    background: #F3CA52;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    padding: 8px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
        background: #E0B646;
    }

    @media (max-width: 600px) {
        width: 35px;
        height: 35px;
    }
`;

// Wrapper for buttons
const Wrapper = styled(Box)`
    display: flex;
    align-items: center;
    gap: 20px;
    width: 100%;
    justify-content: flex-end;

    @media (max-width: 600px) {
        display: none;
    }
`;

// Mobile menu icon
const MobileMenuIcon = styled(IconButton)`
    display: none;

    @media (max-width: 600px) {
        display: block;
        color: #008000;
        background: #F3CA52;
        border-radius: 50%;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
    }
`;

// Spaced Login Button
const SpacedLoginButton = styled(LoginButton)`
    margin-right: 20px;
`;

// Weather Wrapper
const WeatherWrapper = styled(Box)`
    margin-left: 5px;
`;

// Language Button with same styles as LoginButton
const LanguageButton = styled(Button)`
    color: #008000;
    background: #F3CA52;
    text-transform: none;
    font-weight: 600;
    border-radius: 50px;
    padding: 8px 20px;
    height: 40px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
    width: 150px;
    transition: width 0.3s ease, background-color 0.3s ease;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
        width: 180px;
        background: #E0B646;
    }

    @media (max-width: 600px) {
        width: 120px;
        font-size: 14px;
    }
`;

// Custom Buttons Component
const CustomButtons = () => {
    const { t } = useTranslation();
    const { account, setAccount, user, setUser } = useContext(DataContext);
    const [open, setOpen] = useState(false);
    const [openQuestion, setOpenQuestion] = useState(false);
    const [openWarehouse, setOpenWarehouse] = useState(false);
    const [openProblem, setOpenProblem] = useState(false);
    const [openSolution, setOpenSolution] = useState(false);
    const [openWeather, setOpenWeather] = useState(false); // Initially set to false
    const [anchorEl, setAnchorEl] = useState(null);
    const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [languageDialogOpen, setLanguageDialogOpen] = useState(false);

    const openDialog = () => setOpen(true);
    const openQuestionDialog = () => setOpenQuestion(true);
    const openWarehouseDialog = () => setOpenWarehouse(true);
    const openProblemDialog = () => setOpenProblem(true);
    const openSolutionDialog = () => setOpenSolution(true);
    const openWeatherDialog = () => setOpenWeather(true);
    const closeWeatherDialog = () => setOpenWeather(false);
    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const handleProfileClick = (event) => setProfileMenuAnchor(event.currentTarget);
    const handleProfileClose = () => setProfileMenuAnchor(null);

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const menuItems = [
        { text: t('login_signup'), action: openDialog, show: !account },
        { text: t('qa'), action: handleClick, show: user },
        { text: user === "farmer" ? t('warehouse_list') : t('add_warehouse'), action: openWarehouseDialog, show: user },
        { text: t('weather'), action: openWeatherDialog, show: true }
    ];

    return (
        <>
            <Wrapper>
                <LoginButton variant='contained' onClick={openDialog}>
                    {t('login_signup')}
                </LoginButton>

                <LanguageButton variant='contained' onClick={() => setLanguageDialogOpen(true)}>
                    {t('select_language')}
                </LanguageButton>

                {account ? (
                    <>
                        <ProfileButton onClick={handleProfileClick}>
                            <AccountCircleIcon />
                        </ProfileButton>
                        <Profile account={account} setAccount={setAccount} />
                    </>
                ) : null}

                {user && (
                    <>
                        <Typography>{t('qa')}</Typography>
                        
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                            <MenuItem onClick={() => { openQuestionDialog(); handleClose(); }}>
                                {user === "expert" ? t('answer_question') : t('ask_question')}
                            </MenuItem>
                            <MenuItem onClick={() => { openProblemDialog(); handleClose(); }}>
                                {user === "expert" ? t('answer_problem') : t('ask_problem')}
                            </MenuItem>
                            {user === "farmer" && (
                                <MenuItem onClick={() => { openSolutionDialog(); handleClose(); }}>
                                    {t('solutions')}
                                </MenuItem>
                            )}
                        </Menu>
                    </>
                )}

                {user && (
                    <LoginButton variant='contained' onClick={openWarehouseDialog}>
                        <Typography>{user === "farmer" ? t('warehouse_list') : t('add_warehouse')}</Typography>
                    </LoginButton>
                )}

                {user && (
                    <>
                        <SpacedLoginButton 
                            variant='contained' 
                            onClick={() => window.open('https://rain-check-topaz.vercel.app/', '_blank')}
                        >
                            <Typography>{t('rain_notifier')}</Typography>
                        </SpacedLoginButton>
                    </>
                )}
            </Wrapper>

            <MobileMenuIcon onClick={toggleDrawer(true)}>
                <MenuIcon />
            </MobileMenuIcon>

            <Drawer anchor='left' open={drawerOpen} onClose={toggleDrawer(false)}>
                <Box
                    sx={{ width: 250 }}
                    role="presentation"
                    onClick={toggleDrawer(false)}
                    onKeyDown={toggleDrawer(false)}
                >
                    <List>
                        {menuItems.map((item, index) => (
                            item.show && (
                                <ListItem button key={index} onClick={item.action}>
                                    <ListItemText primary={item.text} />
                                </ListItem>
                            )
                        ))}
                    </List>
                </Box>
            </Drawer>

            <LoginDialog open={open} setOpen={setOpen} />
            <Question openQuestion={openQuestion} setQuestionDialog={setOpenQuestion} />
            <Warehouse openWarehouse={openWarehouse} setWarehouseDialog={setOpenWarehouse} />
            <Problem openProblem={openProblem} setProblemDialog={setOpenProblem} />
            <Solution openSolution={openSolution} setSolutionDialog={setOpenSolution} />
            <Weather open={openWeather} handleClose={closeWeatherDialog} />

            {/* Language Selector Dialog */}
            <Dialog open={languageDialogOpen} onClose={() => setLanguageDialogOpen(false)}>
                <DialogTitle>{t('select_language')}</DialogTitle>
                <LanguageSelector />
            </Dialog>
        </>
    );
};

export default CustomButtons;
