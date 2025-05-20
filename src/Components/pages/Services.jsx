import React from 'react';
import './Services.css'
import { Link } from 'react-router-dom';

const Services = () => {
  return (
    <section className="services" id ="services">
        <h2>Monitor your child's school life easily</h2>
        <div className="services-container">
        <Link to="/Holiday-board" className="service-card">
          <img src="https://i.postimg.cc/WpgTmG3S/attendance-management.jpg" alt="Attendance Tracker" />
          <h3>Holiday Notice Board</h3>
          <p>Stay updated with the latest school holiday announcements.</p>
        </Link>

          <Link to="/activity" className="service-card">
          <img src="https://i.postimg.cc/WbDBcBX8/monitor.jpg" alt="Classroom Activity Monitoring" />
          <h3>Classroom Activity Monitoring</h3>
          <p>Keep an eye on your child's classroom activities.</p>
        </Link>

          <Link to="/image" className="service-card">
          <img src="https://i.postimg.cc/KvGcDHY5/image-video.jpg" alt="Instant Notifications" />
          <h3>Image & Video</h3>
          <p>Receive photo and video  about your child's school life.</p>
        </Link>

        </div>
      </section>
    
  );
};

export default Services;