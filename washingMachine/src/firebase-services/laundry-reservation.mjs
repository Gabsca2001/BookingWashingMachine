import { collection, addDoc, query, where, getDocs, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from './firebase-config.mjs';

// Cache to store reservations by Firebase document ID
const reservationsCache = new Map();

// Function to add a reservation to Firebase
const addReservation = async (reservationData) => {
    try {

        const docRef = await addDoc(collection(db, "reservations"), reservationData);

        const modifiedReservationData = {
            ...reservationData,
            slots: reservationData.slots.map(slot => ({
                idReservation: docRef.id,
                ...slot,
            })),
        };

        // Add the new reservation to the cache
        reservationsCache.set(docRef.id, { id: docRef.id, ...modifiedReservationData });

        return docRef;
    } catch (error) {
        console.error("Error adding reservation: ", error);
        return false;
    }
};

const removeReservation = async ({ reservationId, slotIndex }) => {
    try {
        // Display cached reservations for debugging
        reservationsCache.forEach((value, key) => console.log(key, value));

        // Get the reservation from the cache
        const reservation = reservationsCache.get(reservationId);

        if (!reservation || !Array.isArray(reservation.slots)) {
            console.error("Invalid reservation or slots data in cache");
            return false;
        }

        // Find the index of the slot to remove
        const slotToRemoveIndex = reservation.slots.findIndex((slot) => slot.slotIndex === slotIndex);

        if (slotToRemoveIndex === -1) {
            console.error(`Slot with index ${slotIndex} not found in reservation`);
            return false;
        }

        // Clone the slots array and remove the specified slot
        const updatedSlots = [...reservation.slots];
        updatedSlots.splice(slotToRemoveIndex, 1);

        // Create the document reference for Firestore
        const reservationRef = doc(db, "reservations", reservationId);

        if (updatedSlots.length === 0) {
            // If no slots remain, delete the entire reservation
            await deleteDoc(reservationRef);
            reservationsCache.delete(reservationId); // Remove from cache
        } else {
            // Otherwise, update the Firestore document with the remaining slots
            await updateDoc(reservationRef, { slots: updatedSlots });
            reservationsCache.set(reservationId, { ...reservation, slots: updatedSlots }); // Update cache
        }

        return true;
    } catch (error) {
        console.error("Error removing slot from reservation:", error);
        return false;
    }
};



const getReservationsForMachine = async (machineId, date) => {
    try {
        // First, check if we have reservations in the cache for this machine and date
        const cachedReservations = Array.from(reservationsCache.values()).filter(
            (reservation) => reservation.machineId === machineId && reservation.date === date
        );

        // If cache has reservations, return them immediately
        if (cachedReservations.length > 0) {
            return cachedReservations;
        }

        // If cache doesn't have reservations, query Firestore
        const reservationsRef = collection(db, "reservations");
        const q = query(
            reservationsRef,
            where("machineId", "==", machineId),
            where("date", "==", date)
        );

        const querySnapshot = await getDocs(q);

        // Fetch reservations from Firestore and update the cache
        const fetchedReservations = [];
        querySnapshot.forEach((doc) => {
            const reservationData = { id: doc.id, ...doc.data() };
            reservationsCache.set(doc.id, reservationData); // Update the cache
            fetchedReservations.push(reservationData);
        });

        // Return the fetched reservations
        return fetchedReservations;

    } catch (error) {
        console.error("Error fetching reservations: ", error);
        throw error;
    }
};


export { addReservation, getReservationsForMachine, removeReservation };
