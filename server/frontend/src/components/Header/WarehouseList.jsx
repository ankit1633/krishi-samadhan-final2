import React, { useState, useEffect } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { authenticateGetWarehouse } from '../../service/api.js';
import { useTranslation } from 'react-i18next';

const WarehouseList = () => {
    const { t } = useTranslation(); // Use translation hook
    const [warehouses, setWarehouses] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWarehouses = async () => {
            try {
                const response = await authenticateGetWarehouse();
                if (response.status === 200) {
                    setWarehouses(response.data.data);
                } else {
                    setError(t('error_loading_warehouses')); // Use translation key
                }
            } catch (error) {
                console.error(t('error_loading_warehouses_network'), error); // Use translation key
                setError(t('error_loading_warehouses_network')); // Use translation key
            }
        };

        fetchWarehouses();
    }, [t]); // Added translation key dependency

    return (
        <TableContainer component={Paper} sx={{ boxShadow: 2, overflowX: 'auto' }}>
            <Table>
                <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
                    <TableRow>
                        <TableCell>{t('name')}</TableCell> {/* Use translation key */}
                        <TableCell>{t('email')}</TableCell> {/* Use translation key */}
                        <TableCell>{t('address')}</TableCell> {/* Use translation key */}
                        <TableCell>{t('contact')}</TableCell> {/* Use translation key */}
                        <TableCell>{t('capacity')}</TableCell> {/* Use translation key */}
                        <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{t('price')}</TableCell> {/* Use translation key */}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {error ? (
                        <TableRow>
                            <TableCell colSpan={6}>
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
