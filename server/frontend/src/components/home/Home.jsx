import React, { useState, useEffect } from 'react';
import Answer from './Answer';

// Array of background images
const backgroundImages = [
  '/back1.jpg',
  '/back5.jpg' // Add more image paths as needed
];

const Home = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    // Function to update the image index
    const updateImage = () => {
      setCurrentImage(prevImage => (prevImage + 1) % backgroundImages.length);
    };

    // Set up the interval
    const intervalId = setInterval(updateImage, 5000); // Change image every 5 seconds

    // Clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <style>
        {`
          .home-container {
            padding: 70px;
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center;
            height: 300vh;
            width: 100%;
          }

          /* Media queries for smaller screens like Android devices */
          @media (max-width: 600px) {
            .home-container {
              padding: 20px; /* Less padding for smaller screens */
              height: 100vh; /* Adjust height for smaller screens */
            }
          }

          @media (max-width: 400px) {
            .home-container {
              padding: 10px; /* Even less padding for very small screens */
              background-size: contain; /* Adjust background size */
            }
          }
        `}
      </style>
      <div
        className="home-container"
        style={{
          backgroundImage: `url(${backgroundImages[currentImage]})`
        }}
      >
        <Answer />
      </div>
    </>
  );
};

export default Home;
