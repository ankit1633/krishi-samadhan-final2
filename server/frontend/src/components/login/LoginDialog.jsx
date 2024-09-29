import React, { useState } from 'react';
import { Button, Dialog, Box, styled } from '@mui/material';
import FarmerLogin from './FarmerLogin';
import ExpertLogin from './ExpertLogin';
import DistributorLogin from './DistributorLogin';

const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    background-color: #f0f0f0;
    border-radius: 10px;
  }
`;

const ContentBox = styled(Box)`
  background-color: #D76F30;
  padding: 20px;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
`;

const StyledButton = styled(Button)`
  && {
    margin-right: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
    background-color: #ffffff;
    color: #D76F30;
    font-weight: bold;
  }
`;

const LoginDialog = ({ open, setOpen }) => {
  const [farmerLogin, setFarmerLogin] = useState(false);
  const [expertLogin, setExpertLogin] = useState(false);
  const [distributorLogin, setDistributorLogin] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setFarmerLogin(false);
    setExpertLogin(false);
    setDistributorLogin(false);
  };

  const openFarmerLoginDialog = () => {
    setFarmerLogin(true);
  };

  const openExpertLoginDialog = () => {
    setExpertLogin(true);
  };

  const openDistributorLoginDialog = () => {
    setDistributorLogin(true);
  };

  return (
    <StyledDialog open={open} onClose={handleClose}>
      <ContentBox>
        <StyledButton variant='contained' onClick={openFarmerLoginDialog}>Farmer Login</StyledButton>
        <StyledButton variant='contained' onClick={openExpertLoginDialog}>Expert Login</StyledButton>
        <StyledButton variant='contained' onClick={openDistributorLoginDialog}>Distributor Login</StyledButton>
      </ContentBox>
      <FarmerLogin open={farmerLogin} onClose={() => setFarmerLogin(false)} />
      <ExpertLogin open={expertLogin} onClose={() => setExpertLogin(false)} />
      <DistributorLogin open={distributorLogin} onClose={() => setDistributorLogin(false)} />
    </StyledDialog>
  );
};

export default LoginDialog;
