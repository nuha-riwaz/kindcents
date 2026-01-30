import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import StatsSection from '../components/StatsSection';
import AboutSection from '../components/AboutSection';
import TestimonialsSection from '../components/TestimonialsSection';
import ProjectsSection from '../components/ProjectsSection';
import Footer from '../components/Footer';

const Home = () => {
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
