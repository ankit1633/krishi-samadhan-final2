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
import Question from './Question';
import Problem from './Problem';
import Solution from './Solution';
import Warehouse from './Warehouse';
import Weather from './Weather';
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
    padding: 6px 12px;
    height: 32px;
    box-shadow: 0px 3px 4px rgba(0, 0, 0, 0.2);
    font-size: 14px;
    transition: width 0.3s ease, background-color 0.3s ease;
    width: auto;
    
    &:hover {
        background: #E0B646;
    }

    @media (max-width: 600px) {
        font-size: 12px;
        padding: 4px 10px;
    }
`;

const MoreButtonStyled = styled(Button)`
    color: #008000;
    background: #F3CA52;
    text-transform: none;
    font-weight: 600;
    border-radius: 50px;
    padding: 6px 12px;
    height: 32px;
    box-shadow: 0px 3px 4px rgba(0, 0, 0, 0.2);
    font-size: 14px;
    transition: width 0.3s ease, background-color 0.3s ease;
    width: auto;

    &:hover {
        background: #E0B646;
    }

    @media (max-width: 600px) {
        font-size: 12px;
        padding: 4px 10px;
    }
`;

const Wrapper = styled(Box)`
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    justify-content: flex-end;

    @media (max-width: 600px) {
        display: none;
    }
`;

const CustomButtons = () => {
    const { t } = useTranslation();
    const { account, setAccount, user } = useContext(DataContext);
    const [open, setOpen] = useState(false);
    const [moreMenuAnchor, setMoreMenuAnchor] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [languageDialogOpen, setLanguageDialogOpen] = useState(false);
    
    // Dialog states
    const [openQuestion, setOpenQuestion] = useState(false);
    const [openProblem, setOpenProblem] = useState(false);
    const [openSolution, setOpenSolution] = useState(false);
    const [openWarehouse, setOpenWarehouse] = useState(false);
    const [openWeather, setOpenWeather] = useState(false);

    const openDialog = () => setOpen(true);
    const handleMoreClick = (event) => setMoreMenuAnchor(event.currentTarget);
    const handleMoreClose = () => setMoreMenuAnchor(null);
    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const menuItems = [
        { text: t('warehouse_list'), action: () => { setOpenWarehouse(true); handleMoreClose(); }, show: user === "farmer" },
        { text: t('add_warehouse'), action: () => { setOpenWarehouse(true); handleMoreClose(); }, show: user !== "farmer" },
        { text: t('weather'), action: () => { setOpenWeather(true); handleMoreClose(); }, show: true },
        { text: t('rain_notifier'), action: () => window.open('https://rain-check-topaz.vercel.app/', '_blank'), show: user },
    ];
    return (
        <>
            <Wrapper>
                
                <LoginButton variant='contained' onClick={openDialog}>
                    {t('login_signup')}
                </LoginButton>

                {1 && (
                    <>
                        <LoginButton variant='contained' onClick={handleClick}>
                            <Typography>Q&A</Typography>
                        </LoginButton>
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                            <MenuItem onClick={() => { setOpenQuestion(true); handleClose(); }}>
                                {user === "expert" ? "Answer a Question" : "Ask a Question"}
                            </MenuItem>
                            <MenuItem onClick={() => { setOpenProblem(true); handleClose(); }}>
                                {user === "expert" ? "Answer a Problem" : "Ask a Problem"}
                            </MenuItem>
                            {user === "farmer" && (
                                <MenuItem onClick={() => { setOpenSolution(true); handleClose(); }}>
                                    Solutions
                                </MenuItem>
                            )}
                        </Menu>
                    </>
                )}

                <MoreButtonStyled variant='contained' onClick={handleMoreClick}>
                    More
                </MoreButtonStyled>

                <Menu anchorEl={moreMenuAnchor} open={Boolean(moreMenuAnchor)} onClose={handleMoreClose}>
                    {menuItems.map((item, index) => 
                        item.show && (
                            <MenuItem key={index} onClick={item.action}>
                                {item.text}
                            </MenuItem>
                        )
                    )}
                </Menu>
            </Wrapper>

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
            <Problem open={openProblem} setOpen={setOpenProblem} />
            <Solution open={openSolution} setOpen={setOpenSolution} />
            <Warehouse open={openWarehouse} setOpen={setOpenWarehouse} />
            <Weather open={openWeather} setOpen={setOpenWeather} />
            
            {/* Language Selector Dialog */}
            <Dialog open={languageDialogOpen} onClose={() => setLanguageDialogOpen(false)}>
                <DialogTitle>{t('select_language')}</DialogTitle>
                <LanguageSelector />
            </Dialog>
        </>
    );
};

export default CustomButtons;
