import React, { createContext, useState } from 'react';

export const LanguageContext = createContext();  // Create a new context

export const LanguageProvider = ({ children }) => {  // Destructure children from props
    const [language, setLanguage] = useState('it');  // Initialize language state
    
    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};
