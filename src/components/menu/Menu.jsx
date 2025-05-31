import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import soda from '../../assets/soda-art.png';
import pumpBurger from '../../assets/PumpBurger-art.png';
import hotDog from '../../assets/hot-dog-art.png';
import fomoFries from '../../assets/FOMO Fries-art.png';
import chocolate from "../../assets/chocolate.png";
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

const ItemStatus = styled.div`
  color: ${props => props.status === 'accepted' ? '#14F195' : '#FF6B6B'};
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  font-weight: bold;
`;

const ItemTime = styled.div`
  color: #aaa;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const ItemPrice = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
`;

const PriceAmount = styled.span`
  font-size: 1.3rem;
  font-weight: bold;
  color: #14F195;
`;

const ActionButton = styled.button`
  background: ${props => props.accepted ? 'linear-gradient(90deg, #14F195, #00cc88)' : 'linear-gradient(90deg, #9945FF, #14F195)'};
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
    id: 1,
    name: "Sol-Burger",
    description: "Classic burger with Solana twist. Fresh ingredients and fast preparation.",
    price: "5 $SOL",
    image: pumpBurger,
    status: "pending",
    prepTime: "8-10 min"
  },
  {
    id: 2,
    name: "Crypto Fries",
    description: "Crispy golden fries with special seasoning. Always in high demand.",
    price: "3 $SOL",
    image: fomoFries,
    status: "pending",
    prepTime: "5-7 min"
  },
  {
    id: 3,
    name: "Blockchain Soda",
    description: "Refreshing drink with mint flavor. Perfect with any meal.",
    price: "2 $SOL",
    image: soda,
    status: "pending",
    prepTime: "2 min"
  },
  {
    id: 4,
    name: "Hot Doge",
    description: "Traditional hot dog with premium sausage. Inspired by crypto meme.",
    price: "4 $SOL",
    image: hotDog,
    status: "pending",
    prepTime: "6-8 min"
  },
  {
    id: 5,
    name: "Moon Chocolate",
    description: "Decadent chocolate dessert. To the moon and back in flavor.",
    price: "3 $SOL",
    image: chocolate,
    status: "pending",
    prepTime: "4-5 min"
  },
  {
    id: 6,
    name: "NFT Sundae",
    description: "Unique ice cream combination. One-of-a-kind taste experience.",
    price: "6 $SOL",
    image: chocolateCircle,
    status: "pending",
    prepTime: "7-9 min"
  }
];

const SolDonalds = () => {
  const wrapperRef = useRef(null);
  const particlesRef = useRef([]);
  const menuItemRefs = useRef([]);
  const navigate = useNavigate();
  const [orders, setOrders] = useState(menuItems);

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
      text: "Sol-Donalds Kitchen",
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

  // Handle order action - navigate to game with selected order
  const handleOrderAction = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      navigate('/game', { state: { order } });
    }
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
          <CafeSubtitle>Fast Food Orders Management System</CafeSubtitle>
        </Header>

        <MenuGrid>
          {orders.map((item, index) => (
            <MenuItem
              key={item.id}
              ref={el => menuItemRefs.current[index] = el}
              className="menu-item"
            >
              <ItemImage>
                <img src={item.image} alt={item.name} />
              </ItemImage>
              <ItemName>{item.name}</ItemName>
              <ItemDescription>{item.description}</ItemDescription>
              <ItemStatus status={item.status}>
                Status: {item.status === 'accepted' ? 'Accepted' : 'Pending'}
              </ItemStatus>
              <ItemTime>Prep time: {item.prepTime}</ItemTime>
              <ItemPrice>
                <PriceAmount>{item.price}</PriceAmount>
                <ActionButton
                  onClick={() => handleOrderAction(item.id)}
                >
                  Prepare Order
                </ActionButton>
              </ItemPrice>
            </MenuItem>
          ))}
        </MenuGrid>

        <Footer>
          © 2023 Sol-Donalds Kitchen | Powered by <SolanaLogo>SOLANA</SolanaLogo>
        </Footer>
      </CafeContent>
    </GothicCafeWrapper>
  );
};

export default SolDonalds;