import React, { useState, useEffect } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, IconButton, Button, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { authenticateGetWeather } from '../../service/api';
import { useTranslation } from 'react-i18next';

// Styled Button
const StyledButton = styled(Button)`
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
        height: 36px;
        padding: 6px 16px;
    }
`;

// Styled Dialog
const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    background-color: #f0f0f0;
    border-radius: 10px;
    width: 80%;
    max-width: 800px;
    height: 80%;
    max-height: 600px;
    @media (max-width: 600px) {
      width: 90%;
      height: 90%;
    }
  }
`;

const Weather = () => {
    const { t } = useTranslation();
    const [weatherData, setWeatherData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fetchWeather = async (lat, lon) => {
            try {
                setLoading(true);
                const response = await authenticateGetWeather(lat, lon);
                if (response.status === 200) {
                    const data = response.data;
                    setWeatherData([
                        {
                            id: data.id,
                            name: data.name,
                            description: data.description,
                            temperature: data.temperature,
                            humidity: data.humidity,
                            windSpeed: data.windSpeed,
                            rainChance: data.rainChance,
                        },
                    ]);
                    setError(null);
                } else {
                    setError('Error loading weather data');
                }
            } catch (error) {
                console.error('Error occurred while fetching weather data:', error);
                setError('Error loading weather data');
            } finally {
                setLoading(false);
            }
        };

        const getLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        fetchWeather(latitude, longitude);
                    },
                    () => {
                        setError('Error retrieving location');
                        setLoading(false);
                    }
                );
            } else {
                setError('Geolocation is not supported by this browser.');
                setLoading(false);
            }
        };

        if (open) {
            getLocation();
        }
    }, [open]);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <StyledButton onClick={handleOpen}>
                {t('weather')}
            </StyledButton>
            <StyledDialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>
                    {t('weather_information')}
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={handleClose}
                        aria-label="close"
                        sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {loading && <Typography>{t('loading')}...</Typography>}
                    {error && <Typography color="error">{t('error_loading_weather_data')}</Typography>}
                    <TableContainer component={Paper} sx={{ boxShadow: 2, overflowX: 'auto' }}>
                        <Table>
                            <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
                                <TableRow>
                                    <TableCell sx={{ fontSize: { xs: '12px', sm: '14px' } }}>{t('city')}</TableCell>
                                    <TableCell sx={{ fontSize: { xs: '12px', sm: '14px' } }}>{t('description')}</TableCell>
                                    <TableCell sx={{ fontSize: { xs: '12px', sm: '14px' } }}>{t('temperature')}</TableCell>
                                    <TableCell sx={{ fontSize: { xs: '12px', sm: '14px' } }}>{t('humidity')}</TableCell>
                                    <TableCell sx={{ fontSize: { xs: '12px', sm: '14px' } }}>{t('wind_speed')}</TableCell>
                                    <TableCell sx={{ fontSize: { xs: '12px', sm: '14px' }, display: { xs: 'none', md: 'table-cell' } }}>{t('rain_chance')}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {weatherData.length > 0 ? (
                                    weatherData.map((weather) => (
                                        <TableRow key={weather.id} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' } }}>
                                            <TableCell sx={{ fontSize: { xs: '12px', sm: '14px' } }}>{weather.name}</TableCell>
                                            <TableCell sx={{ fontSize: { xs: '12px', sm: '14px' } }}>{weather.description}</TableCell>
                                            <TableCell sx={{ fontSize: { xs: '12px', sm: '14px' } }}>{weather.temperature}</TableCell>
                                            <TableCell sx={{ fontSize: { xs: '12px', sm: '14px' } }}>{weather.humidity}</TableCell>
                                            <TableCell sx={{ fontSize: { xs: '12px', sm: '14px' } }}>{weather.windSpeed}</TableCell>
                                            <TableCell sx={{ fontSize: { xs: '12px', sm: '14px' }, display: { xs: 'none', md: 'table-cell' } }}>{weather.rainChance}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6}>
                                            <Typography>{t('no_weather_data')}</Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
            </StyledDialog>
        </div>
    );
};

export default Weather;
