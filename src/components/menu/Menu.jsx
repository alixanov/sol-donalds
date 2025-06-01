import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import gsap from 'gsap';
import { ScrollTrigger, TextPlugin } from 'gsap/all';
import { Lock as LockIcon } from '@mui/icons-material';
import caffeBg from '../../assets/bg.jpeg';
import soda from '../../assets/soda-art.png';
import pumpBurger from '../../assets/PumpBurger-art.png';
import hotDog from '../../assets/hot-dog-art.png';
import fomoFries from '../../assets/FOMO Fries-art.png';
import chocolate from '../../assets/chocolate.png';
import solanaBurgerImage from '../../assets/solanaBurgerImage.png';
import chocolateCircle from '../../assets/chocolateCircle.png';
import mobileBg from "../../assets/mobileBg.png"

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// Styled Components
const GothicCafeWrapper = styled.div`
  @import url('https://fonts.googleapis.com/css2?family=Tektur:wght@400..900&display=swap');
  position: relative;
  min-height: 100vh;
  background-image: url(${caffeBg});
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  background-repeat: no-repeat;
  overflow: hidden;
  font-family: "Tektur", sans-serif;
  color: #e0e0e0;
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

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.header`
  text-align: center;
  padding: 3rem 0;
  position: relative;

  @media (max-width: 768px) {
    padding: 1.5rem 0;
  }
`;

const CafeTitle = styled.h1`
  font-size: 4rem;
  margin: 0;
  background: linear-gradient(90deg,rgb(194, 145, 255),rgb(167, 255, 218));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 0 10px rgba(153, 69, 255, 0.3);
  letter-spacing: 0.2rem;
  position: relative;
  display: inline-block;
  font-family: "Tektur", sans-serif;

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, #9945ff,rgb(109, 255, 194));
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
  color:rgb(215, 182, 255);
  font-style: italic;
  font-family: "Tektur", sans-serif;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
  opacity: 0;
  transition: opacity 0.5s ease;

  &.loaded {
    opacity: 1;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin: 1.5rem 0;
  }
`;

const LoadingPlaceholder = styled.div`
  text-align: center;
  padding: 2rem;
  color: #aaa;
  font-size: 1rem;
  font-family: "Tektur", sans-serif;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const MenuItem = styled.div`
  background: rgba(25, 35, 45, ${props => (props.locked ? '0.5' : '0.8')});
  border: 1px solid ${props => (props.locked ? '#555' : '#333')};
  border-radius: 10px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;

  ${props => props.locked && `
    pointer-events: none;
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.4);
      z-index: 1;
    }
  `}

  &:hover {
    ${props => !props.locked && `
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
      border-color: #9945ff;

      &::before {
        opacity: 0.1;
      }
    `}
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, #9945ff, #14f195);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
  }

  @media (max-width: 768px) {
    padding: 1rem;
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

  @media (max-width: 768px) {
    height: 150px;
  }
`;

const ItemName = styled.h3`
  font-size: 1.5rem;
  margin: 0 0 0.5rem;
  color: #e0e0e0;
  font-family: "Tektur", sans-serif;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const ItemDescription = styled.p`
  color: #aaa;
  margin: 0 0 1rem;
  font-size: 0.9rem;
  line-height: 1.4;
  font-family: "Tektur", sans-serif;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const ItemStatus = styled.div`
  color: ${props => props.status === 'accepted' ? '#14f195' : props.status === 'locked' ? '#ff5555' : '#ff6b6b'};
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: "Tektur", sans-serif;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const ItemTime = styled.div`
  color: #aaa;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  font-family: "Tektur", sans-serif;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const ItemPrice = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
`;

const PriceAmount = styled.span`
  font-size: 1.3rem;
  font-weight: bold;
  color: #14f195;
  font-family: "Tektur", sans-serif;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const ActionButton = styled.button`
  background: ${props => props.locked ? 'linear-gradient(90deg, #555, #333)' : props.accepted ? 'linear-gradient(90deg, #14f195, #00cc88)' : 'linear-gradient(90deg, #9945ff, #14f195)'};
  border: none;
  color: ${props => props.locked ? '#888' : '#000'};
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  font-weight: bold;
  cursor: ${props => props.locked ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  font-family: "Tektur", sans-serif;
  min-height: 48px;

  &:hover {
    ${props => !props.locked && `
      transform: scale(1.05);
      box-shadow: 0 0 15px rgba(153, 69, 255, 0.5);
    `}
  }

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    width: 100%;
    text-align: center;
  }
`;

const Footer = styled.footer`
  text-align: center;
  padding: 2rem 0;
  margin-top: 3rem;
  border-top: 1px solid #333;
  color:rgb(220, 192, 255);
  font-size: 0.9rem;
  font-family: "Tektur", sans-serif;

  @media (max-width: 768px) {
    padding: 1rem 0;
    font-size: 0.8rem;
  }
`;

const SolanaLogo = styled.div`
  display: inline-block;
  margin-left: 0.5rem;
  font-weight: bold;
  background: linear-gradient(90deg, #9945ff, #14f195);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-family: "Tektur", sans-serif;
`;

// Menu data with ingredients
const menuItems = [
  {
    id: 1,
    name: 'Sol-Burger',
    description: 'Classic burger with Solana twist. Fresh ingredients and fast preparation.',
    price: '5 $SOL',
    image: pumpBurger,
    status: 'pending',
    prepTime: '8-10 min',
    ingredients: ['bun-bottom', 'patty', 'cheese', 'lettuce', 'bun-top'],
  },
  {
    id: 2,
    name: 'Crypto Fries',
    description: 'Crispy golden fries with special seasoning. Always in high demand.',
    price: '3 $SOL',
    image: fomoFries,
    status: 'pending',
    prepTime: '5-7 min',
    ingredients: ['fries', 'salt', 'ketchup'],
  },
  {
    id: 3,
    name: 'Blockchain Soda',
    description: 'Refreshing drink with mint flavor. Perfect with any meal.',
    price: '2 $SOL',
    image: soda,
    status: 'pending',
    prepTime: '2 min',
    ingredients: ['cup', 'ice', 'soda'],
  },
  {
    id: 4,
    name: 'Hot Doge',
    description: 'Traditional hot dog with premium sausage. Inspired by crypto meme.',
    price: '4 $SOL',
    image: hotDog,
    status: 'pending',
    prepTime: '6-8 min',
    ingredients: ['bun', 'sausage', 'ketchup', 'mustard'],
  },
  {
    id: 5,
    name: 'Moon Chocolate',
    description: 'Decadent chocolate dessert. To the moon and back in flavor.',
    price: '3 $SOL',
    image: chocolate,
    status: 'pending',
    prepTime: '4-5 min',
    ingredients: ['chocolate', 'wrapper'],
  },
  {
    id: 7,
    name: 'Solana Burger Deluxe',
    description: 'Premium burger infused with Solana energy. A futuristic taste adventure.',
    price: '11 $SOL',
    image: solanaBurgerImage,
    status: 'pending',
    prepTime: '10-12 min',
    ingredients: ['bull-bun', 'bear-meat', 'nft-sauce', 'cheese', 'lettuce'],
  },
  {
    id: 8,
    name: 'Blockchain Fries',
    description: 'Crispy golden fries with a touch of Solana-powered flavor.',
    price: '5 $SOL',
    image: chocolateCircle,
    status: 'pending',
    prepTime: '6-8 min',
    ingredients: ['fries', 'salt', 'nft-sauce'],
  },
];

// Initialize orders with random locked status
const initializeOrders = () => {
  const numLocked = Math.floor(Math.random() * 3); // 0, 1, or 2
  const shuffledIds = [...menuItems].sort(() => Math.random() - 0.5).map(item => item.id);
  const lockedIds = shuffledIds.slice(0, numLocked);

  return menuItems.map(item => ({
    ...item,
    status: lockedIds.includes(item.id) ? 'locked' : 'pending',
  }));
};

const SolDonalds = () => {
  const wrapperRef = useRef(null);
  const menuItemRefs = useRef([]);
  const particlesRef = useRef([]);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize orders
  useEffect(() => {
    try {
      const initialOrders = initializeOrders();
      setOrders(initialOrders);
      setIsLoaded(true);
    } catch (error) {
      console.error('Error initializing orders:', error);
      setOrders([]);
      setIsLoaded(true);
    }
  }, []);

  // Create particles
  useEffect(() => {
    const particles = [];
    const colors = ['#9945ff', '#14f195', '#00ffaa', '#ff00ff'];

    for (let i = 0; i < 50; i++) {
      particles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 5 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        duration: Math.random() * 10 + 5,
        delay: Math.random() * 5,
      });
    }

    particlesRef.current = particles;

    return () => {
      particlesRef.current = [];
    };
  }, []);

  // GSAP Animations
  useEffect(() => {
    if (!isLoaded) return;

    // Animate particles
    if (Array.isArray(particlesRef.current)) {
      particlesRef.current.forEach(particle => {
        const particleElement = document.querySelector(`.particle-${particle.id}`);
        if (particleElement) {
          gsap.to(particleElement, {
            x: `${Math.random() * 100 - 50}%`,
            y: `${Math.random() * 100 - 50}%`,
            duration: particle.duration,
            delay: particle.delay,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          });
        }
      });
    }

    // Animate title
    const titleElement = document.querySelector('.cafe-title');
    if (titleElement) {
      gsap.to(titleElement, {
        y: -10,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to(titleElement, {
        textShadow: '0 0 20px #9945ff',
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }

    // Animate menu items
    if (menuItemRefs.current && Array.isArray(menuItemRefs.current)) {
      const validMenuItems = menuItemRefs.current.filter(item => item !== null && item !== undefined);
      if (validMenuItems.length > 0) {
        gsap.fromTo(
          validMenuItems,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'back.out(1.7)',
          }
        );
      }
    }
  }, [isLoaded]);

  // Handle order action
  const handleOrderAction = (orderId) => {
    try {
      if (!Array.isArray(orders)) {
        console.error('Orders is not an array:', orders);
        return;
      }

      const order = orders.find(o => o && o.id === orderId);
      if (order && order.status !== 'locked') {
        setOrders(prev => {
          if (!Array.isArray(prev)) return [];
          return prev.map(o =>
            o && o.id === orderId ? { ...o, status: 'accepted' } : o,
          );
        });
        navigate('/game', { state: { order } });
      }
    } catch (error) {
      console.error('Error handling order action:', error);
    }
  };

  // Safe orders array
  const safeOrders = Array.isArray(orders) ? orders : [];

  return (
    <GothicCafeWrapper ref={wrapperRef}>
      <SolanaParticles>
        {Array.isArray(particlesRef.current) && particlesRef.current.map(particle => (
          <Particle
            key={particle.id}
            className={`particle-${particle.id}`}
            color={particle.color}
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
          />
        ))}
      </SolanaParticles>

      <CafeContent>
        <Header>
          <CafeTitle className="cafe-title">Sol-Donalds Kitchen</CafeTitle>
          <CafeSubtitle>Fast Food Orders Management System</CafeSubtitle>
        </Header>

        {!isLoaded ? (
          <LoadingPlaceholder aria-busy="true">
            Loading menu...
          </LoadingPlaceholder>
        ) : safeOrders.length === 0 ? (
          <LoadingPlaceholder>
            No orders available at the moment.
          </LoadingPlaceholder>
        ) : (
          <MenuGrid className={isLoaded ? 'loaded' : ''}>
            {safeOrders.map((item, index) => {
              if (!item || !item.id) return null;

              return (
                <MenuItem
                  key={item.id}
                  ref={el => {
                    if (menuItemRefs.current && Array.isArray(menuItemRefs.current)) {
                      menuItemRefs.current[index] = el;
                    }
                  }}
                  className="menu-item"
                  locked={item.status === 'locked'}
                >
                  <ItemImage>
                    <img src={item.image} alt={item.name || 'Menu item'} />
                  </ItemImage>
                  <ItemName>{item.name || 'Unknown Item'}</ItemName>
                  <ItemDescription>{item.description || 'No description available'}</ItemDescription>
                  <ItemStatus status={item.status}>
                    {item.status === 'locked' && <LockIcon sx={{ fontSize: 16 }} />}
                    Status: {item.status === 'accepted' ? 'Accepted' : item.status === 'locked' ? 'Locked by Another Chef' : 'Pending'}
                  </ItemStatus>
                  <ItemTime>Prep time: {item.prepTime || 'Unknown'}</ItemTime>
                  <ItemPrice>
                    <PriceAmount>{item.price || '0 $SOL'}</PriceAmount>
                    <ActionButton
                      onClick={() => handleOrderAction(item.id)}
                      locked={item.status === 'locked'}
                      accepted={item.status === 'accepted'}
                      disabled={item.status === 'locked'}
                      aria-label={item.status === 'locked' ? 'Order locked by another chef' : `Prepare ${item.name}`}
                    >
                      {item.status === 'locked' ? 'Locked' : 'Prepare Order'}
                    </ActionButton>
                  </ItemPrice>
                </MenuItem>
              );
            })}
          </MenuGrid>
        )}

        <Footer>
          © 2025 Sol-Donalds Kitchen | Powered by <SolanaLogo>SOLANA</SolanaLogo>
        </Footer>
      </CafeContent>
    </GothicCafeWrapper>
  );
};

export default SolDonalds;