import React, { useState, useContext } from 'react';
import {
    Box,
    Button,
    Typography,
    styled,
    Menu,
    MenuItem,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Dialog,
    DialogTitle
} from '@mui/material';
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

// Styled components
const LoginButton = styled(Button)`
    color: #008000;
    background: #F3CA52;
    text-transform: none;
    font-weight: 600;
    border-radius: 50px;
    padding: 6px 12px;  // Reduced padding
    height: 32px;  // Reduced height
    box-shadow: 0px 3px 4px rgba(0, 0, 0, 0.2);  // Reduced box shadow
    font-size: 14px;  // Reduced font size
    transition: width 0.3s ease, background-color 0.3s ease;
    width: auto;  // Set to auto to fit content
    
    &:hover {
        background: #E0B646;
    }

    @media (max-width: 600px) {
        font-size: 12px;  // Smaller font size on mobile
        padding: 4px 10px;  // Smaller padding on mobile
    }
`;

const ProfileButton = styled(IconButton)`
    color: #008000;
    background: #F3CA52;
    border-radius: 50%;
    width: 32px;  // Reduced width
    height: 32px;  // Reduced height
    padding: 4px;  // Reduced padding
    box-shadow: 0px 3px 4px rgba(0, 0, 0, 0.2);  // Reduced box shadow
    
    &:hover {
        background: #E0B646;
    }

    @media (max-width: 600px) {
        width: 28px;  // Smaller width on mobile
        height: 28px;  // Smaller height on mobile
    }
`;

const Wrapper = styled(Box)`
    display: flex;
    align-items: center;
    gap: 10px;  // Reduced gap between buttons
    width: 100%;
    justify-content: flex-end;

    @media (max-width: 600px) {
        display: none;
    }
`;

const MobileMenuIcon = styled(IconButton)`
    display: none;

    @media (max-width: 600px) {
        display: block;
        color: #008000;
        background: #F3CA52;
        border-radius: 50%;
        box-shadow: 0px 3px 4px rgba(0, 0, 0, 0.2);  // Reduced box shadow
    }
`;

const SpacedLoginButton = styled(LoginButton)`
    margin-right: 10px;  // Reduced margin-right
`;

const WeatherWrapper = styled(Box)`
    margin-left: 5px;
`;

const LanguageButton = styled(Button)`
    color: #008000;
    background: #F3CA52;
    text-transform: none;
    font-weight: 600;
    border-radius: 50px;
    padding: 6px 12px;  // Reduced padding
    height: 32px;  // Reduced height
    box-shadow: 0px 3px 4px rgba(0, 0, 0, 0.2);  // Reduced box shadow
    font-size: 14px;  // Reduced font size
    transition: width 0.3s ease, background-color 0.3s ease;
    width: auto;  // Set to auto to fit content
    
    &:hover {
        background: #E0B646;
    }

    @media (max-width: 600px) {
        font-size: 12px;  // Smaller font size on mobile
        padding: 4px 10px;  // Smaller padding on mobile
    }
`;

const CustomButtons = () => {
    const { t } = useTranslation();
    const { account, setAccount, user, setUser } = useContext(DataContext);
    const [open, setOpen] = useState(false);
    const [openQuestion, setOpenQuestion] = useState(false);
    const [openWarehouse, setOpenWarehouse] = useState(false);
    const [openProblem, setOpenProblem] = useState(false);
    const [openSolution, setOpenSolution] = useState(false);
    const [openWeather, setOpenWeather] = useState(false);
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

            

{1 && (
                    <>
                        <LoginButton variant='contained' onClick={handleClick}>
                            <Typography>Q&A</Typography>
                        </LoginButton>
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                            <MenuItem onClick={() => { openQuestionDialog() }}>
                                {user === "expert" ? "Answer a Question" : "Ask a Question"}
                            </MenuItem>
                            <MenuItem onClick={() => { openProblemDialog() }}>
                                {user === "expert" ? "Answer a Problem" : "Ask a Problem"}
                            </MenuItem>
                            {user === "farmer" && (
                                <MenuItem onClick={() => { openSolutionDialog()}}>
                                    Solutions
                                </MenuItem>
                            )}
                        </Menu>
                    </>
                )}

                {user && (
                    <LoginButton variant='contained' onClick={() => {openWarehouseDialog()}}>
                        <Typography>{user === "farmer" ? t('warehouse_list') : t('add_warehouse')}</Typography>
                    </LoginButton>
                )}

                {user && (
                    <SpacedLoginButton 
                        variant='contained' 
                        onClick={() => window.open('https://rain-check-topaz.vercel.app/', '_blank')}
                    >
                        <Typography>{t('rain_notifier')}</Typography>
                    </SpacedLoginButton>
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
            <Question open={openQuestion} setOpen={setOpenQuestion} />
            <Warehouse open={openWarehouse} setOpen={setOpenWarehouse} />
            <Problem open={openProblem} setOpen={setOpenProblem} />
            <Solution open={openSolution} setOpen={setOpenSolution} />
            {openWeather && (
                <WeatherWrapper>
                    <Weather />
                </WeatherWrapper>
            )}

            {/* Language Selector Dialog */}
            <Dialog open={languageDialogOpen} onClose={() => setLanguageDialogOpen(false)}>
                <DialogTitle>{t('select_language')}</DialogTitle>
                <LanguageSelector />
            </Dialog>
        </>
    );
};

export default CustomButtons;
