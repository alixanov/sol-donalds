import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import gsap from 'gsap';
import {
  Gamepad as GamepadIcon,
  RestaurantMenu as RestaurantMenuIcon,
  Timer as TimerIcon,
  Fastfood as FastfoodIcon,
  PlayArrow as PlayArrowIcon,
  Replay as ReplayIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Chat as ChatIcon,
} from '@mui/icons-material';
import Confetti from 'react-confetti';
import { Howl } from 'howler';

// Sound effects
const sounds = {
  success: new Howl({ src: ['/sounds/success.mp3'] }),
  error: new Howl({ src: ['/sounds/error.mp3'] }),
  complete: new Howl({ src: ['/sounds/complete.mp3'] }),
  clock: new Howl({ src: ['/sounds/clock.mp3'], loop: true }),
};

// Ingredients for each menu item
const recipes = {
  PumpBurger: ['bun-bottom', 'patty', 'cheese', 'lettuce', 'bun-top'],
  'FOMO Fries': ['fries', 'salt', 'ketchup'],
  'Slippage Soda': ['cup', 'ice', 'soda'],
  'Rug Nuggets': ['nuggets', 'dip'],
  'Moon Chocolate': ['chocolate', 'wrapper'],
  'Whale Circle': ['chocolate-circle', 'gold-leaf'],
};

// All possible ingredients (including distractors)
const allIngredients = Array.from(
  new Set(Object.values(recipes).flat().concat(['tomato', 'sauce', 'pickle'])),
);

// Customer messages
const customerMessages = [
  'I need it before the candle flips!',
  'HURRY! SOL is dumping!',
  'My stop loss is triggering!',
  'Faster! I’m about to paperhand!',
  'Need this before the next pump!',
  'Quick! Before the whales notice!',
];

// Styled Components
const GameWrapper = styled.div`
  position: relative;
  min-height: 100vh;
  background: #0a0a0a;
  overflow: hidden;
  font-family: 'Cinzel Decorative', cursive;
  color: #e0e0e0;
`;

const KitchenScene = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  background: url('/images/kitchen-bg.jpg') no-repeat center center;
  background-size: cover;
  display: block;

  @media (max-width: 768px) {
    background-size: contain;
  }
`;

const ChefCharacter = styled.div`
  position: absolute;
  width: 120px;
  height: 180px;
  background: url('/images/chef.png') no-repeat;
  background-size: contain;
  bottom: 20%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;

  @media (max-width: 768px) {
    width: 80px;
    height: 120px;
  }
`;

const OrderTicket = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 250px;
  background: rgba(20, 20, 20, 0.9);
  border: 2px solid #9945ff;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 0 20px rgba(153, 69, 255, 0.5);
  z-index: 20;
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media (max-width: 768px) {
    width: 200px;
    padding: 10px;
  }
`;

const OrderTitle = styled.h3`
  color: #14f195;
  margin: 0;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const OrderIngredients = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const IngredientItem = styled.li`
  color: ${props => (props.completed ? '#14f195' : '#e0e0e0')};
  margin: 5px 0;
  text-decoration: ${props => (props.completed ? 'line-through' : 'none')};
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const TimerDisplay = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  font-size: 2rem;
  color: ${props => (props.time > 10 ? '#14f195' : '#ff5555')};
  background: rgba(20, 20, 20, 0.8);
  padding: 10px 20px;
  border-radius: 10px;
  border: 2px solid ${props => (props.time > 10 ? '#14f195' : '#ff5555')};
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    padding: 8px 15px;
  }
`;

const IngredientTable = styled.div`
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 20px;
  z-index: 15;
  flex-wrap: wrap;
  padding: 10px;

  @media (max-width: 768px) {
    gap: 10px;
  }
`;

const Ingredient = styled.div`
  width: 80px;
  height: 80px;
  background: url(${props => props.image || '/images/placeholder.png'}) no-repeat center center;
  background-size: contain;
  cursor: pointer;
  transition: transform 0.2s;
  border: 2px solid #9945ff;
  border-radius: 8px;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 4px;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 0 10px rgba(153, 69, 255, 0.8);
  }

  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
  }
`;

const DishAssembly = styled.div`
  position: absolute;
  bottom: 30%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  z-index: 12;
  background: rgba(20, 20, 20, 0.7);
  padding: 10px;
  border-radius: 10px;
  border: 2px solid #14f195;

  @media (max-width: 768px) {
    bottom: 35%;
  }
`;

const AssembledIngredient = styled.div`
  width: 100px;
  height: 40px;
  background: url(${props => props.image || '/images/placeholder.png'}) no-repeat center center;
  background-size: contain;

  @media (max-width: 768px) {
    width: 80px;
    height: 30px;
  }
`;

const CustomerMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(20, 20, 20, 0.9);
  border: 2px solid #9945ff;
  border-radius: 10px;
  padding: 15px;
  max-width: 300px;
  text-align: center;
  z-index: 30;
  animation: pulse 2s infinite;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 8px;

  @keyframes pulse {
    0% {
      box-shadow: 0 0 10px rgba(153, 69, 255, 0.5);
    }
    50% {
      box-shadow: 0 0 20px rgba(20, 241, 149, 0.8);
    }
    100% {
      box-shadow: 0 0 10px rgba(153, 69, 255, 0.5);
    }
  }

  @media (max-width: 768px) {
    max-width: 250px;
    font-size: 1rem;
    padding: 10px;
  }
`;

const GameOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const GameComplete = styled.div`
  background: rgba(20, 20, 20, 0.95);
  border: 3px solid ${props => (props.won ? '#14f195' : '#ff5555')};
  border-radius: 15px;
  padding: 30px;
  max-width: 500px;
  text-align: center;
  color: #e0e0e0;

  @media (max-width: 768px) {
    max-width: 90%;
    padding: 20px;
  }
`;

const GameContainer = styled.div`
  background: rgba(20, 20, 20, 0.95);
  border: 3px solid #9945ff;
  border-radius: 15px;
  padding: 30px;
  max-width: 500px;
  text-align: center;
  color: #e0e0e0;

  @media (max-width: 768px) {
    max-width: 90%;
    padding: 20px;
  }
`;

const GameTitle = styled.h2`
  font-size: 2.5rem;
  color: #14f195;
  text-shadow: 0 0 10px rgba(20, 241, 149, 0.8);
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const PurchasedItem = styled.div`
  margin: 20px 0;
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  border: 2px solid #ff00ff;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const ItemImage = styled.img`
  width: 100px;
  height: auto;
  border-radius: 8px;
  border: 2px solid #ff00ff;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    width: 80px;
  }
`;

const PlayButton = styled.button`
  padding: 12px 24px;
  font-size: 1.2rem;
  font-family: 'Cinzel Decorative', cursive;
  color: #000;
  background: ${props => props.backButton
    ? 'linear-gradient(90deg, #ff5555, #9945ff)'
    : 'linear-gradient(90deg, #9945ff, #14f195)'};
  border: none;
  border-radius: 25px;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(153, 69, 255, 0.6);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 15px ${props => props.backButton
    ? 'rgba(255, 85, 85, 0.8)'
    : 'rgba(20, 241, 149, 0.8)'};
  }

  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 1rem;
  }
`;

const Game = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const chefRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [completedIngredients, setCompletedIngredients] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [ordersCompleted, setOrdersCompleted] = useState(0);
  const [failedOrders, setFailedOrders] = useState(0);
  const [gameStatus, setGameStatus] = useState('playing'); // playing, won, lost
  const [showMessage, setShowMessage] = useState(false);
  const [customerMessage, setCustomerMessage] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const purchasedItem = location.state?.purchasedItem;

  // GSAP animations
  useEffect(() => {
    if (chefRef.current) {
      gsap.to(chefRef.current, {
        x: '-=10',
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }
  }, [gameStarted]);

  // Start the game
  const startGame = () => {
    setGameStarted(true);
    generateNewOrder();
    sounds.clock.play();
  };

  // Generate a new random order
  const generateNewOrder = () => {
    const dishes = Object.keys(recipes);
    const dish = dishes[Math.floor(Math.random() * dishes.length)];
    const ingredients = [...recipes[dish]];
    setCurrentOrder({ dish, ingredients });
    setCompletedIngredients([]);
    setTimeLeft(Math.max(30 - level * 3, 10));

    // Show random customer message
    const randomMessage = customerMessages[Math.floor(Math.random() * customerMessages.length)];
    setCustomerMessage(randomMessage);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 2000);
  };

  // Handle timer
  useEffect(() => {
    if (!gameStarted || !currentOrder || gameStatus !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleOrderFailed();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, currentOrder, gameStatus]);

  // Handle ingredient selection
  const handleIngredientClick = ingredient => {
    if (!currentOrder || completedIngredients.includes(ingredient)) return;

    const nextIngredient = currentOrder.ingredients[completedIngredients.length];

    if (ingredient === nextIngredient) {
      // Correct ingredient
      const newCompleted = [...completedIngredients, ingredient];
      setCompletedIngredients(newCompleted);
      sounds.success.play();

      // Animate ingredient addition
      gsap.fromTo(
        `.ingredient-${newCompleted.length - 1}`,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
      );

      if (newCompleted.length === currentOrder.ingredients.length) {
        handleOrderComplete();
      }
    } else {
      // Wrong ingredient
      sounds.error.play();
      setTimeLeft(prev => Math.max(prev - 3, 0));
    }
  };

  // Handle completed order
  const handleOrderComplete = () => {
    sounds.complete.play();
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    setScore(prev => prev + 50 * level);
    const newOrdersCompleted = ordersCompleted + 1;
    setOrdersCompleted(newOrdersCompleted);

    if (score + 50 * level >= 500) {
      setGameStatus('won');
      sounds.clock.stop();
    } else if (newOrdersCompleted >= 5) {
      setLevel(prev => prev + 1);
      setOrdersCompleted(0);
      setTimeout(generateNewOrder, 1500);
    } else {
      setTimeout(generateNewOrder, 1500);
    }
  };

  // Handle failed order
  const handleOrderFailed = () => {
    sounds.error.play();
    setScore(prev => Math.max(prev - 20, 0));
    const newFailedOrders = failedOrders + 1;
    setFailedOrders(newFailedOrders);

    if (newFailedOrders >= 3) {
      setGameStatus('lost');
      sounds.clock.stop();
    } else {
      setTimeout(generateNewOrder, 1500);
    }
  };

  // Render ingredients for selection
  const renderIngredients = () => {
    // Shuffle ingredients
    const shuffledIngredients = [...allIngredients].sort(() => Math.random() - 0.5);
    return shuffledIngredients.map((ingredient, index) => (
      <Ingredient
        key={index}
        image={`/images/ingredients/${ingredient}.png`}
        onClick={() => handleIngredientClick(ingredient)}
      >
        <FastfoodIcon sx={{ fontSize: 20, color: '#14f195' }} />
      </Ingredient>
    ));
  };

  // Render assembled dish
  const renderDishAssembly = () => {
    if (!currentOrder) return null;
    return completedIngredients.map((ingredient, index) => (
      <AssembledIngredient
        key={index}
        className={`ingredient-${index}`}
        image={`/images/ingredients/${ingredient}.png`}
      />
    ));
  };

  // Restart game
  const restartGame = () => {
    setGameStarted(false);
    setGameStatus('playing');
    setLevel(1);
    setScore(0);
    setOrdersCompleted(0);
    setFailedOrders(0);
    setTimeLeft(30);
    setShowConfetti(false);
    setCurrentOrder(null);
    sounds.clock.stop();
  };

  return (
    <GameWrapper>
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}

      {!gameStarted ? (
        <GameOverlay>
          <GameContainer>
            <GameTitle>
              <RestaurantMenuIcon sx={{ fontSize: 40, color: '#14f195' }} />
              Kitchen Challenge
            </GameTitle>
            <p>Prepare SOLdonald’s dishes by selecting ingredients in the correct order!</p>
            {purchasedItem ? (
              <PurchasedItem>
                <ItemImage src={purchasedItem.image} alt={purchasedItem.name} />
                <h3>{purchasedItem.name}</h3>
                <p>{purchasedItem.description}</p>
              </PurchasedItem>
            ) : (
              <p>Random dishes will be ordered. Reach 500 points to win!</p>
            )}
            <p>Complete 5 orders to level up. Don’t fail 3 orders!</p>
            <PlayButton aria-label="Start cooking game" onClick={startGame}>
              <PlayArrowIcon sx={{ fontSize: 24, color: '#000' }} />
              Start Cooking
            </PlayButton>
          </GameContainer>
        </GameOverlay>
      ) : gameStatus === 'playing' ? (
        <KitchenScene>
          <ChefCharacter ref={chefRef} />
          <TimerDisplay time={timeLeft}>
            <TimerIcon sx={{ fontSize: 28, color: timeLeft > 10 ? '#14f195' : '#ff5555' }} />
            {timeLeft}s
          </TimerDisplay>
          {currentOrder && (
            <OrderTicket>
              <OrderTitle>
                <RestaurantMenuIcon sx={{ fontSize: 24, color: '#14f195' }} />
                Order: {currentOrder.dish}
              </OrderTitle>
              <OrderIngredients>
                {currentOrder.ingredients.map((ingredient, index) => (
                  <IngredientItem key={index} completed={completedIngredients.includes(ingredient)}>
                    <FastfoodIcon sx={{ fontSize: 18, color: completedIngredients.includes(ingredient) ? '#14f195' : '#e0e0e0' }} />
                    {ingredient}
                  </IngredientItem>
                ))}
              </OrderIngredients>
              <p>Level: {level}</p>
              <p>Score: {score}</p>
              <p>Failed Orders: {failedOrders}/3</p>
            </OrderTicket>
          )}
          <DishAssembly>{renderDishAssembly()}</DishAssembly>
          <IngredientTable>{renderIngredients()}</IngredientTable>
          {showMessage && (
            <CustomerMessage>
              <ChatIcon sx={{ fontSize: 24, color: '#9945ff' }} />
              {customerMessage}
            </CustomerMessage>
          )}
        </KitchenScene>
      ) : (
        <GameOverlay>
          <GameComplete won={gameStatus === 'won'}>
            <h2>
              {gameStatus === 'won' ? (
                <>
                  <CheckCircleIcon sx={{ fontSize: 40, color: '#14f195', verticalAlign: 'middle' }} />
                  You Win!
                </>
              ) : (
                <>
                  <CancelIcon sx={{ fontSize: 40, color: '#ff5555', verticalAlign: 'middle' }} />
                  Game Over!
                </>
              )}
            </h2>
            <p>Final Score: {score}</p>
            <p>Orders Prepared: {ordersCompleted + (level - 1) * 5}</p>
            <PlayButton aria-label="Play again" onClick={restartGame}>
              <ReplayIcon sx={{ fontSize: 24, color: '#000' }} />
              Play Again
            </PlayButton>
            <PlayButton
              aria-label="Back to menu"
              backButton
              onClick={() => navigate('/menu')}
            >
              <ArrowBackIcon sx={{ fontSize: 24, color: '#000' }} />
              Back to Menu
            </PlayButton>
          </GameComplete>
        </GameOverlay>
      )}
    </GameWrapper>
  );
};

export default Game;