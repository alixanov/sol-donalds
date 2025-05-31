import React, { Suspense, lazy, useEffect } from 'react';
import { Route, Link, Routes } from 'react-router-dom';
import styled from 'styled-components';

// Lazy-loaded components
const Main = lazy(() => import('../components/main/Main'));
const Menu = lazy(() => import('../components/menu/Menu'));
const Game = lazy(() => import('../components/game/Game'));

// Function to import Google Fonts
const importGoogleFonts = () => {
  // Check if the link already exists to prevent duplicates
  if (!document.querySelector('link[href*="Cinzel+Decorative"]')) {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=Orbitron:wght@400;700&family=Roboto:wght@400;500&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
};

// Fallback loading component
const Loading = () => (
  <LoadingWrapper>
    <LoadingText>Loading SOLdonald’s...</LoadingText>
  </LoadingWrapper>
);

// Not found component
const NotFound = () => (
  <NotFoundWrapper>
    <NotFoundTitle>404 - Order Not Found</NotFoundTitle>
    <NotFoundText>Looks like this crypto dish doesn’t exist!</NotFoundText>
    <StyledLink to="/">Back to SOLdonald’s</StyledLink>
  </NotFoundWrapper>
);

// Styled components for layout and fallback
const AppWrapper = styled.div`
  min-height: 100vh;
  background: #1a1a1a; // Fallback gothic background
  color: #ffffff;
  font-family: 'Roboto', sans-serif; // Default font for the app
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #1a1a1a;
`;

const LoadingText = styled.p`
  font-size: 1.5rem;
  color: #00f2ff; // Neon cyan
  text-shadow: 0 0 10px rgba(0, 242, 255, 0.8);
  font-family: 'Orbitron', 'Roboto', sans-serif; // Consistent font with fallback

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const NotFoundWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #1a1a1a;
  padding: 2rem;
  text-align: center;
`;

const NotFoundTitle = styled.h1`
  font-size: 3rem;
  color: #ff00ff; // Neon pink
  text-shadow: 0 0 10px rgba(255, 0, 255, 0.8);
  font-family: 'Cinzel Decorative', 'Roboto', cursive; // Consistent font with fallback
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const NotFoundText = styled.p`
  font-size: 1.5rem;
  color: #e0e0e0;
  text-shadow: 0 0 5px rgba(0, 242, 255, 0.3);
  font-family: 'Orbitron', 'Roboto', sans-serif; // Consistent font with fallback
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const StyledLink = styled(Link)`
  padding: 0.8rem 1.5rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: #000;
  background: linear-gradient(90deg, #9945FF, #14F195); // Neon gradient
  border-radius: 25px;
  text-decoration: none;
  box-shadow: 0 0 10px rgba(153, 69, 255, 0.6);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  font-family: 'Orbitron', 'Roboto', sans-serif; // Consistent font with fallback

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 15px rgba(20, 241, 149, 0.8);
  }

  @media (max-width: 768px) {
    padding: 0.6rem 1.2rem;
    font-size: 1rem;
  }
`;

const AppRoutes = () => {
  // Load fonts once when the app mounts
  useEffect(() => {
    importGoogleFonts();
  }, []);

  return (
    <AppWrapper>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Home route for landing page */}
          <Route path="/" element={<Main />} />

          {/* Menu route for static or alternative menu view */}
          <Route path="/menu" element={<Menu />} />

          {/* Game route for interactive menu cards */}
          <Route path="/game" element={<Game />} />

          {/* Fallback route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AppWrapper>
  );
};

export default AppRoutes;