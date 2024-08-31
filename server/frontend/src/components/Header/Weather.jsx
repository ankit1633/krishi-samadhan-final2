import React, { useState, useEffect } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { authenticateGetWeather } from '../../service/api'; // Ensure correct import

// Styled Button
const StyledButton = styled(Button)`
    color: #008000;
    background: #F3CA52;
    text-transform: none;
    font-weight: 600;
    border-radius: 50px;
    padding: 8px 20px; /* Adjust padding for better spacing */
    height: 40px; /* Set a consistent height */
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
    width: 180px; /* Initial width */
    transition: width 0.3s ease, background-color 0.3s ease; /* Smooth transition for width and color */
    text-align: center; /* Center text */
    display: flex;
    align-items: center; /* Center text vertically */
    justify-content: center; /* Center text horizontally */
    
    &:hover {
        width: 220px; /* Increase the width on hover */
        background: #E0B646; /* Darken the background color on hover */
    }
`;

const Weather = () => {
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
                Show Weather
            </StyledButton>
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>
                    Weather Information
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
                    {loading && <Typography>Loading...</Typography>}
                    {error && <Typography color="error">{error}</Typography>}
                    <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
                        <Table>
                            <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
                                <TableRow>
                                    <TableCell>City</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Temperature (°C)</TableCell>
                                    <TableCell>Humidity (%)</TableCell>
                                    <TableCell>Wind Speed (m/s)</TableCell>
                                    <TableCell>Rain Chance (mm)</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {weatherData.length > 0 ? (
                                    weatherData.map((weather) => (
                                        <TableRow key={weather.id} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' } }}>                                         
                                            <TableCell>{weather.name}</TableCell>
                                            <TableCell>{weather.description}</TableCell>
                                            <TableCell>{weather.temperature}</TableCell>
                                            <TableCell>{weather.humidity}</TableCell>
                                            <TableCell>{weather.windSpeed}</TableCell>
                                            <TableCell>{weather.rainChance}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7}>
                                            <Typography>No weather data available</Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Weather;
