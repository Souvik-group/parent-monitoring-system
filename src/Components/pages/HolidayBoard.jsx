import React, { useEffect, useState } from 'react';
import { db1 } from '../../firebase2'; // Adjust the import path as necessary
import { collection, getDocs } from 'firebase/firestore';
import './HolidayBoard.css';

const HolidayBoard = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const querySnapshot = await getDocs(collection(db1, 'notifications'));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="holiday-board">
      <h2>Notifications</h2>
      <ul>
        {notifications.map(notif => (
          <li key={notif.id}>{notif.text}</li>
        ))}
      </ul>
    </div>
  );
};

export default HolidayBoard;
