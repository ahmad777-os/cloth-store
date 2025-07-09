import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

import '../css/Crousal.css';
import '../css/font.css';

import crousalImage1 from '../images/crousal_image_1.png';
import crousalImage2 from '../images/crousal_image_2.png';

const slides = [
  {
    image: crousalImage1,
    text: 'SALE',
    subtext: 'ONLINE NOW',
  },
  {
    image: crousalImage2,
    text: 'NEW DROP',
    subtext: 'SPRING 2025',
  },
];

const Crousal = () => {
  const [index, setIndex] = useState(0);

  const prevSlide = () => {
    setIndex(index === 0 ? slides.length - 1 : index - 1);
  };

  const nextSlide = () => {
    setIndex((index + 1) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [index]);

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <section className="hero-carousel">
      {/* Brand section with animation */}
      <div className="top-bar" data-aos="fade-down">
        <div className="brand">AHMD</div>
      </div>

      {/* Carousel section with zoom animation */}
      <div className="carousel-content" data-aos="zoom-in-up">
        <button className="arrow left" onClick={prevSlide}>←</button>

        <div className="image-box">
          <img src={slides[index].image} alt="model" className="carousel-img" />
          <div className="overlay-text" data-aos="fade-up">
            <h2>{slides[index].text}</h2>
            <p>{slides[index].subtext}</p>
          </div>
        </div>

        <button className="arrow right" onClick={nextSlide}>→</button>
      </div>

      {/* Quote with fade animation */}
      <div className="quote-text" data-aos="fade-up">
        <p>
          Under a pale orange sky, the wind whispered<br />
          through the empty streets like a forgotten memory.<br />
          A single leaf danced in the silence, tracing<br />
          invisible patterns only it understood.
        </p>
      </div>

      {/* Dots with fade-in effect */}
      <div className="dots" data-aos="fade-in">
        {slides.map((_, i) => (
          <span
            key={i}
            className={`dot ${i === index ? 'active' : ''}`}
            onClick={() => setIndex(i)}
          ></span>
        ))}
      </div>
    </section>
  );
};

export default Crousal;
