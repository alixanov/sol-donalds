import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import gsap from 'gsap';
import {
  RestaurantMenu as RestaurantMenuIcon,
  Timer as TimerIcon,
  Fastfood as FastfoodIcon,
  Replay as ReplayIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Chat as ChatIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import Confetti from 'react-confetti';
import uspex from '../../sound/успех.mp3';
import polojitelniy from '../../sound/положителный.mp3';
import pobeda from '../../sound/победа.mp3';
import otrisatelney from '../../sound/отрицателный.mp3';
import porajeniya from '../../sound/поражения.mp3';

// Import Google Fonts
const importGoogleFonts = () => {
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=Roboto:wght@400;500&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
};
importGoogleFonts();

// Game constants
const GAME_DURATION = 120; // 2 minutes
const ORDER_PREP_TIME = 30; // 30 seconds per order
const MAX_ORDERS = 5;
const SCORE_PER_ORDER = 100;
const PENALTY_PER_MISTAKE = 20;

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
  'nuggets', 'dip',
  'chocolate', 'wrapper',
  'chocolate-circle', 'gold-leaf',
  'tomato', 'sauce', 'pickle',
  'nft-sauce', 'bull-bun', 'bear-meat', 'meme-sauce',
  'chart-lettuce', 'lemon-trading-sauce',
];

// Recipe definitions
const recipes = {
  'Sol-Burger': ['bull-bun', 'patty', 'cheese', 'lettuce', 'nft-sauce', 'bull-bun'],
  'Crypto Fries': ['fries', 'salt', 'chart-lettuce'],
  'Blockchain Soda': ['cup', 'ice', 'soda', 'lemon-trading-sauce'],
  'Hot Doge': ['bull-bun', 'bear-meat', 'sauce', 'pickle'],
  'Moon Chocolate': ['chocolate', 'wrapper', 'gold-leaf'],
  'NFT Sundae': ['chocolate-circle', 'gold-leaf', 'meme-sauce'],
};

// Customer data
const customers = [
  { id: 1, avatar: '👨', message: 'I need a Sol-Burger with extra NFT sauce!' },
  { id: 2, avatar: '👩', message: 'Crypto Fries with chart lettuce please!' },
  { id: 3, avatar: '🧑', message: 'Blockchain Soda - make it quick!' },
  { id: 4, avatar: '👴', message: 'Hot Doge with all the toppings!' },
  { id: 5, avatar: '👵', message: 'Moon Chocolate to go please!' },
];

// Styled components with mobile adaptation
const GameWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  background: #1a1a2e;
  color: #fff;
  overflow: hidden;
  touch-action: manipulation;
`;

const GameHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.5);
  border-bottom: 1px solid #333;
  
  @media (max-width: 768px) {
    padding: 0.5rem;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
`;

const GameTitle = styled.h1`
  margin: 0;
  font-family: 'Cinzel Decorative', cursive;
  font-weight: 700;
  font-size: 1.5rem;
  color: #25dba2;
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
  
  @media (max-width: 768px) {
    gap: 0.5rem;
    flex-wrap: wrap;
  }
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 0.9rem;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const MobileMenuToggle = styled.button`
  display: none;
  background: linear-gradient(135deg, #9150fa 0%, #25dba2 100%);
  color: #000;
  border: none;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Roboto', sans-serif;
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
  background: rgba(0, 0, 0, 0.3);
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
      font-family: 'Cinzel Decorative', cursive;
      font-weight: 700;
      color: #25dba2;
      letter-spacing: 0.05em;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    }
  }
`;

const OrderCard = styled.div`
  background: ${props => props.active ? '#2a2a4a' : '#1a1a2e'};
  border: 1px solid ${props => props.active ? '#9150fa' : '#333'};
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  touch-action: manipulation;

  &:hover, &:active {
    border-color: #25dba2;
    transform: scale(1.02);
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
  font-family: 'Cinzel Decorative', cursive;
  font-weight: 700;
  color: ${props => props.completed ? '#25dba2' : '#fff'};
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  font-size: 1rem;
  letter-spacing: 0.05em;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const OrderTime = styled.div`
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 0.8rem;
  color: ${props => props.warning ? '#f72585' : '#ccc'};
`;

const OrderIngredients = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-top: 0.5rem;
`;

const IngredientPill = styled.div`
  background: ${props => props.added ? 'linear-gradient(135deg, #9150fa 0%, #25dba2 100%)' : '#333'};
  color: ${props => props.added ? '#000' : '#fff'};
  padding: 0.2rem 0.5rem;
  border-radius: 15px;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 0.7rem;
  
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
  background: rgba(0, 0, 0, 0.3);
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
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  flex: 1;
  font-family: 'Roboto', sans-serif;
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
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.2);
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
  background: linear-gradient(135deg, rgba(145, 80, 250, 0.2) 0%, rgba(37, 219, 162, 0.2) 100%);
  border: 1px solid rgba(145, 80, 250, 0.5);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  touch-action: manipulation;
  min-height: 100px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);

  &:hover, &:active {
    transform: scale(1.05);
    border-color: #25dba2;
    background: linear-gradient(135deg, rgba(145, 80, 250, 0.3) 0%, rgba(37, 219, 162, 0.3) 100%);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
  
  @media (max-width: 768px) {
    padding: 0.8rem;
    min-height: 80px;
    border-radius: 10px;
  }
  
  @media (max-width: 480px) {
    padding: 0.6rem;
    min-height: 70px;
    border-radius: 8px;
  }
`;

const IngredientIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
  transition: transform 0.2s ease;
  
  ${IngredientCard}:hover & {
    transform: scale(1.1);
  }
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 0.4rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
    margin-bottom: 0.3rem;
  }
`;

const IngredientName = styled.div`
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 0.8rem;
  text-align: center;
  line-height: 1.2;
  color: rgba(255, 255, 255, 0.9);
  
  @media (max-width: 768px) {
    font-size: 0.7rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.6rem;
  }
`;

const GameControls = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.5);
  border-top: 1px solid #333;
  
  @media (max-width: 768px) {
    padding: 0.5rem;
    gap: 0.5rem;
  }
`;

const ControlButton = styled.button`
  background: ${props => props.primary ? 'linear-gradient(135deg, #9150fa 0%, #25dba2 100%)' : '#333'};
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
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 0.9rem;

  &:hover, &:active {
    background: ${props => props.primary ? 'linear-gradient(135deg, #7d40e0 0%, #1fcb8e 100%)' : '#444'};
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
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 30;
  padding: 2rem;
  text-align: center;
  border: 2px solid transparent;
  border-image: linear-gradient(135deg, #9150fa 0%, #25dba2 100%) 1;
  max-width: 500px;
  margin: 0 auto;
  border-radius: 12px;
  
  @media (max-width: 768px) {
    padding: 1rem;
    max-width: 90%;
  }
`;

const GameOverTitle = styled.h2`
  font-family: 'Cinzel Decorative', cursive;
  font-weight: 700;
  font-size: 3rem;
  color: #25dba2;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  letter-spacing: 0.05em;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const FinalScore = styled.div`
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 2rem;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, #9150fa 0%, #25dba2 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.2rem;
    margin-bottom: 1rem;
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
  background: linear-gradient(135deg, #9150fa 0%, #25dba2 100%);
  color: #fff;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  max-width: 300px;
  opacity: 0;
  transform: translateY(-20px);
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 0.9rem;
  
  h4 {
    font-family: 'Cinzel Decorative', cursive;
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
    font-family: 'Cinzel Decorative', cursive;
    font-weight: 700;
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #25dba2;
    letter-spacing: 0.05em;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    
    @media (max-width: 768px) {
      font-size: 1.2rem;
    }
  }
  
  p {
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-size: 1rem;
    opacity: 0.8;
    
    @media (max-width: 768px) {
      font-size: 0.9rem;
    }
  }
`;

const NoOrderOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 30;
  padding: 2rem;
  text-align: center;
  color: #ffffff;
  
  h2 {
    font-family: 'Cinzel Decorative', cursive;
    font-weight: 700;
    font-size: 2rem;
    color: #25dba2;
    margin-bottom: 1rem;
    letter-spacing: 0.05em;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }

  p {
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }

  @media (max-width: 768px) {
    padding: 1rem;

    h2 {
      font-size: 1.5rem;
    }

    p {
      font-size: 0.9rem;
    }
  }
`;

const Game = () => {
  const location = useLocation();
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

  // Initialize game
  useEffect(() => {
    if (location.state?.order) {
      const initialOrder = {
        id: Date.now(),
        name: location.state.order.name,
        recipe: recipes[location.state.order.name],
        timeLeft: ORDER_PREP_TIME,
        completed: false,
        ingredientsAdded: [],
      };
      setOrders([initialOrder]);
      setActiveOrder(initialOrder.id);
      setCustomer(customers[Math.floor(Math.random() * customers.length)]);
      playSound('select');
    }
  }, [location.state]);

  // Game timer
  useEffect(() => {
    if (!activeOrder || gameOver) return;

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

      setOrders(prevOrders =>
        prevOrders.map(order => ({
          ...order,
          timeLeft: order.completed ? order.timeLeft : order.timeLeft - 1,
        })),
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [activeOrder, gameOver]);

  // Generate new orders
  useEffect(() => {
    if (!activeOrder || gameOver || orders.length >= MAX_ORDERS) return;

    const orderInterval = setInterval(() => {
      if (orders.length < MAX_ORDERS) {
        const menuItems = Object.keys(recipes);
        const randomItem = menuItems[Math.floor(Math.random() * menuItems.length)];
        const newOrder = {
          id: Date.now(),
          name: randomItem,
          recipe: recipes[randomItem],
          timeLeft: ORDER_PREP_TIME,
          completed: false,
          ingredientsAdded: [],
        };
        setOrders(prev => [...prev, newOrder]);
        setCustomer(customers[Math.floor(Math.random() * customers.length)]);
        playSound('success');
      }
    }, 15000);

    return () => clearInterval(orderInterval);
  }, [activeOrder, gameOver, orders.length]);

  // Check for expired orders
  useEffect(() => {
    const expiredOrders = orders.filter(order => order.timeLeft <= 0 && !order.completed);
    if (expiredOrders.length > 0) {
      expiredOrders.forEach(() => playSound('defeat'));
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.timeLeft <= 0 && !order.completed
            ? { ...order, completed: true, failed: true }
            : order,
        ),
      );
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

  // Add notification
  const addNotification = message => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message }]);
  };

  // Restart game
  const restartGame = () => {
    setGameOver(false);
    setTimeLeft(GAME_DURATION);
    setScore(0);
    setOrders([]);
    setActiveOrder(null);
    setShowConfetti(false);
    setCustomer(null);
    setMobileMenuOpen(false);
    setNotifications([]);
  };

  // Handle ingredient click
  const handleIngredientClick = ingredient => {
    if (!activeOrder || gameOver) return;

    const order = orders.find(o => o.id === activeOrder);
    if (!order || order.completed) return;

    const isCorrect = order.recipe.includes(ingredient);
    const isAlreadyAdded = order.ingredientsAdded.includes(ingredient);

    if (isCorrect && !isAlreadyAdded) {
      const updatedOrders = orders.map(o =>
        o.id === activeOrder
          ? { ...o, ingredientsAdded: [...o.ingredientsAdded, ingredient] }
          : o,
      );
      setOrders(updatedOrders);

      const updatedOrder = updatedOrders.find(o => o.id === activeOrder);
      if (updatedOrder.ingredientsAdded.length === updatedOrder.recipe.length) {
        completeOrder(updatedOrder);
      } else {
        playSound('success');
      }
    } else if (!isCorrect) {
      setScore(prev => Math.max(0, prev - PENALTY_PER_MISTAKE));
      playSound('error');
    }
  };

  // Complete order
  const completeOrder = order => {
    const updatedOrders = orders.map(o =>
      o.id === order.id ? { ...o, completed: true } : o,
    );
    setOrders(updatedOrders);
    setScore(prev => prev + SCORE_PER_ORDER);
    addNotification(`+${SCORE_PER_ORDER} pts`);
    playSound('complete');
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);

    const nextOrder = updatedOrders.find(o => !o.completed);
    setActiveOrder(nextOrder?.id || null);
  };

  // Select order
  const selectOrder = orderId => {
    if (gameOver) return;
    setActiveOrder(orderId);
    setMobileMenuOpen(false);
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

  // Handle no order
  if (!location.state?.order) {
    return (
      <GameWrapper>
        <NoOrderOverlay>
          <h2>No Order Selected</h2>
          <p>Please select an order from the menu to start.</p>
          <ControlButton primary onClick={() => navigate('/')}>
            <ArrowBackIcon />
            Back to Menu
          </ControlButton>
        </NoOrderOverlay>
      </GameWrapper>
    );
  }

  return (
    <GameWrapper>
      <GameHeader>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <GameTitle>Sol-Donalds Kitchen</GameTitle>
          {activeOrder && !gameOver && (
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
          <CancelIcon style={{ fontSize: '3rem', color: '#f72585', marginBottom: '1rem' }} />
          <GameOverTitle>Game Over!</GameOverTitle>
          <FinalScore>Final Score: {score} pts</FinalScore>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <ControlButton primary onClick={restartGame}>
              <ReplayIcon />
              Play Again
            </ControlButton>
            <ControlButton onClick={() => navigate('/')}>
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
          >
            <CheckCircleIcon style={{ fontSize: '1.5rem', color: '#fff' }} />
            <div>
              <h4>Order Complete!</h4>
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
            {orders.map(order => (
              <OrderCard
                key={order.id}
                active={activeOrder === order.id}
                onClick={() => selectOrder(order.id)}
              >
                <OrderHeader>
                  <OrderTitle completed={order.completed}>{order.name}</OrderTitle>
                  <OrderTime warning={order.timeLeft <= 10 && !order.completed}>
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
                {order.completed && (
                  <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {order.failed ? (
                      <>
                        <CancelIcon style={{ color: '#f72585', fontSize: '1rem' }} />
                        <span style={{ color: '#f72585', fontSize: '0.8rem' }}>Failed</span>
                      </>
                    ) : (
                      <>
                        <CheckCircleIcon style={{ color: '#25dba2', fontSize: '1rem' }} />
                        <span style={{ color: '#25dba2', fontSize: '0.8rem' }}>Completed</span>
                      </>
                    )}
                  </div>
                )}
              </OrderCard>
            ))}
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
                        {customer.message}
                      </CustomerMessage>
                    </CustomerInfo>
                  )}
                  <h4
                    style={{
                      margin: '0 0 0.5rem 0',
                      fontSize: '1rem',
                      fontFamily: "'Cinzel Decorative', 'cursive'",
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
                      >
                        {ing}
                      </IngredientPill>
                    ))}
                  </OrderProgress>
                </CurrentOrder>

                <IngredientsArea>
                  {allIngredients.map(ing => (
                    <IngredientCard key={ing} onClick={() => handleIngredientClick(ing)}>
                      <IngredientIcon>
                        {ing.includes('bun') ? '🍔' :
                          ing.includes('patty') ? '🍔' :
                            ing.includes('cheese') ? '🧀' :
                              ing.includes('lettuce') ? '🥬' :
                                ing.includes('fries') ? '🍟' :
                                  ing.includes('soda') ? '🥤' :
                                    ing.includes('nuggets') ? '🍗' :
                                      ing.includes('chocolate') ? '🍫' :
                                        ing.includes('ice') ? '❄️' :
                                          ing.includes('cup') ? '🥤' :
                                            ing.includes('sauce') ? '🍖' :
                                              ing.includes('meat') ? '🥩' :
                                                ing.includes('gold') ? '🌟' : '🍴'}
                      </IngredientIcon>
                      <IngredientName>{ing}</IngredientName>
                    </IngredientCard>
                  ))}
                </IngredientsArea>
              </>
            ) : (
              <NoOrdersMessage>
                <h3>No Active Orders</h3>
                <p>Select an order from the queue to start.</p>
                {orders.length === 0 && <p>Waiting for new orders...</p>}
              </NoOrdersMessage>
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
          colors={['#9150fa', '#25dba2', '#ffffff']}
        />
      )}

      {activeOrder && !gameOver && (
        <GameControls>
          <ControlButton onClick={() => navigate('/')}>
            <ArrowBackIcon />
            Exit
          </ControlButton>
          <ControlButton onClick={restartGame}>
            <ReplayIcon />
            Restart
          </ControlButton>
        </GameControls>
      )}
    </GameWrapper>
  );
};

export default Game;