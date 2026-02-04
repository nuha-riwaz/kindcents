import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ChevronDown, LayoutDashboard, LogOut } from 'lucide-react';
import '../index.css';
import logo from '../assets/logo.png';

import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import LocationWarningModal from './LocationWarningModal';

const Navbar = ({ minimal = false }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signup');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const openAuthModal = (mode) => {
    if (mode === 'signup') {
      setIsLocationModalOpen(true);
    } else {
      setAuthMode(mode);
      setIsAuthModalOpen(true);
    }
  };

  const handleLocationConfirm = () => {
    setIsLocationModalOpen(false);
    setAuthMode('signup');
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/');
  };

  const getUserDashboardPath = () => {
    if (!user) return '/';
    if (user.userType === 'admin') return '/dashboard/admin';
    return `/dashboard/${user.userType || 'donor'}`;
  };

  return (
    <>
      <nav style={styles.nav}>
        <div className="container" style={styles.container}>
          <div style={styles.logo}>
            <img src={logo} alt="KindCents" style={{ height: '50px' }} />
          </div>

          <div style={styles.links}>
            {!minimal && (
              <>
                <NavLink to="/" style={styles.link}>Home</NavLink>
                {user?.userType === 'donor' && <NavLink to="/campaigns" style={styles.link}>Campaigns</NavLink>}
                <NavLink to="/about" style={styles.link}>About Us</NavLink>
                <NavLink to="/contact" style={styles.link}>Contact</NavLink>
              </>
            )}

            {user ? (
              <div
                style={styles.userMenuContainer}
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <div style={styles.userMenu}>
                  <span>Hello, {user.name}</span>
                  <ChevronDown size={16} />
                </div>

                {isDropdownOpen && (
                  <div style={styles.dropdown}>
                    <button
                      onClick={() => navigate(getUserDashboardPath())}
                      className="dropdown-item"
                    >
                      <LayoutDashboard size={14} /> Dashboard
                    </button>
                    <button
                      onClick={handleLogout}
                      className="dropdown-item logout-item"
                    >
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                )}
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
      <LocationWarningModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onConfirm={handleLocationConfirm}
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
    color: 'var(--color-secondary)',
  },
  link: {
    textDecoration: 'none',
    color: 'var(--color-secondary)',
    fontWeight: 500,
  },
  userMenuContainer: {
    position: 'relative',
    paddingBottom: '15px',
    marginBottom: '-15px',
    cursor: 'pointer',
  },
  userMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#1e293b',
    fontWeight: 600,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    padding: '0.5rem',
    minWidth: '160px',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    zIndex: 1000,
    border: '1px solid #f1f5f9',
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#475569',
    fontSize: '0.9rem',
    fontWeight: 500,
    textAlign: 'left',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    width: '100%',
    fontFamily: 'inherit',
    '&:hover': {
      backgroundColor: '#f8fafc',
      color: '#2563eb',
    }
  },
  logoutItem: {
    color: '#ef4444',
    borderTop: '1px solid #f1f5f9',
    borderRadius: 0,
    marginTop: '0.25rem',
    paddingTop: '0.75rem',
  },
  authButtons: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
    marginLeft: '1rem',
  },
  linkBtn: {
    background: 'none',
    border: 'none',
    fontSize: '1rem',
    color: 'var(--color-secondary)',
    fontWeight: 500,
    cursor: 'pointer',
    padding: 0,
    fontFamily: 'inherit',
  },
};

export default Navbar;
