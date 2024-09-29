import React, { useState, useContext, useEffect } from 'react';
import { Box, Button, Typography, styled, Menu, MenuItem, IconButton } from '@mui/material';
import LoginDialog from '../login/LoginDialog';
import { DataContext } from '../../context/DataProvider';
import Profile from './Profile';
import Question from './Question';
import Problem from './Problem';
import Solution from './Solution';
import Warehouse from './Warehouse';
import Weather from './Weather';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GoogleTranslator from './GoogleTranslate'; // Import the GoogleTranslator component

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
`;

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
`;

const Wrapper = styled(Box)`
    display: flex;
    align-items: center;
    gap: 20px;
    width: 100%;
    justify-content: flex-end;
`;

const CustomButtons = () => {
    const { account, setAccount, user } = useContext(DataContext);
    const [open, setOpen] = useState(false);
    const [openQuestion, setOpenQuestion] = useState(false);
    const [openWarehouse, setOpenWarehouse] = useState(false);
    const [openProblem, setOpenProblem] = useState(false);
    const [openSolution, setOpenSolution] = useState(false);
    const [openWeather, setOpenWeather] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);

    const openDialog = () => setOpen(true);
    const openQuestionDialog = () => setOpenQuestion(true);
    const openWarehouseDialog = () => setOpenWarehouse(true);
    const openProblemDialog = () => setOpenProblem(true);
    const openSolutionDialog = () => setOpenSolution(true);

    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const handleProfileClick = (event) => setProfileMenuAnchor(event.currentTarget);
    const handleProfileClose = () => setProfileMenuAnchor(null);

    return (
        <Wrapper>
            <GoogleTranslator show={true} /> {/* Use the GoogleTranslator component */}

            {account ? (
                <>
                    <ProfileButton onClick={handleProfileClick}>
                        <AccountCircleIcon />
                    </ProfileButton>
                    <Menu
                        anchorEl={profileMenuAnchor}
                        open={Boolean(profileMenuAnchor)}
                        onClose={handleProfileClose}
                    >
                        <MenuItem onClick={handleProfileClose}>email: {account}</MenuItem>
                        <MenuItem onClick={() => { setAccount(null); handleProfileClose(); }}>Logout</MenuItem>
                    </Menu>
                </>
            ) : (
                <LoginButton variant='contained' onClick={openDialog}> Login/Sign-up </LoginButton>
            )}

            {user && (
                <>
                    <LoginButton variant='contained' onClick={handleClick}>
                        <Typography>Q&A</Typography>
                    </LoginButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={() => { openQuestionDialog(); handleClose(); }}>
                            {user === "expert" ? "Answer a Question" : "Ask a Question"}
                        </MenuItem>
                        <MenuItem onClick={() => { openProblemDialog(); handleClose(); }}>
                            {user === "expert" ? "Answer a Problem" : "Ask a Problem"}
                        </MenuItem>
                        {user === "farmer" && (
                            <MenuItem onClick={() => { openSolutionDialog(); handleClose(); }}>
                                Solutions
                            </MenuItem>
                        )}
                    </Menu>
                </>
            )}

            {user && <LoginButton variant='contained' onClick={openWarehouseDialog}>
                {user === "farmer" || user==="expert" ? <Typography>Warehouse List</Typography> : <Typography>Add warehouse</Typography>}
            </LoginButton>}

            {user && (
                <LoginButton 
                    variant='contained' 
                    onClick={() => window.open('https://rain-check-topaz.vercel.app/', '_blank')}
                >
                    <Typography>Rain Notifier</Typography>
                </LoginButton>
            )}
            
            <LoginDialog open={open} setOpen={setOpen} />
            <Question openQuestion={openQuestion} setQuestionDialog={setOpenQuestion} />
            <Warehouse openWarehouse={openWarehouse} setWarehouseDialog={setOpenWarehouse} />
            <Problem openProblem={openProblem} setProblemDialog={setOpenProblem} />
            <Solution openSolution={openSolution} setSolutionDialog={setOpenSolution} />
            {openWeather && <Weather />}
        </Wrapper>
    );
};

export default CustomButtons;
