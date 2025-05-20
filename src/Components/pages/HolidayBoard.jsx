import React from 'react';
import { generateHolidays } from '../../data/holidays'; // Use named import
import './HolidayBoard.css';

const HolidayBoard = () => {
  const holidays = generateHolidays(); // Dynamically generate holidays

  return (
    <div className="holiday-board">
      <h2>Holiday Calendar</h2>
      <div className="calendar-grid">
        {holidays.map((holiday, index) => (
          <div key={index} className="calendar-cell">
            <div className="holiday-date">{holiday.date}</div>
            <div className="holiday-name">{holiday.name}</div>
            <div className="holiday-reason">{holiday.reason}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HolidayBoard;
