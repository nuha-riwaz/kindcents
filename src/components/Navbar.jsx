import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ChevronDown, LayoutDashboard, LogOut, Menu, X } from 'lucide-react';
import '../index.css';
import logo from '../assets/logo.png';

import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import LocationWarningModal from './LocationWarningModal';

const Navbar = ({ minimal = false, hideUserMenu = false }) => {
  const {
    user, logout,
    isAuthModalOpen, setIsAuthModalOpen,
    isLocationModalOpen, setIsLocationModalOpen,
    authMode, setAuthMode, openAuthModal
  } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const getUserDashboardPath = () => {
    if (!user || !user.role) return '/';
    const role = String(user.role).toLowerCase();

    if (role === 'admin') return '/dashboard/admin';
    if (role === 'ngo' || role === 'nonprofit') return '/dashboard/ngo';
    if (role === 'individual') return '/dashboard/individual';
    if (role === 'donor') return '/dashboard/donor';
    return '/';
  };

  const navLinks = (
    <>
      {!minimal && (
        <>
          {user && String(user.role || '').toLowerCase() === 'donor' && (
            <NavLink to="/campaigns" style={styles.link} onClick={() => setIsMobileMenuOpen(false)}>Campaigns</NavLink>
          )}
          <button onClick={() => { scrollToSection('about'); setIsMobileMenuOpen(false); }} style={styles.linkBtn}>About Us</button>
          <button onClick={() => { scrollToSection('contact'); setIsMobileMenuOpen(false); }} style={styles.linkBtn}>Contact</button>
        </>
      )}

      {user && !hideUserMenu ? (
        <div
          style={styles.userMenuContainer}
          onMouseEnter={() => !isMobileMenuOpen && setIsDropdownOpen(true)}
          onMouseLeave={() => !isMobileMenuOpen && setIsDropdownOpen(false)}
          onClick={() => isMobileMenuOpen && setIsDropdownOpen(!isDropdownOpen)}
        >
          <div style={styles.userMenu}>
            <span>Hello, {user.name}</span>
            <ChevronDown size={16} />
          </div>

          {(isDropdownOpen || (isMobileMenuOpen && isDropdownOpen)) && (
            <div style={isMobileMenuOpen ? styles.mobileDropdown : styles.dropdown}>
              <button
                onClick={() => { navigate(getUserDashboardPath()); setIsMobileMenuOpen(false); }}
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
      ) : (!user && !hideUserMenu && (
        <div style={styles.authButtons}>
          <button onClick={() => { openAuthModal('login'); setIsMobileMenuOpen(false); }} style={styles.linkBtn}>Log in</button>
          <span style={{ color: '#cbd5e1' }}>|</span>
          <button onClick={() => { openAuthModal('signup'); setIsMobileMenuOpen(false); }} style={styles.linkBtn}>Sign Up</button>
        </div>
      ))}
    </>
  );

  return (
    <>
      <nav style={styles.nav}>
        <div className="container" style={styles.container}>
          <div style={styles.logo} onClick={() => navigate('/')}>
            <img src={logo} alt="KindCents Logo" style={{ height: '50px' }} />
          </div>

          {/* Desktop Menu */}
          <div className="desktop-menu" style={styles.links}>
            {navLinks}
          </div>

          {/* Mobile Menu Button */}
          <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={styles.mobileMenuBtn}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div style={styles.mobileMenuOverlay}>
            <div style={styles.mobileMenuContent}>
              {navLinks}
            </div>
          </div>
        )}
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
  logo: {
    cursor: 'pointer',
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
  mobileMenuBtn: {
    display: 'none', // Hidden by default, shown in CSS media query
    color: '#1e293b',
    cursor: 'pointer',
    zIndex: 1001,
  },
  mobileMenuOverlay: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: '1rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 999,
  },
  mobileMenuContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    alignItems: 'flex-start',
  },
  mobileDropdown: {
    padding: '0.5rem 0 0.5rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    width: '100%',
  }
};

export default Navbar;
