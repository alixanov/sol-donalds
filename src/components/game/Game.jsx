import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import gsap from 'gsap';
import {
  RestaurantMenu as RestaurantMenuIcon,
  Timer as TimerIcon,
  Fastfood as FastfoodIcon,
  Replay as ReplayIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Chat as ChatIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import Confetti from 'react-confetti';
import uspex from '../../sound/успех.mp3';
import polojitelniy from '../../sound/положителный.mp3';
import otrisatelney from '../../sound/отрицателный.mp3';
import pobeda from '../../sound/победа.mp3';
import porajeniya from '../../sound/поражения.mp3';
import bunBottom from "../../assets/bun-bottom.png";
import bearMeat from "../../assets/bear-meat.png";
import bullBun from "../../assets/bul-bunn.png";
import bunTop from "../../assets/bun-top.png";
import bun from "../../assets/bun.png";
import cheese from "../../assets/cheese.png";
import chocolate from "../../assets/chocolate.png";
import fries from "../../assets/fries.png";
import cup from "../../assets/cup.png";
import ice from "../../assets/ice.png";
import ketchup from "../../assets/ketchup.png";
import lettuce from "../../assets/lettuce.png";
import mustard from "../../assets/mustard.png";
import patty from "../../assets/patty.png";
import salt from "../../assets/salt.png";
import sauce from "../../assets/nft-sauce.png";
import wrapper from "../../assets/wrapper.png";

// Game constants
const GAME_DURATION = 120; // 2 minutes
const ORDER_PREP_TIME = 30; // 30 seconds per order
const MAX_ORDERS = 5;
const SCORE_PER_ORDER = 100;
const PENALTY_PER_MISTAKE = 20;
const ORDER_GENERATION_INTERVAL_MIN = 4000; // 4 seconds
const ORDER_GENERATION_INTERVAL_MAX = 8000; // 8 seconds

// Sound effects
const sounds = {
  success: new Audio(uspex),
  select: new Audio(polojitelniy),
  complete: new Audio(pobeda),
  error: new Audio(otrisatelney),
  defeat: new Audio(porajeniya),
};

const playSound = type => {
  try {
    const sound = sounds[type];
    if (sound) {
      Object.values(sounds).forEach(s => {
        if (s !== sound) {
          s.pause();
          s.currentTime = 0;
        }
      });
      sound.currentTime = 0;
      sound.volume = 0.5;
      sound.play().catch(err => console.error(`Failed to play sound ${type}:`, err));
    }
  } catch (err) {
    console.error(`Error playing sound ${type}:`, err);
  }
};

// All possible ingredients
const allIngredients = [
  'bun-bottom', 'patty', 'cheese', 'lettuce', 'bun-top',
  'fries', 'salt', 'ketchup',
  'cup', 'ice', 'soda',
  'bun', 'sausage', 'mustard',
  'chocolate', 'wrapper',
  'bull-bun', 'bear-meat', 'nft-sauce',
];

// Image mapping for ingredients
const ingredientImages = {
  'bun-bottom': bunBottom,
  'patty': patty,
  'cheese': cheese,
  'lettuce': lettuce,
  'bun-top': bunTop,
  'fries': fries,
  'salt': salt,
  'ketchup': ketchup,
  'cup': cup,
  'ice': ice,
  'soda': null,
  'bun': bun,
  'sausage': null,
  'mustard': mustard,
  'chocolate': chocolate,
  'wrapper': wrapper,
  'bull-bun': bullBun,
  'bear-meat': bearMeat,
  'nft-sauce': sauce,
};

// Recipe definitions
const recipes = {
  'Sol-Burger': ['bun-bottom', 'patty', 'cheese', 'lettuce', 'bun-top'],
  'Crypto Fries': ['fries', 'salt', 'ketchup'],
  'Blockchain Soda': ['cup', 'ice', 'soda'],
  'Hot Doge': ['bun', 'sausage', 'ketchup', 'mustard'],
  'Moon Chocolate': ['chocolate', 'wrapper'],
  'Solana Burger Deluxe': ['bull-bun', 'bear-meat', 'nft-sauce', 'cheese', 'lettuce'],
  'Blockchain Fries': ['fries', 'salt', 'nft-sauce'],
};

// Generate dynamic customer
const generateCustomer = (orderName) => {
  const names = [
    'Alex', 'Maria', 'John', 'Emma', 'Liam', 'Sophia', 'Noah', 'Olivia',
    'James', 'Ava', 'William', 'Isabella', 'Michael', 'Charlotte', 'Daniel',
    'Amelia', 'Henry', 'Harper', 'Ethan', 'Evelyn'
  ];
  const avatars = [
    '😊', '😎', '👩‍🦰', '👨‍🦱', '👩‍🦳', '👨‍🦲', '🧑‍🦱', '👧',
    '👦', '👩', '👨', '🧑', '👵', '👴', '🧒'
  ];
  const messageVariations = [
    `Can you make my ${orderName} quick?`,
    `I'd like a ${orderName}, please!`,
    `Extra sauce on my ${orderName}, thanks!`,
    `No rush, but I need a ${orderName}.`,
    `Make sure my ${orderName} is fresh!`
  ];
  return {
    id: Date.now() + Math.random(),
    name: names[Math.floor(Math.random() * names.length)],
    avatar: avatars[Math.floor(Math.random() * avatars.length)],
    message: messageVariations[Math.floor(Math.random() * messageVariations.length)],
  };
};

// Styled components
const GameWrapper = styled.div`
  @import url('https://fonts.googleapis.com/css2?family=Tektur:wght@400..900&display=swap');
  position: relative;
  width: 100%;
  height: 100vh;
  background: rgba(23, 56, 30, 0.5);
  color: #fff;
  overflow: hidden;
  touch-action: manipulation;
  font-family: 'Tektur', sans-serif;
`;

const GameHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #1a1a1a;
  border-bottom: 1px solid #333;
  
  @media (max-width: 768px) {
    padding: 0.5rem;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
`;

const GameTitle = styled.h1`
  margin: 0;
  font-family: 'Tektur', sans-serif;
  font-weight: 700;
  font-size: 1.5rem;
  color: #FFC107;
  letter-spacing: 0.05em;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const GameStats = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  
  @media (max-width: 768px) {
    gap: 0.5rem;
    flex-wrap: wrap;
  }
`;

const HomeButton = styled.button`
  background: #FFC107;
  color: #000;
  border: none;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Tektur', sans-serif;
  font-weight: 700;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  transition: all 0.2s ease;
  
  &:hover, &:active {
    background: #FFA000;
    transform: scale(1.05);
  }
  
  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-family: 'Tektur', sans-serif;
  font-weight: 500;
  font-size: 0.9rem;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const MobileMenuToggle = styled.button`
  display: none;
  background: #FFC107;
  color: #000;
  border: none;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Tektur', sans-serif;
  font-weight: 500;
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const GameContent = styled.div`
  display: flex;
  height: calc(100vh - 80px);
  
  @media (max-width: 768px) {
    flex-direction: column;
    height: calc(100vh - 100px);
  }
`;

const OrdersColumn = styled.div`
  width: 300px;
  padding: 1rem;
  background: #1a1a1a;
  border-right: 1px solid #333;
  overflow-y: auto;
  transition: transform 0.3s ease;
  
  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 20;
    transform: ${props => props.mobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)'};
    border-right: none;
    background: rgba(0, 0, 0, 0.95);
  }
`;

const MobileOrdersHeader = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid #333;
    
    h3 {
      margin: 0;
      font-family: 'Tektur', sans-serif;
      font-weight: 700;
      color: #FFC107;
      letter-spacing: 0.05em;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    }
  }
`;

const OrderCard = styled.div`
  background: ${props => props.active ? '#2a2a2a' : '#1a1a1a'};
  border: 1px solid ${props => props.active ? '#FFC107' : '#333'};
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  cursor: ${props => props.completed || props.failed ? 'default' : 'pointer'};
  transition: all 0.3s ease;
  touch-action: manipulation;
  opacity: ${props => props.completed || props.failed ? 0.6 : 1};

  &:hover, &:active {
    ${props => !(props.completed || props.failed) && `
      border-color: #FFC107;
      transform: scale(1.02);
    `}
  }
  
  @media (max-width: 768px) {
    padding: 0.8rem;
  }
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const OrderTitle = styled.h3`
  margin: 0;
  font-family: 'Tektur', sans-serif;
  font-weight: 700;
  color: ${props => props.completed || props.failed ? '#FFC107' : '#fff'};
  text-decoration: ${props => props.completed || props.failed ? 'line-through' : 'none'};
  font-size: 1rem;
  letter-spacing: 0.05em;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const OrderTime = styled.div`
  font-family: 'Tektur', sans-serif;
  font-weight: 500;
  font-size: 0.8rem;
  color: ${props => props.warning ? 'rgba(255, 0, 0, 0.5)' : '#ccc'};
`;

const OrderIngredients = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-top: 0.5rem;
`;

const IngredientPill = styled.div`
  background: ${props => props.added ? '#FFC107' : props.required ? '#555' : '#333'};
  color: ${props => props.added ? '#000' : '#fff'};
  padding: 0.2rem 0.5rem;
  border-radius: 15px;
  font-family: 'Tektur', sans-serif;
  font-weight: 500;
  font-size: 0.7rem;
  border: ${props => props.added ? '2px solid #FFC107' : 'none'};
  
  @media (max-width: 768px) {
    font-size: 0.6rem;
    padding: 0.2rem 0.4rem;
  }
`;

const WorkArea = styled.div`
  flex: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    padding: 0.5rem;
    height: 100%;
  }
`;

const CurrentOrder = styled.div`
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  min-height: 120px;
  
  @media (max-width: 768px) {
    padding: 0.8rem;
    min-height: 100px;
  }
`;

const CustomerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    gap: 0.5rem;
    margin-bottom: 0.8rem;
  }
`;

const CustomerAvatar = styled.div`
  font-size: 2rem;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const CustomerMessage = styled.div`
  background: rgba(255, 0, 0, 0.5);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  flex: 1;
  font-family: 'Tektur', sans-serif;
  font-weight: 400;
  font-size: 0.9rem;
  
  @media (max-width: 768px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
`;

const OrderProgress = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
`;

const IngredientsArea = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  padding: 1.5rem;
  background: #1a1a1a;
  border-radius: 12px;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    gap: 0.8rem;
    padding: 1rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
    gap: 0.6rem;
    padding: 0.8rem;
  }
`;

const IngredientCard = styled.div`
  width: 120px;
  height: 120px;
  background: #1a1a1a;
  border: 3px solid #c0c0c0;
  border-radius: 8px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  touch-action: manipulation;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  font-family: 'Tektur', sans-serif;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 193, 7, 0.2);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover, &:active {
    transform: scale(1.05);
    border-color: #FFC107;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.6);
    &::before {
      opacity: 1;
    }
  }
  
  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
    padding: 0.4rem;
    border-width: 2px;
    border-radius: 6px;
  }
  
  @media (max-width: 480px) {
    width: 70px;
    height: 70px;
    padding: 0.3rem;
    border-radius: 5px;
  }
`;

const IngredientIcon = styled.div`
  margin-bottom: 0.3rem;
  transition: transform 0.3s ease;
  
  img {
    width: 36px;
    height: 36px;
    object-fit: contain;
  }
  
  span {
    font-size: 1.8rem;
  }
  
  ${IngredientCard}:hover & {
    transform: scale(1.1);
  }
  
  @media (max-width: 768px) {
    margin-bottom: 0.2rem;
    img {
      width: 32px;
      height: 32px;
    }
    span {
      font-size: 1.6rem;
    }
  }
  
  @media (max-width: 480px) {
    margin-bottom: 0.1rem;
    img {
      width: 28px;
      height: 28px;
    }
    span {
      font-size: 1.4rem;
    }
  }
`;

const IngredientName = styled.div`
  font-family: 'Tektur', sans-serif;
  font-weight: 400;
  font-size: 0.7rem;
  text-align: center;
  line-height: 1.1;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
  
  @media (max-width: 768px) {
    font-size: 0.65rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.6rem;
  }
`;

const GameControls = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background: #1a1a1a;
  border-top: 1px solid #333;
  
  @media (max-width: 768px) {
    padding: 0.5rem;
    gap: 0.5rem;
  }
`;

const ControlButton = styled.button`
  background: ${props => props.primary ? '#FFC107' : '#333'};
  color: ${props => props.primary ? '#000' : '#fff'};
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  touch-action: manipulation;
  font-family: 'Tektur', sans-serif;
  font-weight: 500;
  font-size: 0.9rem;

  &:hover, &:active {
    background: ${props => props.primary ? '#FFA000' : '#444'};
    transform: scale(1.05);
  }
  
  @media (max-width: 768px) {
    padding: 0.5rem 0.8rem;
    font-size: 0.8rem;
    gap: 0.3rem;
  }
`;

const GameOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 30;
  text-align: center;
  
  @media (max-width: 768px) {
    justify-content: flex-end;
    padding-bottom: 2rem;
  }
`;

const GameOverTitle = styled.h2`
  font-family: 'Tektur', sans-serif;
  font-weight: 700;
  font-size: 2.5rem;
  color: #FFC107;
  margin-bottom: 0.8rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  letter-spacing: 0.05em;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const NotificationContainer = styled.div`
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 40;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    top: 0.5rem;
    right: 0.5rem;
  }
`;

const Notification = styled.div`
  background: ${props => props.error ? '#d32f2f' : '#FFC107'};
  color: #fff;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.6);
  max-width: 300px;
  opacity: 0;
  transform: translateY(-20px);
  font-family: 'Tektur', sans-serif;
  font-weight: 400;
  font-size: 0.9rem;
  
  h4 {
    font-family: 'Tektur', sans-serif;
    font-weight: 700;
    font-size: 1rem;
    margin: 0;
    color: #fff;
    letter-spacing: 0.05em;
  }
  
  @media (max-width: 768px) {
    padding: 0.8rem;
    max-width: 250px;
    font-size: 0.8rem;
    
    h4 {
      font-size: 0.9rem;
    }
  }
  
  @media (max-width: 480px) {
    padding: 0.6rem;
    max-width: 200px;
    font-size: 0.7rem;
    
    h4 {
      font-size: 0.8rem;
    }
  }
`;

const NoOrdersMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: 2rem;
  
  h3 {
    font-family: 'Tektur', sans-serif;
    font-weight: 700;
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #FFC107;
    letter-spacing: 0.05em;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    
    @media (max-width: 768px) {
      font-size: 1.2rem;
    }
  }
  
  p {
    font-family: 'Tektur', sans-serif;
    font-weight: 400;
    font-size: 1rem;
    opacity: 0.8;
    
    @media (max-width: 768px) {
      font-size: 0.9rem;
    }
  }
`;

const WelcomeMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: 2rem;
  
  h3 {
    font-family: 'Tektur', sans-serif;
    font-weight: 700;
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #FFC107;
    letter-spacing: 0.05em;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    
    @media (max-width: 768px) {
      font-size: 1.2rem;
    }
  }
  
  p {
    font-family: 'Tektur', sans-serif;
    font-weight: 400;
    font-size: 1rem;
    opacity: 0.8;
    max-width: 600px;
    
    @media (max-width: 768px) {
      font-size: 0.9rem;
    }
  }
`;

const Game = () => {
  const navigate = useNavigate();
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const [orders, setOrders] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notificationRefs = useRef([]);
  const lastClickRef = useRef(0);

  // Initialize orders
  useEffect(() => {
    const initialOrders = Object.keys(recipes).slice(0, 3).map((name, index) => ({
      id: Date.now() + index,
      name,
      recipe: recipes[name],
      timeLeft: ORDER_PREP_TIME,
      completed: false,
      failed: false,
      ingredientsAdded: [],
      customer: generateCustomer(name),
    }));
    setOrders(initialOrders);
    playSound('select');
  }, []);

  // Game timer and order timer
  useEffect(() => {
    if (gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameOver(true);
          playSound('defeat');
          return 0;
        }
        return prev - 1;
      });

      setOrders(prevOrders => {
        const allCompleted = prevOrders.every(o => o.completed || o.failed) && prevOrders.length > 0;
        if (allCompleted) {
          setGameOver(true);
          playSound('complete');
          return prevOrders;
        }
        return prevOrders.map(order =>
          !order.completed && !order.failed
            ? { ...order, timeLeft: order.timeLeft - 1 }
            : order
        );
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameOver]);

  // Generate new orders
  useEffect(() => {
    if (gameOver) return;

    let orderTimeout;

    const generateOrder = () => {
      setOrders(prevOrders => {
        const activeOrders = prevOrders.filter(o => !o.completed && !o.failed);
        if (activeOrders.length < MAX_ORDERS) {
          const menuItems = Object.keys(recipes);
          const randomItem = menuItems[Math.floor(Math.random() * menuItems.length)];
          const newOrder = {
            id: Date.now(),
            name: randomItem,
            recipe: recipes[randomItem] || [],
            timeLeft: ORDER_PREP_TIME,
            completed: false,
            failed: false,
            ingredientsAdded: [],
            customer: generateCustomer(randomItem),
          };
          playSound('success');
          return [...prevOrders, newOrder];
        }
        return prevOrders;
      });

      clearTimeout(orderTimeout);
      const delay = Math.random() * (ORDER_GENERATION_INTERVAL_MAX - ORDER_GENERATION_INTERVAL_MIN) + ORDER_GENERATION_INTERVAL_MIN;
      orderTimeout = setTimeout(generateOrder, delay);
    };

    orderTimeout = setTimeout(generateOrder, Math.random() * (ORDER_GENERATION_INTERVAL_MAX - ORDER_GENERATION_INTERVAL_MIN) + ORDER_GENERATION_INTERVAL_MIN);

    return () => clearTimeout(orderTimeout);
  }, [gameOver]);

  // Check for expired orders
  useEffect(() => {
    const expiredOrders = orders.filter(order => order.timeLeft <= 0 && !order.completed && !order.failed);
    if (expiredOrders.length > 0) {
      expiredOrders.forEach(order => {
        playSound('defeat');
        addNotification(`Order ${order.name} expired!`);
      });
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.timeLeft <= 0 && !order.completed && !order.failed
            ? { ...order, failed: true }
            : order
        )
      );
      if (activeOrder && expiredOrders.some(o => o.id === activeOrder)) {
        const nextOrder = orders.find(o => !o.completed && !o.failed);
        setActiveOrder(nextOrder?.id || null);
        setCustomer(nextOrder?.customer || null);
      }
    }
  }, [orders, activeOrder]);

  // Clear completed/failed orders
  useEffect(() => {
    const completedOrders = orders.filter(o => o.completed || o.failed);
    if (completedOrders.length > 0) {
      const timeout = setTimeout(() => {
        setOrders(prev => prev.filter(o => !o.completed && !o.failed));
      }, 2000); // Reduced to 2 seconds for faster turnover
      return () => clearTimeout(timeout);
    }
  }, [orders]);

  // Animate notifications
  useEffect(() => {
    notifications.forEach((notification, index) => {
      const element = notificationRefs.current[index];
      if (element) {
        gsap.fromTo(
          element,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        );
        gsap.to(element, {
          opacity: 0,
          y: -20,
          duration: 0.5,
          ease: 'power2.in',
          delay: 3,
          onComplete: () => {
            setNotifications(prev => prev.filter(n => n.id !== notification.id));
          },
        });
      }
    });
  }, [notifications]);

  // Animate game over overlay
  useEffect(() => {
    if (gameOver) {
      gsap.fromTo(
        '.game-over-overlay',
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(1.7)' },
      );
    }
  }, [gameOver]);

  // Validate activeOrder
  useEffect(() => {
    if (activeOrder && !orders.find(o => o.id === activeOrder)) {
      const nextOrder = orders.find(o => !o.completed && !o.failed);
      setActiveOrder(nextOrder?.id || null);
      setCustomer(nextOrder?.customer || null);
    }
  }, [orders, activeOrder]);

  // Add notification
  const addNotification = (message, error = false) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, error }]);
  };

  // Restart game
  const restartGame = () => {
    setGameOver(false);
    setTimeLeft(GAME_DURATION);
    setScore(0);
    const initialOrders = Object.keys(recipes).slice(0, 3).map((name, index) => ({
      id: Date.now() + index,
      name,
      recipe: recipes[name],
      timeLeft: ORDER_PREP_TIME,
      completed: false,
      failed: false,
      ingredientsAdded: [],
      customer: generateCustomer(name),
    }));
    setOrders(initialOrders);
    setActiveOrder(null);
    setShowConfetti(false);
    setCustomer(null);
    setMobileMenuOpen(false);
    setNotifications([]);
    playSound('select');
  };

  // Handle ingredient click
  const handleIngredientClick = ingredient => {
    if (!activeOrder || gameOver) return;

    const now = Date.now();
    if (now - lastClickRef.current < 500) return; // Debounce 500ms
    lastClickRef.current = now;

    const order = orders.find(o => o.id === activeOrder);
    if (!order || order.completed || order.failed) return;

    const nextIndex = order.ingredientsAdded.length;
    const isCorrect = order.recipe[nextIndex] === ingredient;
    const isAlreadyAdded = order.ingredientsAdded.includes(ingredient);

    if (isCorrect && !isAlreadyAdded) {
      setOrders(prevOrders => {
        const updatedOrders = prevOrders.map(o =>
          o.id === activeOrder
            ? { ...o, ingredientsAdded: [...o.ingredientsAdded, ingredient] }
            : o
        );
        const updatedOrder = updatedOrders.find(o => o.id === activeOrder);
        if (updatedOrder && updatedOrder.ingredientsAdded.length === updatedOrder.recipe.length) {
          completeOrder(updatedOrder);
        } else {
          playSound('success');
          addNotification(`Added ${ingredient}!`);
        }
        return updatedOrders;
      });
    } else {
      setScore(prev => Math.max(0, prev - PENALTY_PER_MISTAKE));
      playSound('error');
      addNotification(
        isAlreadyAdded ? `${ingredient} already added!` : `Wrong ingredient!`,
        true
      );
    }
  };

  // Complete order
  const completeOrder = order => {
    setOrders(prevOrders => {
      const updatedOrders = prevOrders.map(o =>
        o.id === order.id ? { ...o, completed: true } : o
      );
      const nextOrder = updatedOrders.find(o => !o.completed && !o.failed);
      setActiveOrder(nextOrder?.id || null);
      setCustomer(nextOrder?.customer || null);
      setScore(prev => prev + SCORE_PER_ORDER);
      addNotification(`+${SCORE_PER_ORDER} pts for ${order.name}!`);
      playSound('complete');
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      return updatedOrders;
    });
  };

  // Select order
  const selectOrder = orderId => {
    if (gameOver) return;
    const order = orders.find(o => o.id === orderId);
    if (order && !order.completed && !order.failed) {
      setActiveOrder(orderId);
      setCustomer(order.customer);
      setMobileMenuOpen(false);
      playSound('select');
    }
  };

  // Navigate home
  const goHome = () => {
    navigate('/');
    playSound('select');
  };

  // Format time
  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    playSound('select');
  };

  return (
    <GameWrapper>
      <GameHeader>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <HomeButton onClick={goHome} aria-label="Go to home menu">
            /
          </HomeButton>
          <GameTitle>Sol-Donalds Kitchen</GameTitle>
          {orders.length > 0 && (
            <MobileMenuToggle onClick={toggleMobileMenu}>
              <MenuIcon />
              Orders
            </MobileMenuToggle>
          )}
        </div>
        <GameStats>
          <StatItem>
            <TimerIcon />
            <span>{formatTime(timeLeft)}</span>
          </StatItem>
          <StatItem>
            <FastfoodIcon />
            <span>{orders.filter(o => o.completed && !o.failed).length}/{orders.length}</span>
          </StatItem>
          <StatItem>
            <RestaurantMenuIcon />
            <span>{score} pts</span>
          </StatItem>
        </GameStats>
      </GameHeader>

      {gameOver && (
        <GameOverlay className="game-over-overlay" role="alert" aria-live="polite">
          <GameOverTitle>Game Over!</GameOverTitle>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <ControlButton primary onClick={restartGame}>
              <ReplayIcon />
              Play Again
            </ControlButton>
            <ControlButton onClick={goHome}>
              <ArrowBackIcon />
              Back to Menu
            </ControlButton>
          </div>
        </GameOverlay>
      )}

      <NotificationContainer>
        {notifications.map((notification, index) => (
          <Notification
            key={notification.id}
            ref={el => (notificationRefs.current[index] = el)}
            role="alert"
            aria-live="polite"
            error={notification.error}
          >
            <CheckCircleIcon style={{ fontSize: '1.5rem', color: '#fff' }} />
            <div>
              <h4>{notification.error ? 'Error!' : 'Order Update'}</h4>
              <span>{notification.message}</span>
            </div>
          </Notification>
        ))}
      </NotificationContainer>

      {!gameOver && (
        <GameContent>
          <OrdersColumn mobileMenuOpen={mobileMenuOpen}>
            <MobileOrdersHeader>
              <h3>Orders Queue</h3>
              <ControlButton onClick={toggleMobileMenu}>
                <CloseIcon />
              </ControlButton>
            </MobileOrdersHeader>
            <h3 style={{ display: window.innerWidth > 768 ? 'block' : 'none' }}>Orders Queue</h3>
            {orders.length > 0 ? (
              orders.map(order => (
                <OrderCard
                  key={order.id}
                  active={activeOrder === order.id}
                  completed={order.completed}
                  failed={order.failed}
                  onClick={() => selectOrder(order.id)}
                >
                  <OrderHeader>
                    <OrderTitle completed={order.completed} failed={order.failed}>
                      {order.name}
                    </OrderTitle>
                    <OrderTime warning={order.timeLeft <= 10 && !order.completed && !order.failed}>
                      {formatTime(order.timeLeft)}
                    </OrderTime>
                  </OrderHeader>
                  <OrderIngredients>
                    {order.recipe.map(ing => (
                      <IngredientPill key={ing} added={order.ingredientsAdded.includes(ing)}>
                        {ing}
                      </IngredientPill>
                    ))}
                  </OrderIngredients>
                </OrderCard>
              ))
            ) : (
              <NoOrdersMessage>
                <h3>No Orders</h3>
                <p>Waiting for new orders...</p>
              </NoOrdersMessage>
            )}
          </OrdersColumn>

          <WorkArea>
            {activeOrder ? (
              <>
                <CurrentOrder>
                  {customer && (
                    <CustomerInfo>
                      <CustomerAvatar>{customer.avatar}</CustomerAvatar>
                      <CustomerMessage>
                        <ChatIcon style={{ marginRight: '0.5rem', fontSize: '1rem' }} />
                        {customer.name}: {customer.message}
                      </CustomerMessage>
                    </CustomerInfo>
                  )}
                  {orders.find(o => o.id === activeOrder) ? (
                    <>
                      <h4
                        style={{
                          margin: '0 0 0.5rem 0',
                          fontSize: '1rem',
                          fontFamily: "'Tektur', sans-serif",
                          fontWeight: '700',
                          letterSpacing: '0.05em',
                          textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                        }}
                      >
                        Current: {orders.find(o => o.id === activeOrder)?.name}
                      </h4>
                      <OrderProgress>
                        {orders.find(o => o.id === activeOrder)?.recipe.map(ing => (
                          <IngredientPill
                            key={ing}
                            added={orders.find(o => o.id === activeOrder)?.ingredientsAdded.includes(ing)}
                            required={true}
                          >
                            {ing}
                          </IngredientPill>
                        ))}
                      </OrderProgress>
                    </>
                  ) : (
                    <NoOrdersMessage>
                      <h3>Order Not Found</h3>
                      <p>Please select another order from the queue.</p>
                    </NoOrdersMessage>
                  )}
                </CurrentOrder>

                <IngredientsArea>
                  {allIngredients.map(ing => (
                    <IngredientCard key={ing} onClick={() => handleIngredientClick(ing)}>
                      <IngredientIcon>
                        {ingredientImages[ing] ? (
                          <img src={ingredientImages[ing]} alt={ing} />
                        ) : (
                          <span>
                            {ing === 'soda' ? '🥤' :
                              ing === 'sausage' ? '🌭' :
                                ing === 'nft-sauce' ? '🍅' : '🍴'}
                          </span>
                        )}
                      </IngredientIcon>
                      <IngredientName>{ing}</IngredientName>
                    </IngredientCard>
                  ))}
                </IngredientsArea>
              </>
            ) : (
              <WelcomeMessage>
                <h3>Select an Order</h3>
                <p>Choose an order from the queue on the left to start cooking!</p>
              </WelcomeMessage>
            )}
          </WorkArea>
        </GameContent>
      )}

      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={400}
          colors={['#FFC107', 'rgba(255, 0, 0, 0.5)', '#ffffff']}
        />
      )}

      {activeOrder && !gameOver && (
        <GameControls>
          <ControlButton onClick={goHome}>
            <ArrowBackIcon />
            Exit
          </ControlButton>
          <ControlButton primary onClick={restartGame}>
            <ReplayIcon />
            Restart
          </ControlButton>
        </GameControls>
      )}
    </GameWrapper>
  );
};

export default Game;