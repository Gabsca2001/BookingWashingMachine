import React, { useContext } from "react";
import { Alert, Container } from "react-bootstrap";
import BackButton from "../components/BackButton";
import { LanguageContext } from "../context/index.jsx";
import { Dropdown } from "react-bootstrap";


const ComeFunziona = () => {
    const { language, setLanguage } = useContext(LanguageContext); // Destructure language and setLanguage from LanguageContext

    // Handle language change
    const handleLanguageChange = (lang) => {
        setLanguage(lang); // Update the language in context
    };


    return (
        <>
            <div className='container mb-3 mt-3'>
                <BackButton path={`/`} />
            </div>

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

            <Container className="mt-5 text-center" style={{fontFamily : 'Mulish'}}>
                <h1>
                    {language === 'it' ? 'Come funziona?' : 'How does it work?'}
                </h1>
                <Alert variant="danger" className="mt-5 text-start">
                    <Alert.Heading>
                        {language === 'it' ? 'Regole da rispettare' : 'Rules to follow'}
                    </Alert.Heading>
                    <p>{language === 'it' ? '1. Ricorda che puoi selezionare al massimo 4 slot' : '1. Remember that you can select up to 4 slots'}</p>
                    <p>
                        {language === 'it' ? '2. Seleziona solo gli slot che ti servono' : '2. Select only the slots you need'}
                    </p>
                    <p>
                        {language === 'it' ? '3. Ricorda di seguire il buon senso poichè tutti sono in grado di eliminare slot già occupati' : '3. Remember to use common sense as everyone can delete slots already booked'}
                    </p>
                    <p>
                        {language === 'it' ? '4. Inserisci il tuo numero della camera. Non quello di qualcun\'altro' : '4. Enter your room number. Not someone else\'s'}
                    </p>

                </Alert>
                <h4>Step 1</h4>
                <p>
                    {language === 'it' ? 'Seleziona l\'edificio' : 'Select the building'}
                </p>
                <img className="img-fluid" height="50" src="/assets/images/edifici.png" />
                <hr />
                <h4>Step 2</h4>
                <p>
                    {language === 'it' ? 'Seleziona la lavatrice o l\'asciugatrice' : 'Select the washing machine or the dryer'}
                </p>
                <img className="img-fluid" height="50" src="/assets/images/machines.png" />
                <hr />
                <h4>Step 3</h4>
                <p>
                    {language === 'it' ? 'Seleziona gli slot disponibili' : 'Select the available slots'}
                </p>
                <img className="img-fluid" height="50" src="/assets/images/slotSelezionati.png" />
                <hr />
                <h4>Step 4</h4>
                <p>
                    {language === 'it' ? 'Conferma la prenotazione inserendo il numero della stanza' : 'Confirm the booking by entering the room number'}
                </p>
                <img className="img-fluid" height="50" src="/assets/images/confermaPrenotazione.png" />
            </Container>
        </>
    );
}

export default ComeFunziona;