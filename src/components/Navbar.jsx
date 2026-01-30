import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import '../index.css';

import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signup');

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <>
      <nav style={styles.nav}>
        <div className="container" style={styles.container}>
          <div style={styles.logo}>
            <img src="/src/assets/logo.png" alt="KindCents" style={{ height: '50px' }} />
          </div>

          <div style={styles.links}>
            <NavLink to="/" style={styles.link}>Home</NavLink>
            {user?.userType === 'donor' && <NavLink to="/campaigns" style={styles.link}>Campaigns</NavLink>}
            <NavLink to="/about" style={styles.link}>About Us</NavLink>
            <NavLink to="/contact" style={styles.link}>Contact</NavLink>

            {user ? (
              <div style={styles.userMenu}>
                <span>Hello, {user.name}</span>
                <ChevronDown size={16} />
                <button onClick={logout} style={styles.authBtnSmall}>(Logout)</button>
              </div>
            ) : (
              <div style={styles.authButtons}>
                <button onClick={() => openAuthModal('login')} style={styles.linkBtn}>Log in</button>
                <span style={{ color: '#cbd5e1' }}>|</span>
                <button onClick={() => openAuthModal('signup')} style={styles.linkBtn}>Sign Up</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
    </>
  );
};

const styles = {
  nav: {
    padding: '0.5rem 0', // Reduced padding as requested
    backgroundColor: 'white', // User requested white navbar
    // Removed absolute positioning so it sits above the hero naturally
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoText: {
    fontFamily: 'var(--font-script)',
    fontSize: '2rem',
    color: 'var(--color-primary)',
    fontWeight: 'normal',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
    fontSize: '1rem',
    color: 'var(--color-text-secondary)',
  },
  link: {
    textDecoration: 'none',
    color: 'var(--color-text-secondary)',
    fontWeight: 500,
  },
  userMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
    color: 'var(--color-text-secondary)',
  },
  authButtons: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  },
  linkBtn: {
    background: 'none',
    border: 'none',
    fontSize: '1rem',
    color: 'var(--color-text-secondary)',
    fontWeight: 500,
    cursor: 'pointer',
    padding: 0,
    fontFamily: 'inherit',
  },
  authBtnSmall: {
    background: 'none',
    border: 'none',
    fontSize: '0.8rem',
    color: '#94a3b8',
    cursor: 'pointer',
    marginLeft: '5px',
  }
};

export default Navbar;
