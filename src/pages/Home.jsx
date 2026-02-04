import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import StatsSection from '../components/StatsSection';
import AboutSection from '../components/AboutSection';
import TestimonialsSection from '../components/TestimonialsSection';
import ProjectsSection from '../components/ProjectsSection';
import Footer from '../components/Footer';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (user) {
            // New User (No Role) -> Onboarding
            if (!user.role) {
                navigate('/onboarding');
                return;
            }

            // Admin -> Dashboard
            if (user.role === 'admin' || user.userType === 'admin') {
                navigate('/dashboard/admin');
            }
        }
    }, [user, navigate]);

    return (
        <div className="start-page">
            <Navbar />
            <HeroSection />
            <StatsSection />
            <AboutSection />
            <ProjectsSection />
            <TestimonialsSection />
            <Footer />
        </div>
    );
};

export default Home;
