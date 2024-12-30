import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from '../context/index.jsx'; // Import LanguageContext from context
import '../assets/styles/styles.css';
import { RiArrowLeftWideLine } from "react-icons/ri";

const BackButton = ({ path }) => {  // Destructure path from props

  const navigate = useNavigate();  // Initialize navigate hook

  const { language, setLanguage } = useContext(LanguageContext);  // Initialize language context

  const handleGoBack = () => {
    if (path) {
      navigate(path);  // Navigate to the provided path
    } else {
      navigate(-1);  // Go back to the previous page if no path is provided
    }
  };

  return (
    <Button onClick={handleGoBack} className="back-button">
      <RiArrowLeftWideLine />
      {language === 'it' ? 'Indietro' : 'Back'}
    </Button>
  );
};

export default BackButton;
