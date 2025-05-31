import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import gsap from 'gsap';
import { ScrollTrigger, TextPlugin } from 'gsap/all';
import { Lock as LockIcon } from '@mui/icons-material';
import soda from '../../assets/soda-art.png';
import pumpBurger from '../../assets/PumpBurger-art.png';
import hotDog from '../../assets/hot-dog-art.png';
import fomoFries from '../../assets/FOMO Fries-art.png';
import chocolate from '../../assets/chocolate.png';
import solanaBurgerImage from '../../assets/solanaBurgerImage.png';
import chocolateCircle from '../../assets/chocolateCircle.png';

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
  background: linear-gradient(90deg, #9945ff, #14f195);
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
    background: linear-gradient(90deg, #9945ff, #14f195);
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

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin: 1.5rem 0;
  }
`;

const MenuItem = styled.div`
  background: rgba(20, 20, 20, ${props => (props.locked ? '0.5' : '0.8')});
  border: 1px solid ${props => (props.locked ? '#555' : '#333')};
  border-radius: 10px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  opacity: 1; /* Изменено с 0 на 1 для немедленного отображения */
  transform: translateY(0); /* Изменено для немедленного отображения */
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

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const ItemDescription = styled.p`
  color: #aaa;
  margin: 0 0 1rem;
  font-size: 0.9rem;
  line-height: 1.4;

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

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const ItemTime = styled.div`
  color: #aaa;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;

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
  font-family: 'Cinzel Decorative', cursive;
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
  color: #666;
  font-size: 0.9rem;

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
`;

// Menu data
const menuItems = [
  {
    id: 1,
    name: 'Sol-Burger',
    description: 'Classic burger with Solana twist. Fresh ingredients and fast preparation.',
    price: '5 $SOL',
    image: pumpBurger,
    status: 'pending',
    prepTime: '8-10 min',
  },
  {
    id: 2,
    name: 'Crypto Fries',
    description: 'Crispy golden fries with special seasoning. Always in high demand.',
    price: '3 $SOL',
    image: fomoFries,
    status: 'pending',
    prepTime: '5-7 min',
  },
  {
    id: 3,
    name: 'Blockchain Soda',
    description: 'Refreshing drink with mint flavor. Perfect with any meal.',
    price: '2 $SOL',
    image: soda,
    status: 'pending',
    prepTime: '2 min',
  },
  {
    id: 4,
    name: 'Hot Doge',
    description: 'Traditional hot dog with premium sausage. Inspired by crypto meme.',
    price: '4 $SOL',
    image: hotDog,
    status: 'pending',
    prepTime: '6-8 min',
  },
  {
    id: 5,
    name: 'Moon Chocolate',
    description: 'Decadent chocolate dessert. To the moon and back in flavor.',
    price: '3 $SOL',
    image: chocolate,
    status: 'pending',
    prepTime: '4-5 min',
  },
  {
    id: 7,
    name: 'Solana Burger Deluxe',
    description: 'Premium burger infused with Solana energy. A futuristic taste adventure.',
    price: '11 $SOL',
    image: solanaBurgerImage,
    status: 'pending',
    prepTime: '10-12 min',
  },
  {
    id: 8,
    name: 'Blockchain Fries',
    description: 'Crispy golden fries with a touch of Solana-powered flavor. A next-gen snack.',
    price: '5 $SOL',
    image: chocolateCircle,
    status: 'pending',
    prepTime: '6-8 min',
  },
];

const SolDonalds = () => {
  const wrapperRef = useRef(null);
  const particlesRef = useRef([]);
  const menuItemRefs = useRef([]);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  // Initialize orders with random locked status
  useEffect(() => {
    // Randomly select 0-2 orders to lock
    const numLocked = Math.floor(Math.random() * 3); // 0, 1, or 2
    const shuffledIds = [...menuItems].sort(() => Math.random() - 0.5).map(item => item.id);
    const lockedIds = shuffledIds.slice(0, numLocked);

    const initialOrders = menuItems.map(item => ({
      ...item,
      status: lockedIds.includes(item.id) ? 'locked' : 'pending',
    }));

    setOrders(initialOrders);
  }, []);

  // Create particles
  useEffect(() => {
    const particles = [];
    const colors = ['#9945ff', '#14f195', '#00ffaa', '#ff00ff', '#ffff00'];

    for (let i = 0; i < 50; i++) {
      particles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 5 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        duration: Math.random() * 10 + 5,
        delay: Math.random() * 5,
      });
    }

    particlesRef.current = particles;
  }, []);

  // GSAP Animations
  useEffect(() => {
    // Проверяем, что элементы существуют перед анимацией
    if (wrapperRef.current) {
      gsap.to(wrapperRef.current, {
        backgroundPosition: '50% 100%',
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
      });
    }

    // Анимация частиц
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

    // Анимация для заголовка
    const titleElement = document.querySelector('.cafe-title');
    if (titleElement) {
      // Устанавливаем начальный текст
      titleElement.textContent = 'Sol-Donalds Kitchen';
      
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

    // Анимация карточек меню - с задержкой для появления
    const validMenuItems = menuItemRefs.current.filter(item => item !== null);
    if (validMenuItems.length > 0) {
      // Сначала скрываем все элементы
      gsap.set(validMenuItems, { opacity: 0, y: 50 });
      
      // Затем показываем их с анимацией
      validMenuItems.forEach((item, index) => {
        gsap.to(item, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: index * 0.1,
          ease: 'back.out',
        });
      });
    }
  }, [orders]); // Добавляем orders в зависимости для перезапуска анимации

  // Handle order action
  const handleOrderAction = orderId => {
    const order = orders.find(o => o.id === orderId);
    if (order && order.status !== 'locked') {
      setOrders(prev =>
        prev.map(o =>
          o.id === orderId ? { ...o, status: 'accepted' } : o,
        ),
      );
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

        <MenuGrid>
          {orders.map((item, index) => (
            <MenuItem
              key={item.id}
              ref={el => {
                if (el) menuItemRefs.current[index] = el;
              }}
              className="menu-item"
              locked={item.status === 'locked'}
            >
              <ItemImage>
                <img src={item.image} alt={item.name} />
              </ItemImage>
              <ItemName>{item.name}</ItemName>
              <ItemDescription>{item.description}</ItemDescription>
              <ItemStatus status={item.status}>
                {item.status === 'locked' && <LockIcon sx={{ fontSize: 16 }} />}
                Status: {item.status === 'accepted' ? 'Accepted' : item.status === 'locked' ? 'Locked by Another Chef' : 'Pending'}
              </ItemStatus>
              <ItemTime>Prep time: {item.prepTime}</ItemTime>
              <ItemPrice>
                <PriceAmount>{item.price}</PriceAmount>
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
          ))}
        </MenuGrid>

        <Footer>
          © 2025 Sol-Donalds Kitchen | Powered by <SolanaLogo>SOLANA</SolanaLogo>
        </Footer>
      </CafeContent>
    </GothicCafeWrapper>
  );
};

export default SolDonalds;