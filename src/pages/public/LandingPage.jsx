import React from 'react';
import Navbar from './sections/Navbar';
import Hero from './sections/Hero';
import Features from './sections/Features';
import ActivationStep from './sections/ActivationStep';
import Footer from './sections/Footer';

const LandingPage = () => {
    return (
        <div className="bg-white min-h-screen">
            <Navbar />
            <Hero />
            <Features />
            <ActivationStep />
            <Footer />
        </div>
    );
};

export default LandingPage;
