import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import GoToTop from './GoToTop';
import FloatingSocials from './FloatingSocials';

const MainLayout: React.FC = () => {
  const location = useLocation();
  return (
    <div className="flex flex-col min-h-screen font-sans bg-light-bg text-dark-text">
      <Header />
      <main className="flex-grow" key={location.pathname}>
        <div className="animate-page-enter">
            <Outlet />
        </div>
      </main>
      <Footer />
      <FloatingSocials />
      <GoToTop />
    </div>
  );
};

export default MainLayout;