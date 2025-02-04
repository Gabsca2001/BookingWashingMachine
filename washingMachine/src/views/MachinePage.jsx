import React, { useContext, useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import buildings from '../utils/buildings';
import { Button, Modal, Form } from 'react-bootstrap';
import styles from './MachinePage.module.scss';
import BackButton from '../components/BackButton';
import { LanguageContext } from '../context/index.jsx';
import { RiArrowLeftWideFill } from "react-icons/ri";
import { RiArrowRightWideLine } from "react-icons/ri";
import { CiTrash } from "react-icons/ci";
import { addReservation, getReservationsForMachine, removeReservation, addLogInfo } from '../firebase-services/laundry-reservation.mjs';
import platform from "platform";

const MachinePage = () => {
    const { language } = useContext(LanguageContext);
    const { id } = useParams(); // Get the machine ID from the URL

    const building = buildings.find(b =>
        b.washingMachines.some(m => m.id === parseInt(id)) ||
        (b.dryerMachine && b.dryerMachine.some(m => m.id === parseInt(id)))
    );

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [day, setDay] = useState({
        date: new Date(),
        slots: Array.from({ length: 48 }, (_, j) => {
            const startHour = Math.floor(j / 2);
            const startMinute = (j % 2) * 30;
            const endHour = startHour + (startMinute === 30 ? 1 : 0);
            const endMinute = startMinute === 30 ? 0 : 30;
            return {
                time: `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')} - ${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`,
                booked: false,
                roomNumber: '',
            };
        }),
    });


    const slotListRef = useRef(null); // Reference to the slot list container

    useEffect(() => {
        const scrollToCurrentTimeSlot = () => {
            const currentDateTime = new Date(); // Current date and time

            // Only scroll if the selected date is the same as today
            const selectedDateStart = new Date(selectedDate);
            selectedDateStart.setHours(0, 0, 0, 0);
            const currentDateStart = new Date(currentDateTime);
            currentDateStart.setHours(0, 0, 0, 0);

            if (selectedDateStart.getTime() !== currentDateStart.getTime()) {
                console.log("Selected date is not today's date. Skipping scroll.");
                return;
            }

            // Find the index of the slot closest to the current time
            const closestSlotIndex = day.slots.findIndex((slot) => {
                const slotDateTime = new Date(day.date); // Use the day's date for the slot
                const [startHour, startMinute] = slot.time.split(' - ')[0].split(':').map(Number); // Slot's start time
                slotDateTime.setHours(startHour, startMinute, 0, 0);

                return currentDateTime <= slotDateTime;
            });

            console.log("Closest slot index:", closestSlotIndex);

            // Scroll to the closest slot
            if (closestSlotIndex !== -1 && slotListRef.current) {
                const slotElements = slotListRef.current.querySelectorAll(`.${styles.slot}`);
                console.log("Slot elements found:", slotElements.length);

                const closestSlotElement = slotElements[closestSlotIndex];
                if (closestSlotElement) {
                    console.log("Scrolling to slot:", closestSlotElement);
                    closestSlotElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                    console.log("Closest slot element not found.");
                }
            } else {
                console.log("Closest slot index is -1 or ref is null.");
            }
        };

        scrollToCurrentTimeSlot();
    }, [selectedDate, day.slots]);

    const formatDateToLocal = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const isSlotPast = (slot) => {
        const currentDateTime = new Date(); // Current date and time
        const selectedDateStart = new Date(selectedDate); // Start of the selected day

        // Normalize currentDateTime and selectedDateStart to midnight for day comparison
        selectedDateStart.setHours(0, 0, 0, 0);
        const currentDateStart = new Date(currentDateTime);
        currentDateStart.setHours(0, 0, 0, 0);

        // If the slot's day is before the current day, it's in the past
        if (selectedDateStart < currentDateStart) {
            return true;
        }

        // Parse the date and time of the slot
        const slotDateTime = new Date(day.date); // Use the day's date for the slot
        const [endHour, endMinute] = slot.time.split(' - ')[1].split(':').map(Number); // Slot's end time
        slotDateTime.setHours(endHour, endMinute, 0, 0); // Set the exact time for the slot

        // If the day matches but the time is before the current time, it's in the past
        return selectedDateStart.getTime() === currentDateStart.getTime() && currentDateTime > slotDateTime;
    };




    const [selectedSlots, setSelectedSlots] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [roomNumber, setRoomNumber] = useState('');

    // Fetch reservations when selectedDate changes
    useEffect(() => {
        const fetchReservations = async () => {
            try {

                const reservations = await getReservationsForMachine(id, formatDateToLocal(selectedDate));

                // Flatten all time slots across reservations
                const bookedSlots = reservations.flatMap((reservation) =>
                    reservation.slots.map((slot) => ({
                        idReservation: reservation.id,
                        time: slot.time,
                        roomNumber: reservation.roomNumber,
                    }
                    ))
                );


                // Update slots based on matching times
                const updatedSlots = day.slots.map((slot) => {
                    const bookedSlot = bookedSlots.find((booked) => booked.time === slot.time);
                    return bookedSlot
                        ? { ...slot, booked: true, roomNumber: bookedSlot.roomNumber, idReservation: bookedSlot.idReservation }
                        : { ...slot, booked: false, roomNumber: '' }; // Reset unbooked slots
                });

                // Update the day state with the updated slots
                setDay((prevDay) => ({
                    ...prevDay,
                    slots: updatedSlots,
                }));
            } catch (error) {
                console.error('Error fetching reservations:', error);
            }
        };

        fetchReservations();  // Fetch when selectedDate changes
    }, [id, selectedDate]); // Dependency on selectedDate

    const handleDateChange = (direction) => {
        const newDate = new Date(selectedDate);

        // Modify the date properly, set to midnight to avoid timezone issues
        if (direction === 'prev') {
            newDate.setDate(newDate.getDate() - 1);
        } else {
            newDate.setDate(newDate.getDate() + 1);
        }

        // Set the time to 00:00:00 to avoid unwanted shifts caused by time zone
        newDate.setHours(0, 0, 0, 0);
        setSelectedDate(newDate); // This triggers the useEffect to refetch slots
        //reset booked slots
        setDay((prevDay) => {
            const newDay = { ...prevDay };
            newDay.slots.forEach((slot) => {
                slot.booked = false;
                slot.roomNumber = '';
            });
            return newDay;
        });
        setSelectedSlots([]); // Reset selected slots
    };

    const handleSlotSelect = (slotIndex) => {
        const newSelectedSlots = [...selectedSlots];
        const selectedSlot = day.slots[slotIndex];

        if (isSlotPast(selectedSlot)) {
            alert(language === 'en' ? 'You can\'t reserve this slot cause is already in the past' : 'Non puoi prenotare più questo slot perché è passato');
            return;
        }

        if (day.slots[slotIndex].booked) return;

        if (newSelectedSlots.length === 0) {
            newSelectedSlots.push({ slotIndex });
        } else {
            const lastSelectedSlotIndex = newSelectedSlots[newSelectedSlots.length - 1].slotIndex;
            const firstSelectedSlotIndex = newSelectedSlots[0].slotIndex;

            if (slotIndex !== lastSelectedSlotIndex + 1 && slotIndex !== firstSelectedSlotIndex - 1) {
                newSelectedSlots.length = 0;
                newSelectedSlots.push({ slotIndex });
            } else if (newSelectedSlots.length < 4) {
                if (slotIndex < firstSelectedSlotIndex) {
                    newSelectedSlots.unshift({ slotIndex });
                } else {
                    newSelectedSlots.push({ slotIndex });
                }
            } else {
                alert(language === 'en' ? 'You can only book up to 4 slots at a time' : 'Puoi prenotare al massimo 4 slot alla volta');
                return;
            }
        }

        setSelectedSlots(newSelectedSlots);
    };

    const handleBooking = () => {
        if (selectedSlots.length > 0) {
            setIsModalOpen(true);
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleDeleteReservation = async (reservationId, slotIndex) => {

        const slot = day.slots[slotIndex];

        if (!slot.booked) {
            alert(language === 'en' ? 'This slot is not booked' : 'Questo slot non è prenotato');
            return;
        }

        if (!window.confirm(language === 'en' ? 'Are you sure you want to delete this reservation?' : 'Sei sicuro di voler eliminare questa prenotazione?')) {
            return;
        }


        try {
            // Pass the reservation ID (e.g., the document ID) and slot index to the function

            let publicIP = "Unknown";
            let localIP = await getLocalIP();

            try {
                const response = await fetch("https://api64.ipify.org?format=json");
                const data = await response.json();
                publicIP = data.ip;
            } catch (error) {
                console.error();
            }

            const userAgent = navigator.userAgent;
            const screenSize = `${window.screen.width}x${window.screen.height}`;
            const deviceInfo = platform.parse(userAgent);
            const os = deviceInfo.os ? `${deviceInfo.os.family} ${deviceInfo.os.version}` : "Unknown OS";
            const browser = deviceInfo.name ? `${deviceInfo.name} ${deviceInfo.version}` : "Unknown Browser";
            const isMobile = /Mobi|Android/i.test(userAgent); // Detect if mobile

            const logData = {
                reservationId,
                publicIP,
                localIP,
                userAgent,
                screenSize,
                os,
                browser,
                isMobile,
                action: 'delete reservation',
                timestamp: new Date().toISOString(),
                roomNumber,
            };
                
            const logRef = await addLogInfo(logData);

            const isDeleteSuccessful = await removeReservation({
                reservationId: reservationId, // Replace with the actual reservation document ID
                slotIndex,
            });

            if (isDeleteSuccessful) {
                // Update the UI to reflect the change
                setDay((prevDay) => {
                    const newDay = { ...prevDay };
                    newDay.slots[slotIndex].booked = false;
                    newDay.slots[slotIndex].roomNumber = '';
                    return newDay;
                });
            } else {
                alert(language === 'en' ? 'Error deleting reservation' : 'Errore durante l\'eliminazione');
            }
        } catch (error) {
            console.error('Error during deletion process:', error);
            alert(language === 'en' ? 'An unexpected error occurred' : 'Si è verificato un errore imprevisto');
        }
    };

    const getLocalIP = async () => {
        return new Promise((resolve) => {
            const rtc = new RTCPeerConnection({ iceServers: [] });

            rtc.createDataChannel("");
            rtc.createOffer()
                .then((offer) => rtc.setLocalDescription(offer))
                .catch(() => { });

            rtc.onicecandidate = (event) => {
                if (event && event.candidate) {
                    const ipMatch = event.candidate.candidate.match(
                        /([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/
                    );
                    if (ipMatch) {
                        resolve(ipMatch[1]); // Extract IPv4 Address
                    }
                }
            };

            setTimeout(() => resolve("Private Network"), 3000); // Fallback if blocked
        });
    };

    const handleModalConfirm = async () => {
        const roomRegex = /^[ABC][0-9]{3}[a-zA-Z]?$/i;

        if (!roomRegex.test(roomNumber.trim())) {
            alert(language === 'en' ? 'Invalid room number' : 'Numero di stanza non valido');
            return;
        }

        const reservationData = {
            roomNumber: roomNumber.trim(),
            machineId: id,
            slots: selectedSlots.map((selectedSlot) => {
                const slot = day.slots[selectedSlot.slotIndex];
                return { time: slot.time, slotIndex: selectedSlot.slotIndex };
            }),
            date: formatDateToLocal(selectedDate),
        };

        let publicIP = "Unknown";
        let localIP = await getLocalIP();

        try {
            const response = await fetch("https://api64.ipify.org?format=json");
            const data = await response.json();
            publicIP = data.ip;
        } catch (error) {
            console.error();
        }

        const userAgent = navigator.userAgent;
        const screenSize = `${window.screen.width}x${window.screen.height}`;
        const deviceInfo = platform.parse(userAgent);
        const os = deviceInfo.os ? `${deviceInfo.os.family} ${deviceInfo.os.version}` : "Unknown OS";
        const browser = deviceInfo.name ? `${deviceInfo.name} ${deviceInfo.version}` : "Unknown Browser";
        const isMobile = /Mobi|Android/i.test(userAgent); // Detect if mobile

        try {
            const docRef = await addReservation(reservationData);
            if (docRef) {

                console.log('Reservation added successfully:', docRef.id);
                setDay((prevDay) => {
                    const newDay = { ...prevDay };
                    selectedSlots.forEach((selectedSlot) => {
                        newDay.slots[selectedSlot.slotIndex] = {
                            ...newDay.slots[selectedSlot.slotIndex],
                            booked: true,
                            roomNumber: roomNumber,
                            idReservation: docRef.id,
                        };
                    });
                    return newDay;
                });
                setSelectedSlots([]);
                setRoomNumber('');
                setIsModalOpen(false);

                const logData = {
                    reservationId: docRef.id,
                    publicIP,
                    localIP,
                    userAgent,
                    screenSize,
                    os,
                    browser,
                    isMobile,
                    action: 'reservation',
                    timestamp: new Date().toISOString(),
                    roomNumber,
                };

                const logRef = await addLogInfo(logData);

            } else {
                alert(language === 'en' ? 'Error adding reservation' : 'Errore durante la prenotazione');
            }
        } catch (error) {
            console.error('Error during reservation process:', error);
            alert(language === 'en' ? 'An unexpected error occurred' : 'Si è verificato un errore imprevisto');
        }
    };

    if (!building) {
        return (
            <div>
                {language === 'en' ? <h1>Building not found</h1> : <h1>Edificio non trovato</h1>}
            </div>
        );
    }

    const machine = building.washingMachines.find(m => m.id === parseInt(id)) ||
        building.dryerMachine?.find(m => m.id === parseInt(id));

    useEffect(() => {

        //get header using class
        const header = document.querySelector(`.${styles.header}`);

        //active class if scrollY
        const sticky = () => {
            if (window.scrollY > 0) {
                header.classList.add(styles.headerActive);
            } else {
                header.classList.remove(styles.headerActive);
            }
        };

        window.addEventListener('scroll', sticky);

        return () => {
            window.removeEventListener('scroll', sticky);
        };

    }, []);

    return (
        <>
            <div className='container mb-3 mt-3'>
                <BackButton path={`/building/${building.id}`} />
            </div>

            <div className={`${styles.header} sticky-top`}>
                <div className="container d-flex justify-content-between align-items-center">
                    <h5>{language === 'it' ? building.italianName : building.englishName}</h5>
                    <h6>{language === 'it' ? machine.italianName : machine.englishName}</h6>
                </div>
                <Button className={styles.buttonHeader} onClick={handleBooking}>
                    {language === 'en' ? 'Book selected slots' : 'Prenota slot selezionati'}
                </Button>
            </div>

            <div className="container mt-3">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <button
                        className={styles.btnDay}
                        onClick={() => handleDateChange('prev')}
                        disabled={selectedDate.toDateString() === new Date().toDateString()}
                    >
                        <RiArrowLeftWideFill /> Prev
                    </button>
                    <div className="text-center">
                        <h5 style={{ fontFamily: 'Mulish' }}>{selectedDate.toLocaleString('default', { weekday: 'long' })}, {selectedDate.getDate()} {selectedDate.toLocaleString('default', { month: 'long' })}</h5>
                    </div>
                    <button className={styles.btnDay} onClick={() => handleDateChange('next')}>
                        Next <RiArrowRightWideLine />
                    </button>
                </div>

                <div className="slot-list">
                    {day.slots.map((slot, index) => (
                        <div
                            key={index}
                            className={`${styles.slot} 
                            ${slot.booked ? styles.booked : ''} 
                            ${selectedSlots.find((selectedSlot) => selectedSlot.slotIndex === index) ? styles.selected : ''}`}
                            onClick={() => slot.booked ? null : handleSlotSelect(index)}
                        >
                            {slot.time}
                            {slot.booked && (
                                <>
                                    <span className={styles.bookedLabel}>
                                        {language === 'en' ? 'Booked' : 'Prenotato'}
                                    </span>
                                    <div className={styles.bookedInfo}>
                                        {slot.roomNumber && (
                                            <span className={styles.roomNumber}>{slot.roomNumber}</span>
                                        )}
                                        <Button
                                            className={styles.deleteButton}
                                            variant="danger"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteReservation(slot.idReservation, index);
                                            }}
                                        >
                                            <CiTrash />
                                            {language === 'en' ? 'Delete' : 'Elimina'}
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>

                <Modal show={isModalOpen} onHide={handleModalClose} className={styles.modalOverlay}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {language === 'en' ? 'Confirm Booking' : 'Conferma prenotazione'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className={styles.modalContent}>
                        <h5>{language === 'en' ? 'Selected slots' : 'Slot selezionati'}</h5>
                        <ul>
                            {selectedSlots.map((selectedSlot, index) => {
                                const slot = day.slots[selectedSlot.slotIndex];
                                return (
                                    <li key={index} className={styles.selectedSlotModal}>
                                        {slot.time} {slot.booked && `(Booked, Room: ${slot.roomNumber})`}
                                    </li>
                                );
                            })}
                        </ul>
                        <Form>
                            <Form.Group controlId="roomNumber">
                                <Form.Label>{language === 'en' ? 'Room number *' : 'Numero di stanza *'}</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder={language === 'en' ? 'AxxxA' : 'AxxxA'}
                                    value={roomNumber}
                                    required
                                    onChange={(e) => setRoomNumber(e.target.value)}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleModalClose}>
                            {language === 'en' ? 'Close' : 'Chiudi'}
                        </Button>
                        <Button className={styles.buttonConfirmModal} onClick={handleModalConfirm}>
                            {language === 'en' ? 'Confirm' : 'Conferma'}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
};

export default MachinePage;
