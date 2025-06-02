import React, { Suspense, lazy, useEffect } from 'react';
import { Route, Link, Routes } from 'react-router-dom';
import styled from 'styled-components';

// Lazy-loaded components
const Menu = lazy(() => import('../components/menu/Menu'));
const Game = lazy(() => import('../components/game/Game'));

// Function to import Google Fonts
const importGoogleFonts = () => {
  if (!document.querySelector('link[href*="Tektur"]')) {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Tektur:wght@400..900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
};

// Fallback loading component
const Loading = () => (
  <LoadingWrapper aria-busy="true">
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
  background: #1a1a1a;
  color: #ffffff;
  font-family: 'Tektur', sans-serif;
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
  color: #FFC107;
  text-shadow: 0 0 10px rgba(255, 193, 7, 0.8);
  font-family: 'Tektur', sans-serif;

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
  color: #D32F2F;
  text-shadow: 0 0 10px rgba(211, 47, 47, 0.8);
  font-family: 'Tektur', sans-serif;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const NotFoundText = styled.p`
  font-size: 1.5rem;
  color: #FFF9C4;
  text-shadow: 0 0 5px rgba(255, 193, 7, 0.3);
  font-family: 'Tektur', sans-serif;
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
  background: linear-gradient(90deg, #D32F2F, #FFC107);
  border-radius: 25px;
  text-decoration: none;
  box-shadow: 0 0 10px rgba(211, 47, 47, 0.6);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  font-family: 'Tektur', sans-serif;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 15px rgba(255, 193, 7, 0.8);
  }

  @media (max-width: 768px) {
    padding: 0.6rem 1.2rem;
    font-size: 1rem;
  }
`;

const AppRoutes = () => {
  useEffect(() => {
    importGoogleFonts();
  }, []);

  return (
    <AppWrapper>
      <Suspense fallback={<Loading />}>
        <Routes basename="/">
          <Route path="/" element={<Menu />} />
          <Route path="/game" element={<Game />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AppWrapper>
  );
};

export default AppRoutes;