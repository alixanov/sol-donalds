import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import soda from '../../assets/soda-art.png';
import pumpBurger from '../../assets/PumpBurger-art.png';
import hotDog from '../../assets/hot-dog-art.png';
import fomoFries from '../../assets/FOMO Fries-art.png';
import chocolate from "../../assets/chocolate.png";
import { useNavigate } from 'react-router-dom';

import chocolateCircle from "../../assets/chocolateCircle.png";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// Styled Components
const GothicCafeWrapper = styled.div`
  position: relative;
  min-height: 100vh;
  background: #0a0a0a;
  overflow: hidden;
  font-family: 'Cinzel Decorative', cursive;
  color: #e0e0e0;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 20% 30%, rgba(123, 31, 162, 0.15) 0%, transparent 30%),
      radial-gradient(circle at 80% 70%, rgba(31, 162, 123, 0.15) 0%, transparent 30%);
    z-index: 0;
  }
`;

const SolanaParticles = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
`;

const Particle = styled.div`
  position: absolute;
  background: ${props => props.color || '#00ffaa'};
  border-radius: 50%;
  opacity: 0.6;
  filter: blur(1px);
`;

const CafeContent = styled.div`
  position: relative;
  z-index: 2;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.header`
  text-align: center;
  padding: 3rem 0;
  position: relative;
`;

const CafeTitle = styled.h1`
  font-size: 4rem;
  margin: 0;
  background: linear-gradient(90deg, #9945FF, #14F195);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 0 10px rgba(153, 69, 255, 0.3);
  letter-spacing: 0.2rem;
  position: relative;
  display: inline-block;

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, #9945FF, #14F195);
    border-radius: 3px;
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const CafeSubtitle = styled.h2`
  font-size: 1.5rem;
  font-weight: normal;
  margin: 1rem 0 0;
  color: #aaa;
  font-style: italic;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
`;

const MenuItem = styled.div`
  background: rgba(20, 20, 20, 0.8);
  border: 1px solid #333;
  border-radius: 10px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(50px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
    border-color: #9945FF;

    &::before {
      opacity: 0.1;
    }
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, #9945FF, #14F195);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
  }
`;

const ItemImage = styled.div`
  width: 100%;
  height: 200px;
  background: #222;
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  border: 1px solid #444;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;

const ItemName = styled.h3`
  font-size: 1.5rem;
  margin: 0 0 0.5rem;
  color: #e0e0e0;
`;

const ItemDescription = styled.p`
  color: #aaa;
  margin: 0 0 1rem;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const ItemPrice = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1.5rem;
`;

const PriceAmount = styled.span`
  font-size: 1.3rem;
  font-weight: bold;
  color: #14F195;
`;

const BuyButton = styled.button`
  background: linear-gradient(90deg, #9945FF, #14F195);
  border: none;
  color: #000;
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Cinzel Decorative', cursive;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 15px rgba(153, 69, 255, 0.5);
  }
`;

const Footer = styled.footer`
  text-align: center;
  padding: 2rem 0;
  margin-top: 3rem;
  border-top: 1px solid #333;
  color: #666;
  font-size: 0.9rem;
`;

const SolanaLogo = styled.div`
  display: inline-block;
  margin-left: 0.5rem;
  font-weight: bold;
  background: linear-gradient(90deg, #9945FF, #14F195);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

// Menu data with your imported images
const menuItems = [
  {
    name: "PumpBurger",
    description: "Juicy Solana-themed burger that pumps your hunger away. Comes with rare NFT collectible.",
    price: "5 $BURGER",
    image: pumpBurger
  },
  {
    name: "FOMO Fries",
    description: "Crispy golden fries that you'll fear missing out on. Limited time only!",
    price: "3 $BURGER",
    image: fomoFries
  },
  {
    name: "Slippage Soda",
    description: "Refreshing drink that's never the same size twice. Just like your token balances!",
    price: "2 $BURGER",
    image: soda
  },
  {
    name: "Rug Nuggets",
    description: "Tender chicken nuggets that might disappear when you least expect it.",
    price: "4 $BURGER",
    image: hotDog
  },
  {
    name: "Moon Chocolate",
    description: "Decadent chocolate that takes you to the moon and back. Diamond hands recommended.",
    price: "3 $BURGER",
    image: chocolate
  },
  {
    name: "Whale Circle",
    description: "Exclusive dessert for the big players. Moves markets with every bite.",
    price: "6 $BURGER",
    image: chocolateCircle
  }
];

const SolanaGothicCafe = () => {
  const wrapperRef = useRef(null);
  const particlesRef = useRef([]);
  const menuItemRefs = useRef([]);
  const navigate = useNavigate();


  // Create particles
  useEffect(() => {
    const particles = [];
    const colors = ['#9945FF', '#14F195', '#00ffaa', '#ff00ff', '#ffff00'];

    for (let i = 0; i < 50; i++) {
      particles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 5 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        duration: Math.random() * 10 + 5,
        delay: Math.random() * 5
      });
    }

    particlesRef.current = particles;
  }, []);

  // GSAP Animations
  useEffect(() => {
    // Background animation
    gsap.to(wrapperRef.current, {
      backgroundPosition: '50% 100%',
      scrollTrigger: {
        trigger: wrapperRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true
      }
    });

    // Particle animations
    particlesRef.current.forEach(particle => {
      gsap.to(`.particle-${particle.id}`, {
        x: `${Math.random() * 100 - 50}%`,
        y: `${Math.random() * 100 - 50}%`,
        duration: particle.duration,
        delay: particle.delay,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      });
    });

    // Menu item animations
    menuItemRefs.current.forEach((item, index) => {
      gsap.to(item, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: index * 0.1,
        ease: 'back.out'
      });
    });

    // Text animation for title
    gsap.to(".cafe-title", {
      duration: 2,
      text: "Solana Gothic Cafe",
      ease: 'none'
    });

    // Floating animation
    gsap.to(".cafe-title", {
      y: -10,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    // Glow effect
    gsap.to(".cafe-title", {
      textShadow: "0 0 20px #9945FF",
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  }, []);



  // Handle buy button click - navigate to game
  const handleBuyClick = (item) => {
    // Animation before navigation
    gsap.to(".menu-item", {
      opacity: 0,
      y: 50,
      duration: 0.5,
      stagger: 0.1,
      onComplete: () => navigate('/game', { state: { purchasedItem: item } })
    });
  };

  return (
    <GothicCafeWrapper ref={wrapperRef}>
      <SolanaParticles>
        {particlesRef.current.map(particle => (
          <Particle
            key={particle.id}
            className={`particle-${particle.id}`}
            color={particle.color}
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.x}%`,
              top: `${particle.y}%`
            }}
          />
        ))}
      </SolanaParticles>

      <CafeContent>
        <Header>
          <CafeTitle className="cafe-title"></CafeTitle>
          <CafeSubtitle>Where Gothic Aesthetics Meet Solana Fast Food</CafeSubtitle>
        </Header>

        <MenuGrid>
          {menuItems.map((item, index) => (
            <MenuItem
              key={item.name}
              ref={el => menuItemRefs.current[index] = el}
              className="menu-item"
            >
              <ItemImage>
                <img src={item.image} alt={item.name} />
              </ItemImage>
              <ItemName>{item.name}</ItemName>
              <ItemDescription>{item.description}</ItemDescription>
              <ItemPrice>
                <PriceAmount>{item.price}</PriceAmount>
                <BuyButton onClick={() => handleBuyClick(item)}>
                  Buy with SOL
                </BuyButton>
              </ItemPrice>
            </MenuItem>
          ))}
        </MenuGrid>

        <Footer>
          © 2023 Solana Gothic Cafe | Powered by <SolanaLogo>SOLANA</SolanaLogo>
        </Footer>
      </CafeContent>
    </GothicCafeWrapper>
  );
};

export default SolanaGothicCafe;