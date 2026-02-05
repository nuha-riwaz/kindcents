import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ChevronDown, LayoutDashboard, LogOut } from 'lucide-react';
import '../index.css';
import logo from '../assets/logo.png';

import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import LocationWarningModal from './LocationWarningModal';

const Navbar = ({ minimal = false }) => {
  const {
    user, logout,
    isAuthModalOpen, setIsAuthModalOpen,
    isLocationModalOpen, setIsLocationModalOpen,
    authMode, setAuthMode, openAuthModal
  } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    if (window.location.pathname !== '/') {
      navigate('/#' + sectionId);
      // Small timeout to allow navigation to complete before scrolling
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // openAuthModal moved to AuthContext

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
    const role = (user.role || 'donor').toLowerCase();

    if (role === 'admin') return '/dashboard/admin';
    if (role === 'ngo' || role === 'nonprofit') return '/dashboard/ngo';
    if (role === 'individual') return '/dashboard/individual';
    return '/dashboard/donor';
  };

  return (
    <>
      <nav style={styles.nav}>
        <div className="container" style={styles.container}>
          <div style={styles.logo}>
            <img src={logo} alt="KindCents" style={{ height: '60px' }} />
          </div>

          <div style={styles.links}>
            {!minimal && (
              <>
                <NavLink to="/" style={styles.link}>Home</NavLink>
                {user && (user.role || 'donor').toLowerCase() === 'donor' && <NavLink to="/campaigns" style={styles.link}>Campaigns</NavLink>}
                <button onClick={() => scrollToSection('about')} style={styles.linkBtn}>About Us</button>
                <button onClick={() => scrollToSection('contact')} style={styles.linkBtn}>Contact</button>
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
    padding: '0.5rem 0',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    borderBottom: '1px solid rgba(241, 245, 249, 0.5)',
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
