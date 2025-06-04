import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import caffeBg from '../../assets/bg.png';
import XIcon from '@mui/icons-material/X';

// Styled Components
const GothicCafeWrapper = styled.div`
  @import url('https://fonts.googleapis.com/css2?family=Tektur:wght@400..900&display=swap');
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url(${caffeBg});
  background-color: #FF0000;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  font-family: 'Tektur', sans-serif;
  color: #FFC107;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CafeContent = styled.div`
  position: relative;
  z-index: 2;
  padding: 2rem;
  max-width: 1200px;
  width: 90%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const Header = styled.header`
  text-align: center;
  padding: 1rem 0;
`;

const CafeTitle = styled.h1`
  font-size: 3.5rem;
  margin: 0;
  color: #FFC107;
  text-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
  letter-spacing: 0.2rem;
  position: relative;
  display: inline-block;
  font-family: 'Tektur', sans-serif;
  font-weight: 900;

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 100%;
    height: 3px;
    background: #FF0000;
    border-radius: 3px;
  }

  @media(max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const CafeSubtitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 400;
  margin: 1rem 0;
  color: #FFFFFF;
  font-style: italic;
  font-family: 'Tektur', sans-serif;

  @media(max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const WelcomeSection = styled.section`
  text-align: center;
  margin: 2rem 0;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const WelcomeTitle = styled.h3`
  font-size: 2rem;
  color: #FFC107;
  margin: 0 0 1rem;
  font-family: 'Tektur', sans-serif;
  font-weight: 700;
  text-shadow: 0 0 5px rgba(255, 0, 0, 0.5);

  @media(max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const WelcomeDescription = styled.p`
  font-size: 1.1rem;
  color: #FFFFFF;
  margin: 0 auto 2rem;
  max-width: 700px;
  line-height: 1.5;
  font-family: 'Tektur', sans-serif;
  font-weight: 400;

  @media(max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin: 1.5rem 0;
  width: 100%;
`;

const BaseButton = styled.button`
  border: none;
  padding: 1rem 2rem;
  border-radius: 25px;
  font-size: 1.3rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  font-family: 'Tektur', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  position: relative;
  overflow: hidden;
  z-index: 1;
  min-width: 200px;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, transparent, rgba(255,255,255,0.2), transparent);
    transform: translateX(-100%);
    transition: transform 0.6s ease;
    z-index: -1;
  }

  &:hover {
    transform: translateY(-3px);
    &:before {
      transform: translateX(100%);
    }
  }

  &:active {
    transform: translateY(1px);
  }

  @media(max-width: 768px) {
    padding: 0.8rem 1.5rem;
    font-size: 1.1rem;
    min-width: 160px;
  }
`;

const CookButton = styled(BaseButton)`
  background: linear-gradient(135deg, #FF0000, #D32F2F);
  color: #FFC107;
  box-shadow: 0 4px 15px rgba(255, 0, 0, 0.4);

  &:hover {
    box-shadow: 0 8px 25px rgba(255, 0, 0, 0.6);
  }
`;

const FollowButton = styled(BaseButton)`
  background: linear-gradient(135deg, #000000, #333333);
  color: #FFFFFF;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);

  &:hover {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.6);
  }
`;

const Footer = styled.footer`
  text-align: center;
  padding: 1rem 0;
  margin-top: auto;
  color: #FFFFFF;
  font-size: 0.9rem;
  font-family: 'Tektur', sans-serif;
  font-weight: 400;
  width: 100%;
`;

const SolanaLogo = styled.span`
  font-weight: 700;
  color: #FFC107;
  margin-left: 0.3rem;
`;

const SolDonalds = () => {
  const navigate = useNavigate();

  const handleCookClick = () => navigate('/game');
  const handleFollowClick = () => window.open('https://x.com/sol_donalds', '_blank');

  return (
    <GothicCafeWrapper>
      <link rel="preload" href={caffeBg} as="image" />
      <CafeContent>
        <Header>
          <CafeTitle>Sol-Donalds Kitchen</CafeTitle>
          <CafeSubtitle>Fast Food Meets Crypto Fun</CafeSubtitle>
        </Header>

        <WelcomeSection>
          <WelcomeTitle>Welcome to our SOL KITCHEN</WelcomeTitle>
          <WelcomeDescription>
            Dive into the sizzling world of Sol-Donalds Kitchen, where you become the chef in a high-speed, crypto-fueled fast-food adventure! Cook up Sol-Burgers, whip up Blockchain Fries, and serve customers with lightning-fast precision.
          </WelcomeDescription>

          <ButtonContainer>
            <CookButton onClick={handleCookClick}>
              LET'S COOK
            </CookButton>
            <FollowButton onClick={handleFollowClick}>
              <XIcon style={{ fontSize: '1.3rem' }} />
              FOLLOW US
            </FollowButton>
          </ButtonContainer>
        </WelcomeSection>

        <Footer>
          © 2025 Sol-Donalds Kitchen | Powered by <SolanaLogo>SOLANA</SolanaLogo>
        </Footer>
      </CafeContent>
    </GothicCafeWrapper>
  );
};

export default SolDonalds;