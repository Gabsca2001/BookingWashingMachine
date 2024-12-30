import React from 'react';
import { useParams } from 'react-router-dom';  // Import useParams to access URL params
import buildings from '../utils/buildings';  // Assuming your buildings data is here
import styles from './BuildingPage.module.scss'; // Import the SCSS module
import BackButton from '../components/BackButton';
import { Link } from 'react-router-dom';
import { useContext } from 'react'; // Import useContext hook
import { LanguageContext } from '../context/index.jsx'; // Import LanguageContext from context

const BuildingPage = () => {
    const { id } = useParams();  // Get the building ID from the URL
    const building = buildings.find(b => b.id === parseInt(id));  // Find the building by ID

    const { language, setLanguage } = useContext(LanguageContext); // Destructure language and setLanguage from LanguageContext

    if (!building) {
        return <div className={styles.notFound}>{language === 'it' ? 'Edificio non trovato' : 'Building not found'}</div>;  // Handle the case where the building is not found
    }

    return (
        <div className={styles.buildingPageContainer}>

            <div className='mt-3 mb-3'>
                <BackButton path="/" />
            </div>

            <div className={styles.buildingHeader}>
                <img src={`${building.imagePath}`} alt={building.englishName} className={styles.buildingImage} />
                <h2 className={styles.buildingTitle}>
                    {language === 'it' ? building.italianName : building.englishName}
                </h2>
            </div>

            <div className={styles.buildingDetails}>
                <section className={styles.machinesSection}>
                    <h4 className={styles.sectionTitle}>
                        {language === 'it' ? 'Lavatrici' : 'Washing Machines'}
                    </h4>
                    <ul className={styles.machineList}>
                        {building.washingMachines.map(machine => (
                            <Link to={`/machine/${machine.id}`} className={styles.machineLink} key={machine.id}>
                                <li className={styles.machineItem}>
                                    <div className='p-4'>
                                        <img
                                            src={`/assets/images/icons8-lavatrice-32.png`}
                                            alt={machine.englishName}
                                            className={styles.machineIcon}
                                        />
                                        <span className={styles.machineName}>
                                            {language === 'it' ? machine.italianName : machine.englishName}
                                        </span>
                                    </div>
                                    <div className={styles.machineItemButton}>
                                        {language === 'it' ? 'Prenota' : 'Reserve'}
                                    </div>
                                </li>
                            </Link>
                        ))}
                    </ul>
                </section>

                {building.dryerMachine && (
                    <section className={styles.machinesSection}>
                        <h3 className={styles.sectionTitle}>
                            {language === 'it' ? 'Asciugatrici' : 'Dryers'}
                        </h3>
                        <ul className={styles.machineList}>
                            {building.dryerMachine.map(dryer => (
                                <Link to={`/machine/${dryer.id}`} className={styles.machineLink} key={dryer.id}>
                                    <li className={styles.machineItem}>
                                        <div className='p-4'>
                                            <img
                                                src={`/assets/images/icons8-dryer-machine-32.png`}
                                                alt={dryer.englishName}
                                                className={styles.machineIcon}
                                            />
                                            <span className={styles.machineName}>
                                                {language === 'it' ? dryer.italianName : dryer.englishName}
                                            </span>

                                        </div>
                                        <div className={styles.machineItemButton}>
                                            {language === 'it' ? 'Prenota' : 'Reserve'}
                                        </div>
                                    </li>
                                </Link>
                            ))}
                        </ul>
                    </section>
                )}
            </div>
        </div>
    );
};

export default BuildingPage;
