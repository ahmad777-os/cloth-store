import React from 'react';

const Footer = () => {
  return (
    <footer style={{ textAlign: 'center', padding: '10px', backgroundColor: '#eee', marginTop: '20px' }}>
      <p>&copy; {new Date().getFullYear()} My E-commerce Store</p>
    </footer>
  );
};

export default Footer;
