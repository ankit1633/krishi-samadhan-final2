import React, { useState, useEffect } from 'react';
import Answer from './Answer';

// Array of background images
const backgroundImages = [
  '/back1.jpg',
  
  '/back5.jpg'  // Add more image paths as needed
];

const Home = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    // Function to update the image index
    const updateImage = () => {
      setCurrentImage(prevImage => (prevImage + 1) % backgroundImages.length);
    };

    // Set up the interval
    const intervalId = setInterval(updateImage, 1000); // 30 seconds

    // Clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      style={{
        padding: 70,
        backgroundImage: `url(${backgroundImages[currentImage]})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        height: '300vh', // Ensure the container covers the viewport height
        width: '88.9%',   // Ensure the container covers the viewport width
      }}
    >
      <Answer />
    </div>
  );
};

export default Home;