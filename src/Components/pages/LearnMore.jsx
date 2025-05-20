import React, { useState } from 'react';
import './LearnMore.css';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const slides = [
  {
    title: 'Real-time Monitoring',
    description: `Stay updated with your child's academic performance through our Real-Time Monitoring feature. 
    This tool provides parents with instant access to grades, attendance records, and classroom activities. 
    By receiving immediate notifications about any changes or concerns, you can engage promptly and support your child when they need it most. 
    This transparency fosters a strong connection between parents and educators, ensuring that everyone is on the same page regarding the child's education.`,
    image: 'https://i.postimg.cc/wvq9GQZ8/imgae.jpg', // Replace with the direct image URL
  },
  
  {
    title: 'Benefits for Parents',
    description: `Increase parental engagement, enjoy peace of mind, improve communication with school staff, 
    and make empowered decisions with real-time updates and detailed reports about your child's education and development.`,
    image: 'https://i.postimg.cc/c4Y8gjr4/parent-teacher.jpg', // Update with your image path
  },
  {
    title: 'User Testimonials',
    description: `"This app has been a game-changer! I can track my son's attendance and even watch his classroom activities while I'm at work." 
    - John D., Parent`,
    image: 'https://i.postimg.cc/Hx9zHRHx/student.jpg', // Update with your image path
  },
];

const LearnMore = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <motion.section 
      className="learn-more-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="modal-content">
        <div className="image-container">
          <img src={slides[currentSlide].image} alt={slides[currentSlide].title} />
        </div>
        <div className="text-container">
          <h2>{slides[currentSlide].title}</h2>
          <p>{slides[currentSlide].description}</p>
          <div className="pagination-controls">
            <button onClick={handlePrev}><FaChevronLeft /></button>
            <span>{currentSlide + 1} / {slides.length}</span>
            <button onClick={handleNext}><FaChevronRight /></button>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default LearnMore;
