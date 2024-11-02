import { motion, useAnimationControls } from 'framer-motion';
import { useMemo, useState } from 'react';

interface HapticStep {
  type: string;
  delay: number | string;
  isNotification?: boolean;
}

interface HapticPattern {
  sequence: HapticStep[];
  repeat: number;
}

interface HapticButtonProps {
  pattern: HapticPattern;
  name: string;
  category: string;
  onClick: () => void;
}

const getIntensityScale = (type: string) => {
  switch (type) {
    case 'heavy':
      return 1.3;
    case 'rigid':
      return 1.25;
    case 'medium':
      return 1.2;
    case 'light':
      return 1.15;
    case 'soft':
      return 1.1;
    case 'error':
      return 1.4;
    case 'success':
      return 1.3;
    case 'warning':
      return 1.35;
    case 'none':
      return 1;
    default:
      return 1;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'error':
      return '#ff4444';
    case 'success':
      return '#00C851';
    case 'warning':
      return '#ffbb33';
    case 'heavy':
      return '#7c4dff';
    case 'rigid':
      return '#ff4081';
    case 'medium':
      return '#00bcd4';
    case 'light':
      return '#4CAF50';
    case 'soft':
      return '#03a9f4';
    case 'none':
      return '#808080';
    default:
      return '#808080';
  }
};

const getShakeIntensity = (type: string) => {
  switch (type) {
    case 'heavy':
      return 8;
    case 'rigid':
      return 6;
    case 'medium':
      return 4;
    case 'light':
      return 2;
    case 'soft':
      return 1;
    case 'error':
      return 10;
    case 'success':
      return 6;
    case 'warning':
      return 8;
    case 'none':
      return 0;
    default:
      return 0;
  }
};

const getRotateIntensity = (type: string) => {
  switch (type) {
    case 'heavy':
      return 3;
    case 'rigid':
      return 2;
    case 'medium':
      return 1.5;
    case 'light':
      return 1;
    case 'soft':
      return 0.5;
    case 'error':
      return 4;
    case 'success':
      return 2;
    case 'warning':
      return 3;
    case 'none':
      return 0;
    default:
      return 0;
  }
};

const getScaleIntensity = (type: string) => {
  switch (type) {
    case 'heavy':
      return 1.15;
    case 'rigid':
      return 1.12;
    case 'medium':
      return 1.1;
    case 'light':
      return 1.08;
    case 'soft':
      return 1.05;
    case 'error':
      return 1.2;
    case 'success':
      return 1.15;
    case 'warning':
      return 1.18;
    case 'none':
      return 1;
    default:
      return 1;
  }
};

export function HapticButton({
  pattern,
  name,
  category,
  onClick,
}: HapticButtonProps) {
  const controls = useAnimationControls();
  const [isAnimating, setIsAnimating] = useState(false);

  const getCategoryStyle = (category: string) => {
    const styles: Record<string, any> = {
      emotional: { background: 'linear-gradient(135deg, #ff6b6b, #ffd93d)' },
      notification: { background: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
      musical: { background: 'linear-gradient(135deg, #667eea, #764ba2)' },
      gameFeedback: { background: 'linear-gradient(135deg, #ff0844, #ffb199)' },
      continuous: { background: 'linear-gradient(135deg, #30cfd0, #330867)' },
      vehicles: { background: 'linear-gradient(135deg, #f43b47, #453a94)' },
      communication: {
        background: 'linear-gradient(135deg, #0ba360, #3cba92)',
      },
      ambient: { background: 'linear-gradient(135deg, #2af598, #009efd)' },
      status: { background: 'linear-gradient(135deg, #b721ff, #21d4fd)' },
      exercise: { background: 'linear-gradient(135deg, #fa709a, #fee140)' },
      navigation: { background: 'linear-gradient(135deg, #4481eb, #04befe)' },
      productivity: { background: 'linear-gradient(135deg, #7f7fd5, #86a8e7)' },
      weather: { background: 'linear-gradient(135deg, #89f7fe, #66a6ff)' },
      social: { background: 'linear-gradient(135deg, #ff758c, #ff7eb3)' },
      uiFeedback: { background: 'linear-gradient(135deg, #a8edea, #fed6e3)' },
    };
    return styles[category] || {};
  };

  const handleClick = async () => {
    if (isAnimating) return;

    onClick();
    setIsAnimating(true);

    // Play the sequence for the specified number of repeats
    for (let r = 0; r < pattern.repeat; r++) {
      for (const step of pattern.sequence) {
        const delay =
          typeof step.delay === 'string'
            ? Math.random() * parseInt(step.delay.split(':')[1])
            : step.delay;

        if (step.type === 'none') {
          await new Promise((resolve) => setTimeout(resolve, delay));
        } else {
          await controls.start({
            x: [
              0,
              getShakeIntensity(step.type),
              -getShakeIntensity(step.type),
              0,
            ],
            rotate: [
              0,
              getRotateIntensity(step.type),
              -getRotateIntensity(step.type),
              0,
            ],
            scale: [1, getScaleIntensity(step.type), getScaleIntensity(step.type), 1],
            backgroundColor: getTypeColor(step.type),
            transition: {
              duration: delay / 1000,
              ease: 'easeInOut',
              x: {
                duration: delay / 1000,
                times: [0, 0.2, 0.8, 1],
                ease: 'easeInOut',
              },
              rotate: {
                duration: delay / 1000,
                times: [0, 0.2, 0.8, 1],
                ease: 'easeInOut',
              },
              scale: {
                duration: delay / 1000,
                times: [0, 0.2, 0.8, 1],
                ease: 'easeInOut',
              },
            },
          });
        }
      }
    }

    // Reset to initial state
    await controls.start({
      x: 0,
      rotate: 0,
      scale: 1,
      backgroundColor: 'transparent',
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    });

    setIsAnimating(false);
  };

  return (
    <motion.button
      className={`haptic-button ${isAnimating ? 'animating' : ''}`}
      animate={controls}
      initial={{
        x: 0,
        rotate: 0,
        scale: 1,
        backgroundColor: 'transparent',
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      style={{
        ...getCategoryStyle(category),
        position: 'relative',
        padding: '1rem',
        borderRadius: '0.5rem',
        border: 'none',
        cursor: 'pointer',
        overflow: 'hidden',
        minHeight: '100px',
        width: '100%',
      }}
    >
      <motion.div
        className='button-content'
        style={{
          position: 'relative',
          zIndex: 1,
          color: '#fff',
          fontWeight: 'bold',
        }}
      >
        {name}
        {isAnimating && (
          <motion.div
            className='animation-indicator'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              fontSize: '0.8em',
              marginTop: '0.5rem',
              opacity: 0.8,
            }}
          >
            ● Playing
          </motion.div>
        )}
      </motion.div>

      {/* Particles for active animation */}
    </motion.button>
  );
}
