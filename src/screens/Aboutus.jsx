import React, { useEffect } from 'react';
import '../css/AboutUs.css';
import '../css/font.css';
import founderImage from '../images/founder.jpg';
import materialsImage from '../images/materials.jpg';
import designImage from '../images/design.jpg';
import craftImage from '../images/craft.jpg';
import endureImage from '../images/endure.jpg';

const AboutUs = () => {
  useEffect(() => {
    const elements = document.querySelectorAll('[data-animate]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    elements.forEach((el) => observer.observe(el));
  }, []);

  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="about-hero" data-animate>
        <div className="about-hero-text">
          <h1 className="hero-title">Timeless Elegance, Quiet Confidence</h1>
          <p className="hero-subtitle">
            A house built on heritage, intention, and craftsmanship.
          </p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="mission-statement" data-animate>
        <div className="mission-content">
          <h2>Our Ethos</h2>
          <p className="mission-text">
            In a world of haste and trends, we move with purpose. Our garments are not created—they are composed, curated, and meant to endure. We are for those who value the whisper over the shout, the detail over the display.
          </p>
        </div>
      </section>

      {/* Values Grid */}
      <section className="values-grid">
        <div className="value-card" data-animate>
          <div className="value-icon">✦</div>
          <h3>Legacy</h3>
          <p>We preserve traditions of tailoring and textile knowledge passed through generations.</p>
        </div>
        <div className="value-card" data-animate>
          <div className="value-icon">♼</div>
          <h3>Integrity</h3>
          <p>Every piece is made consciously, for those who dress with awareness—not excess.</p>
        </div>
        <div className="value-card" data-animate>
          <div className="value-icon">⌘</div>
          <h3>Subtle Luxury</h3>
          <p>Our aesthetic is restrained but rich—crafted for quiet presence, not performance.</p>
        </div>
      </section>

      {/* Founder's Quote */}
      <section className="founder-quote" data-animate>
        <img src={founderImage} alt="Founder" className="founder-image" />
        <blockquote>
          “Luxury isn’t loud. It’s found in the precision of a seam, the feel of real fabric, and the knowledge that less can truly be more.”
        </blockquote>
        <p className="founder-signature">— Elena Roth, Founder</p>
      </section>

      {/* Craftsmanship Steps */}
      <section className="craftsmanship-section">
        <h2 className="section-title" data-animate>How We Work</h2>
        <div className="process-steps">
          <div className="process-step" data-animate>
            <img src={materialsImage} alt="Materials" />
            <span className="step-number">01</span>
            <h4>Materials</h4>
            <p>We use natural fibers, sourced for longevity and integrity.</p>
          </div>
          <div className="process-step" data-animate>
            <img src={designImage} alt="Design" />
            <span className="step-number">02</span>
            <h4>Design</h4>
            <p>Minimal silhouettes tailored with elegance and ease.</p>
          </div>
          <div className="process-step" data-animate>
            <img src={craftImage} alt="Craft" />
            <span className="step-number">03</span>
            <h4>Craft</h4>
            <p>Each piece is built—not produced—by skilled hands and thoughtful minds.</p>
          </div>
          <div className="process-step" data-animate>
            <img src={endureImage} alt="Endure" />
            <span className="step-number">04</span>
            <h4>Endure</h4>
            <p>We aim for timelessness—clothing that lives longer than seasons.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
