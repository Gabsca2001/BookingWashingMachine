import React, { useContext } from 'react';
import '../assets/styles/styles.css';
import { LanguageContext } from '../context/index.jsx'; // Import LanguageContext from context

const HeroComponent = () => {
    const { language, setLanguage } = useContext(LanguageContext); // Destructure language and setLanguage from LanguageContext

    return (
        <header className="hero">
            <div className="hero-text">
                <h1>{language === "it" ? "Lavanderia" : "Laundry"}</h1>
                <p>{language === "it" ? "Prenota la tua lavatrice adesso!" : "Reserve your washing machine now!"}</p>
            </div>
        </header>
    );
};

export default HeroComponent;
