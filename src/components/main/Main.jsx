import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import gsap from 'gsap';
import caffeBg from '../../assets/bg.jpg';

// Styled Components
const LandingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: 
    linear-gradient(rgba(0, 0, 0, 0.33), rgba(0, 0, 0, 0.36)),
    url(${caffeBg}) center/cover no-repeat;
  position: relative;
  overflow: hidden;
  font-family: 'Cinzel Decorative', cursive;
`;

const Content = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 2.5rem;
  max-width: 600px;
  width: 85%;
  background: rgba(15, 15, 20, 0.06);
  backdrop-filter: blur(8px);
  border-radius: 12px;
  border: 1px solid rgba(153, 69, 255, 0.4);
  box-shadow: 
    0 0 15px rgba(153, 69, 255, 0.3),
    inset 0 0 10px rgba(153, 69, 255, 0.2);
  opacity: 0;
  transform: translateY(30px);

  @media (max-width: 768px) {
    padding: 2rem;
    width: 90%;
  }
`;

const Title = styled.h1`
  font-size: 3.2rem;
  font-weight: 700;
  margin: 0 0 1rem;
  background: linear-gradient(90deg, #a855f7, #14F195);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: 0.1rem;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.4rem;
  font-weight: 400;
  color: #e0e0e0;
  margin-bottom: 2.5rem;
  line-height: 1.4;
  opacity: 0.9;

  @media (max-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 2rem;
  }
`;

const StartButton = styled(Link)`
  display: inline-block;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: #111;
  background: linear-gradient(90deg, #a855f7, #14F195);
  border-radius: 50px;
  text-decoration: none;
  box-shadow: 0 0 15px rgba(168, 85, 247, 0.4);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 20px rgba(20, 241, 149, 0.5);
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: 0.5s;
  }

  &:hover::after {
    left: 100%;
  }

  @media (max-width: 768px) {
    padding: 0.8rem 1.8rem;
    font-size: 1.1rem;
  }
`;

const Main = () => {
  const contentRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(contentRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1 }
    )
      .fromTo(titleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 }, '-=0.5'
      )
      .fromTo(subtitleRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.7 }, '-=0.4'
      )
      .fromTo(buttonRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }, '-=0.3'
      );

    // Subtle floating effect for title
    gsap.to(titleRef.current, {
      y: -5,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  }, []);

  return (
    <LandingWrapper>
      <Content ref={contentRef}>
        <Title ref={titleRef}>SOLdonald's</Title>
        <Subtitle ref={subtitleRef}>Crypto gastronomy meets fast food</Subtitle>
        <StartButton to="/game" ref={buttonRef}>Start Trading</StartButton>
      </Content>
    </LandingWrapper>
  );
};

export default Main;