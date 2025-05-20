import React from 'react';
import './Hero.css';

const Hero = () => {

  const smoothScrollTo = (targetId) => {
    const target = document.getElementById(targetId);
    if (!target) return;

    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 800; // 800ms smooth scroll
    let start = null;

    function animation(currentTime) {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function easeInOutQuad(t, b, c, d) {
      t /= d/2;
      if (t < 1) return c/2*t*t + b;
      t--;
      return -c/2 * (t*(t-2) - 1) + b;
    }

    requestAnimationFrame(animation);
  };

  const handleAboutClick = () => {
    smoothScrollTo('about');
  };

  return (
    <section className="hero" id="hero">
      <div className="hero-content">
        <h1 className="animated-text" data-text="Stay connected">Stay connected</h1>
        <p>Monitor your child's progress in real-time</p>
        <button className="hero-btn" onClick={handleAboutClick}>
          About
        </button>
      </div>
    </section>
  );
};

export default Hero;
