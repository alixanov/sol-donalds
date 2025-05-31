import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import gsap from 'gsap';
import {
  RestaurantMenu as RestaurantMenuIcon,
  Timer as TimerIcon,
  Fastfood as FastfoodIcon,
  PlayArrow as PlayArrowIcon,
  Replay as ReplayIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Chat as ChatIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import Confetti from 'react-confetti';

// Game constants
const GAME_DURATION = 120; // 2 minutes
const ORDER_PREP_TIME = 30; // 30 seconds per order
const MAX_ORDERS = 5;
const SCORE_PER_ORDER = 100;
const PENALTY_PER_MISTAKE = 20;

// Sound effects (mock implementation)
const playSound = (type) => {
  console.log(`Playing sound: ${type}`);
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
  'NFT Sundae': ['chocolate-circle', 'gold-leaf', 'meme-sauce']
};

// Customer data
const customers = [
  { id: 1, avatar: '👨', message: 'I need a Sol-Burger with extra NFT sauce!' },
  { id: 2, avatar: '👩', message: 'Crypto Fries with chart lettuce please!' },
  { id: 3, avatar: '🧑', message: 'Blockchain Soda - make it quick!' },
  { id: 4, avatar: '👴', message: 'Hot Doge with all the toppings!' },
  { id: 5, avatar: '👵', message: 'Moon Chocolate to go please!' }
];

// Styled components with mobile adaptation
const GameWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  background: #1a1a2e;
  color: #fff;
  font-family: 'Arial', sans-serif;
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
  font-size: 1.5rem;
  color: #4cc9f0;
  
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
  font-size: 0.9rem;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const MobileMenuToggle = styled.button`
  display: none;
  background: #4cc9f0;
  color: #000;
  border: none;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  
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
    padding: 1rem 0;
    margin-bottom: 1rem;
    border-bottom: 1px solid #333;
    
    h3 {
      margin: 0;
      color: #4cc9f0;
    }
  }
`;

const OrderCard = styled.div`
  background: ${props => props.active ? '#2a2a4a' : '#1a1a2e'};
  border: 1px solid ${props => props.active ? '#4cc9f0' : '#333'};
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  touch-action: manipulation;

  &:hover, &:active {
    border-color: #4cc9f0;
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
  color: ${props => props.completed ? '#4cc9f0' : '#fff'};
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  font-size: 1rem;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const OrderTime = styled.div`
  font-size: 0.8rem;
  color: ${props => props.warning ? '#f72585' : '#ccc'};
  font-weight: bold;
`;

const OrderIngredients = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-top: 0.5rem;
`;

const IngredientPill = styled.div`
  background: ${props => props.added ? '#4cc9f0' : '#333'};
  color: ${props => props.added ? '#000' : '#fff'};
  padding: 0.2rem 0.5rem;
  border-radius: 15px;
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
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 0.8rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
    gap: 0.5rem;
    padding: 0.8rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
    gap: 0.4rem;
    padding: 0.5rem;
  }
`;

const IngredientCard = styled.div`
  background: #333;
  border: 1px solid #444;
  border-radius: 8px;
  padding: 0.8rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  touch-action: manipulation;
  min-height: 80px;

  &:hover, &:active {
    transform: scale(1.05);
    border-color: #4cc9f0;
    background: #444;
  }
  
  @media (max-width: 768px) {
    padding: 0.6rem;
    min-height: 70px;
  }
  
  @media (max-width: 480px) {
    padding: 0.4rem;
    min-height: 60px;
  }
`;

const IngredientIcon = styled.div`
  font-size: 1.8rem;
  margin-bottom: 0.3rem;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 0.2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

const IngredientName = styled.div`
  font-size: 0.7rem;
  text-align: center;
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 0.6rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.5rem;
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
  background: ${props => props.primary ? '#4cc9f0' : '#333'};
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
  font-size: 0.9rem;

  &:hover, &:active {
    background: ${props => props.primary ? '#3aa8d8' : '#444'};
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
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const GameOverTitle = styled.h2`
  font-size: 3rem;
  color: #4cc9f0;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`;

const FinalScore = styled.div`
  font-size: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.2rem;
    margin-bottom: 1rem;
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
    font-size: 1.5rem;
    margin-bottom: 1rem;
    
    @media (max-width: 768px) {
      font-size: 1.2rem;
    }
  }
  
  p {
    font-size: 1rem;
    opacity: 0.8;
    
    @media (max-width: 768px) {
      font-size: 0.9rem;
    }
  }
`;

const Game = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const [orders, setOrders] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [currentIngredients, setCurrentIngredients] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Initialize game
  useEffect(() => {
    if (location.state?.order) {
      const initialOrder = {
        id: 1,
        name: location.state.order.name,
        recipe: recipes[location.state.order.name],
        timeLeft: ORDER_PREP_TIME,
        completed: false,
        ingredientsAdded: []
      };
      setOrders([initialOrder]);
      setActiveOrder(initialOrder.id);
      setCustomer(customers[0]);
    }
  }, [location.state]);

  // Game timer
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });

      // Update order timers
      setOrders(prevOrders =>
        prevOrders.map(order => ({
          ...order,
          timeLeft: order.completed ? order.timeLeft : order.timeLeft - 1
        }))
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameOver]);

  // Generate new orders
  useEffect(() => {
    if (!gameStarted || gameOver || orders.length >= MAX_ORDERS) return;

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
          ingredientsAdded: []
        };
        setOrders(prev => [...prev, newOrder]);
        setCustomer(customers[Math.floor(Math.random() * customers.length)]);
        playSound('new_order');
      }
    }, 15000); // Every 15 seconds

    return () => clearInterval(orderInterval);
  }, [gameStarted, gameOver, orders.length]);

  // Check for expired orders
  useEffect(() => {
    const expiredOrders = orders.filter(order => order.timeLeft <= 0 && !order.completed);
    if (expiredOrders.length > 0) {
      expiredOrders.forEach(order => {
        playSound('error');
      });
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.timeLeft <= 0 && !order.completed
            ? { ...order, completed: true, failed: true }
            : order
        )
      );
    }
  }, [orders]);

  // Start game
  const startGame = () => {
    setGameStarted(true);
    playSound('start');
  };

  // Restart game
  const restartGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setTimeLeft(GAME_DURATION);
    setScore(0);
    setOrders([]);
    setActiveOrder(null);
    setCurrentIngredients([]);
    setShowConfetti(false);
    setCustomer(null);
    setMobileMenuOpen(false);
  };

  // Handle ingredient click
  const handleIngredientClick = (ingredient) => {
    if (!activeOrder || gameOver) return;

    const order = orders.find(o => o.id === activeOrder);
    if (!order || order.completed) return;

    const isCorrect = order.recipe.includes(ingredient);
    const isAlreadyAdded = order.ingredientsAdded.includes(ingredient);

    if (isCorrect && !isAlreadyAdded) {
      // Add correct ingredient
      const updatedOrders = orders.map(o =>
        o.id === activeOrder
          ? { ...o, ingredientsAdded: [...o.ingredientsAdded, ingredient] }
          : o
      );
      setOrders(updatedOrders);

      // Check if order is complete
      const updatedOrder = updatedOrders.find(o => o.id === activeOrder);
      if (updatedOrder.ingredientsAdded.length === updatedOrder.recipe.length) {
        completeOrder(updatedOrder);
      } else {
        playSound('success');
      }
    } else if (!isCorrect) {
      // Wrong ingredient penalty
      setScore(prev => Math.max(0, prev - PENALTY_PER_MISTAKE));
      playSound('error');
    }
  };

  // Complete order
  const completeOrder = (order) => {
    const updatedOrders = orders.map(o =>
      o.id === order.id ? { ...o, completed: true } : o
    );
    setOrders(updatedOrders);
    setScore(prev => prev + SCORE_PER_ORDER);
    playSound('complete');
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);

    // Set next active order
    const nextOrder = updatedOrders.find(o => !o.completed);
    setActiveOrder(nextOrder?.id || null);
  };

  // Select order to work on
  const selectOrder = (orderId) => {
    if (gameOver) return;
    setActiveOrder(orderId);
    setMobileMenuOpen(false); // Close mobile menu after selection
  };

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <GameWrapper>
      <GameHeader>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <GameTitle>Sol-Donalds Kitchen</GameTitle>
          {gameStarted && !gameOver && (
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
            <span>{orders.filter(o => o.completed).length}/{orders.length}</span>
          </StatItem>
          <StatItem>
            <RestaurantMenuIcon />
            <span>{score}pts</span>
          </StatItem>
        </GameStats>
      </GameHeader>

      {!gameStarted && !gameOver && (
        <GameOverlay>
          <GameOverTitle>Sol-Donalds Kitchen</GameOverTitle>
          <p>Prepare the orders correctly before time runs out!</p>
          <ControlButton primary onClick={startGame}>
            <PlayArrowIcon />
            Start Game
          </ControlButton>
        </GameOverlay>
      )}

      {gameOver && (
        <GameOverlay>
          <GameOverTitle>Game Over!</GameOverTitle>
          <FinalScore>Your Score: {score} pts</FinalScore>
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

      {gameStarted && !gameOver && (
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
                  <OrderTime warning={order.timeLeft < 10 && !order.completed}>
                    {formatTime(order.timeLeft)}
                  </OrderTime>
                </OrderHeader>
                <OrderIngredients>
                  {order.recipe.map(ing => (
                    <IngredientPill
                      key={ing}
                      added={order.ingredientsAdded.includes(ing)}
                    >
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
                        <CheckCircleIcon style={{ color: '#4cc9f0', fontSize: '1rem' }} />
                        <span style={{ color: '#4cc9f0', fontSize: '0.8rem' }}>Completed</span>
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
                  <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>
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
                    <IngredientCard
                      key={ing}
                      onClick={() => handleIngredientClick(ing)}
                    >
                      <IngredientIcon>
                        {ing.includes('bun') ? '🍞' :
                          ing.includes('patty') ? '🍔' :
                            ing.includes('cheese') ? '🧀' :
                              ing.includes('lettuce') ? '🥬' :
                                ing.includes('fries') ? '🍟' :
                                  ing.includes('soda') ? '🥤' :
                                    ing.includes('nuggets') ? '🍗' :
                                      ing.includes('chocolate') ? '🍫' :
                                        ing.includes('ice') ? '❄️' :
                                          ing.includes('cup') ? '🥛' :
                                            ing.includes('sauce') ? '🍯' :
                                              ing.includes('meat') ? '🥩' :
                                                ing.includes('gold') ? '🌟' :
                                                  '🍽️'}
                      </IngredientIcon>
                      <IngredientName>{ing}</IngredientName>
                    </IngredientCard>
                  ))}
                </IngredientsArea>
              </>
            ) : (
              <NoOrdersMessage>
                <h3>No Active Orders</h3>
                <p>Select an order from the queue to start</p>
                {orders.length === 0 && (
                  <p>Waiting for new orders...</p>
                )}
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
          numberOfPieces={500}
        />
      )}

      {gameStarted && !gameOver && (
        <GameControls>
          <div>
            <ControlButton onClick={() => navigate('/')}>
              <ArrowBackIcon />
              Exit
            </ControlButton>
          </div>
          <div>
            <ControlButton onClick={restartGame}>
              <ReplayIcon />
              Restart
            </ControlButton>
          </div>
        </GameControls>
      )}
    </GameWrapper>
  );
};

export default Game;