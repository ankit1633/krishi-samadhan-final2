import React, { useContext, useState } from 'react';
import { Box, Typography, TextField, Button, styled, Dialog } from '@mui/material';
import { authenticateWarehouse } from '../../service/api.js';
import DataProvider, { DataContext } from '../../context/DataProvider.jsx';
import WarehouseList from './WarehouseList.jsx';
const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    background-color: #f0f0f0;
    border-radius: 10px;
    width: 60%;
    height: 50%;
  }
`;

const ContentBox = styled(Box)`
  background-color: #FFFFFF;
  padding: 20px;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
`;

const LoginButton = styled(Button)`
  text-transform: none;
  background: #FB641B;
  color: #fff;
  height: 48px;
  border-radius: 2px;
  margin-top: 20px;
`;

const Error = styled(Typography)`
  font-size: 10px;
  color: #ff6161;
  margin-top: 5px;
`;

const Warehouse = ({ openWarehouse, setWarehouseDialog }) => {
    const {user} = useContext(DataContext);
    const [warehouse, setWarehouse] = useState({ name: '', email: '', address: '',contact: '',capacity: '',price: ''});
    const [error, setError] = useState('');

    const onValueChange = (e) => {
        setWarehouse({ ...warehouse, [e.target.name]: e.target.value });
    }

    const handleClose = () => {
        setWarehouseDialog(false);
        setError('');
        setWarehouse({ name: '', email: '', address: '',contact: '',capacity: '',price: '' });
    }

    const addWarehouse = async () => {
        try {
            const response = await authenticateWarehouse(warehouse);
            if (response.status === 200) {
                handleClose();
                console.log(response.data);
            } else {
                setError(response.data.message || 'Error adding warehouse');
            }
        } catch (error) {
            console.error("Error occurred while adding warehouse:", error);
            setError('Error adding warehouse');
        }
    };

    return (
        
        <StyledDialog open={openWarehouse} onClose={handleClose}>
           {  user === "distributor" ? (
             <ContentBox>
             <TextField variant='standard' onChange={onValueChange} name='name' label='Enter name' />
             <TextField variant='standard' onChange={onValueChange} name='email' label='Enter email' />
             <TextField variant='standard' onChange={onValueChange} name='address' label='Enter address'multiline rows={4} />
             <TextField variant='standard' onChange={onValueChange} name='contact' label='Enter contact' />
             <TextField variant='standard' onChange={onValueChange} name='capacity' label='capacity' multiline rows={3} />
             <TextField variant='standard' onChange={onValueChange} name='price' label='price'  />
             {error && <Error>{error}</Error>}
             <LoginButton onClick={addWarehouse}>Continue</LoginButton>
         </ContentBox>
           ) : 
           <ContentBox>
             <Box>
              <WarehouseList />
             </Box>
         </ContentBox>

           }
        </StyledDialog>
    );
}

export default Warehouse;
