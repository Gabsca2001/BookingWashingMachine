import React, { useContext } from 'react';
import HeroComponent from '../components/HeroComponent';
import ListBuilding from '../components/ListBuilding';
import { LanguageContext } from '../context';
import { Dropdown } from 'react-bootstrap';

const Home = () => {

    const { language, setLanguage } = useContext(LanguageContext)

    const handleLanguageChange = (newLanguage) => {
        setLanguage(newLanguage); // Update the language in the context
      };

    return (
        <>
            <HeroComponent />

            <div className='d-flex justify-content-center mt-4 mb-3'>
                <Dropdown>
                    <Dropdown.Toggle id="dropdown-basic" className='btnSelectLanguage'>
                        {language === 'it' ? 'Select language' : 'Seleziona la tua lingua'}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleLanguageChange('en')}>
                            <div>
                                <img src="/assets/images/icons8-gran-bretagna-32.png" className="mx-2" alt="it" />
                                English
                            </div>
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleLanguageChange('it')}>
                            <img src="/assets/images/icons8-italia-32.png" className="mx-2" alt="it" />
                            Italiano
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>

            <ListBuilding />
        </>
    );
}

export default Home;