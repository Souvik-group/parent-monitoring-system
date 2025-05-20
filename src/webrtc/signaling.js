import { ref, set, onValue, remove } from "firebase/database";
import { realtimeDB } from "../firebase";

const ROOM_ID = "default-room"; // Or any static ID

export const sendOffer = async (offer) => {
  const offerRef = ref(realtimeDB, `rooms/${ROOM_ID}/offer`);
  await set(offerRef, offer);
};

export const listenForOffer = (callback) => {
  const offerRef = ref(realtimeDB, `rooms/${ROOM_ID}/offer`);
  onValue(offerRef, async (snapshot) => {
    const data = snapshot.val();
    if (data) {
      await callback(data);
    }
  });
};

export const sendAnswer = async (answer) => {
  const answerRef = ref(realtimeDB, `rooms/${ROOM_ID}/answer`);
  await set(answerRef, answer);
};

export const listenForAnswer = (callback) => {
  const answerRef = ref(realtimeDB, `rooms/${ROOM_ID}/answer`);
  onValue(answerRef, async (snapshot) => {
    const data = snapshot.val();
    if (data) {
      await callback(data);
    }
  });
};

export const clearRoom = async () => {
  const roomRef = ref(realtimeDB, `rooms/${ROOM_ID}`);
  await remove(roomRef);
};
