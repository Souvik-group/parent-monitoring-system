import React from 'react';
import { useNavigate } from 'react-router-dom';
import './About.css';

const About = () => {
  const navigate = useNavigate();

  const handleLearnMoreClick = (e) => {
    e.preventDefault();  // Prevents default link behavior
    navigate('/learn-more');  // Navigates to /learn-more route
  };

  return (
    <section className="about" id="about">
      <div className="about-content">
        <h1>Stay connected, stay informed</h1>
        <p>
          The Parent Monitoring App revolutionizes the way parents engage with their child's education. Designed
          specifically for the vibrant city of Kolkata, this mobile application offers real-time tracking of your
          child's attendance and classroom activities. With live video feeds and instant notifications, you can
          ensure your child is making the most of their school experience. Stay connected, informed, and empowered
          as you actively participate in your child's educational journey.
        </p>
        <button className="about-btn" onClick={handleLearnMoreClick}>
          Learn More
        </button>
      </div>
      <div className="about-image">
        <img
          src="https://i.postimg.cc/05CYbkrc/53672f45-a8fe-4600-9a62-2a967f07df44-large.webp"
          alt="Parent Monitoring"
        />
      </div>
    </section>
  );
};

export default About;
