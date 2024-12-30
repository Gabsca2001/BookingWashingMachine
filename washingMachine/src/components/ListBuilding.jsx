import React from 'react';
import { useContext } from 'react'; // Import useContext hook
import { Link } from 'react-router-dom';
import buildings from '../utils/buildings';
import styles from './ListBuilding.module.scss'; // Import the SCSS module
import { LanguageContext } from '../context/index.jsx'; // Import LanguageContext from context

const ListBuilding = () => {

  const { language, setLanguage } = useContext(LanguageContext); // Destructure language and setLanguage from LanguageContext


  return (
    <div className={styles.listBuildingContainer}>
      <h1 className={styles.listBuildingTitle}>
        {language === 'it' ? 'Edifici' : 'Buildings'}
      </h1>
      <ul className={styles.buildingList}>
        {buildings.map(building => (
          <Link to={`/building/${building.id}`} className={styles.buildingLink} key={building.id}> {/* Wrap with Link */}
            <li className={styles.buildingItem}>
              <img src={building.imagePath} alt={building.englishName} className={styles.buildingImage} />
              <h2 className={styles.buildingName}>
                {language === 'it' ? building.italianName : building.englishName}
              </h2>
              <ul className={styles.machineList}>
                <li>
                  <hr />
                  <ul className={styles.innerList}>
                    {building.washingMachines.map(machine => (
                      <li key={machine.id}>
                        <div className={styles.machineItemContainer}>
                          <img
                            src={`/assets/images/icons8-lavatrice-32.png`}
                            alt={machine.englishName}
                            className={styles.machineIcon}
                          />
                          <p className={styles.machineName}>
                            {language === 'it' ? machine.italianName : machine.englishName}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </li>
                {building.dryerMachine && (
                  <li>
                    <ul className={styles.innerList}>
                      {building.dryerMachine.map(dryer => (
                        <li key={dryer.id}>
                          <div className={styles.machineItemContainer}>
                            <img
                              src={`/assets/images/icons8-dryer-machine-32.png`}
                              alt={dryer.englishName}
                              className={styles.machineIcon}
                            />
                            <p className={styles.machineName}>
                              {language === 'it' ? dryer.italianName : dryer.englishName}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </li>
                )}
              </ul>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default ListBuilding;
