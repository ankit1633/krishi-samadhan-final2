import React, { useState, useEffect } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { authenticateGetWarehouse } from '../../service/api.js';

const WarehouseList = () => {
    const [warehouses, setWarehouses] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWarehouses = async () => {
            try {
                const response = await authenticateGetWarehouse();
                if (response.status === 200) {
                    setWarehouses(response.data.data);
                } else {
                    setError('Error loading warehouses');
                }
            } catch (error) {
                console.error("Error occurred while fetching warehouses:", error);
                setError('Error loading warehouses');
            }
        };

        fetchWarehouses();
    }, []); // Empty dependency array ensures useEffect runs only once

    return (
        <TableContainer component={Paper} sx={{ boxShadow: 2, overflowX: 'auto' }}>
            <Table>
                <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Address</TableCell>
                        <TableCell>Contact</TableCell>
                        <TableCell>Capacity</TableCell>
                        <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Price</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {error ? (
                        <TableRow>
                            <TableCell colSpan={7}>
                                <Typography>{error}</Typography>
                            </TableCell>
                        </TableRow>
                    ) : (
                        warehouses.map(warehouse => (
                            <TableRow key={warehouse.id} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' } }}>
                                <TableCell>{warehouse.name}</TableCell>
                                <TableCell>{warehouse.email}</TableCell>
                                <TableCell>{warehouse.address}</TableCell>
                                <TableCell>{warehouse.contact}</TableCell>
                                <TableCell>{warehouse.capacity}</TableCell>
                                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{warehouse.price}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default WarehouseList;
