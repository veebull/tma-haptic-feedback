import { motion, useAnimation } from 'framer-motion';
import { useRef, useCallback, useEffect, useState } from 'react';
import './App.css';
import WebApp from '@twa-dev/sdk';
import { Button } from './components/ui/button';
import hapticPatterns from './config/hapticPatterns.json';
import { Github } from 'lucide-react';
import QRCode from 'react-qr-code';
import { HapticButton } from './components/HapticButton';

// Types for better type safety
type HapticType =
  | 'light'
  | 'medium'
  | 'heavy'
  | 'rigid'
  | 'soft'
  | 'error'
  | 'success'
  | 'warning'
  | 'none';

type HapticStep = {
  type: HapticType;
  delay: number | string;
  isNotification?: boolean;
};

type HapticPattern = {
  sequence: HapticStep[];
  repeat: number;
};

// Single impact button configuration
const singleImpactButtons = [
  {
    name: 'Light Impact',
    type: 'light',
    variant: 'outline',
    isNotification: false,
  },
  {
    name: 'Medium Impact',
    type: 'medium',
    variant: 'outline',
    isNotification: false,
  },
  {
    name: 'Heavy Impact',
    type: 'heavy',
    variant: 'outline',
    isNotification: false,
  },
  {
    name: 'Rigid Impact',
    type: 'rigid',
    variant: 'outline',
    isNotification: false,
  },
  {
    name: 'Soft Impact',
    type: 'soft',
    variant: 'outline',
    isNotification: false,
  },
  {
    name: 'Error Notification',
    type: 'error',
    variant: 'outline',
    isNotification: true,
  },
  {
    name: 'Success Notification',
    type: 'success',
    variant: 'outline',
    isNotification: true,
  },
  {
    name: 'Warning Notification',
    type: 'warning',
    variant: 'outline',
    isNotification: true,
  },
  { name: 'Selection Changed', type: 'selection', variant: 'outline' },
] as const;

function App() {
  const [isMobileTWA, setIsMobileTWA] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const buttonControls = useRef(Array(singleImpactButtons.length).fill(null).map(() => useAnimation()));

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
      case 'selection':
        return 3;
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
      case 'selection':
        return 1;
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
      case 'selection':
        return 1.08;
      default:
        return 1;
    }
  };

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileDevice = /iphone|ipad|ipod|android/.test(userAgent);
    setIsMobile(isMobileDevice);

    console.log('WEBAPP.READY', WebApp.ready());
    setIsMobileTWA(
      WebApp.ready() !== undefined &&
        (WebApp.platform === 'android' || WebApp.platform === 'ios')
    );
  }, []);

  const cleanupRef = useRef<(() => void) | null>(null);

  const stopCurrentHaptic = useCallback(() => {
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }
  }, []);

  const executeHapticSequence = async (pattern: HapticPattern) => {
    stopCurrentHaptic();

    let isPlaying = true;
    cleanupRef.current = () => {
      isPlaying = false;
    };

    const { sequence, repeat } = pattern;

    try {
      for (let i = 0; i < repeat && isPlaying; i++) {
        for (const step of sequence) {
          if (!isPlaying) break;

          if (step.type === 'none') {
            // Do nothing, just wait
          } else if (step.isNotification) {
            await WebApp.HapticFeedback.notificationOccurred(
              step.type as 'error' | 'success' | 'warning'
            );
          } else {
            await WebApp.HapticFeedback.impactOccurred(
              step.type as Exclude<
                HapticType,
                'error' | 'success' | 'warning' | 'none'
              >
            );
          }

          const delay =
            typeof step.delay === 'string' && step.delay.startsWith('random:')
              ? Math.random() * parseInt(step.delay.split(':')[1])
              : step.delay;

          await new Promise((resolve) => setTimeout(resolve, Number(delay)));
        }
      }
    } finally {
      if (cleanupRef.current) {
        cleanupRef.current = null;
      }
    }
  };

  const handleSingleImpact = async (button: (typeof singleImpactButtons)[number], index: number) => {
    const controls = buttonControls.current[index];
    
    // Trigger haptic feedback
    if (button.type === 'selection') {
      WebApp.HapticFeedback.selectionChanged();
    } else if (button.isNotification) {
      WebApp.HapticFeedback.notificationOccurred(
        button.type as 'error' | 'success' | 'warning'
      );
    } else {
      WebApp.HapticFeedback.impactOccurred(
        button.type as Exclude<HapticType, 'error' | 'success' | 'warning' | 'none'>
      );
    }

    // Animate the button
    await controls.start({
      x: [0, getShakeIntensity(button.type), -getShakeIntensity(button.type), 0],
      rotate: [0, getRotateIntensity(button.type), -getRotateIntensity(button.type), 0],
      scale: [1, getScaleIntensity(button.type), getScaleIntensity(button.type), 1],
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        x: {
          duration: 0.3,
          times: [0, 0.2, 0.8, 1],
          ease: "easeInOut"
        },
        rotate: {
          duration: 0.3,
          times: [0, 0.2, 0.8, 1],
          ease: "easeInOut"
        },
        scale: {
          duration: 0.3,
          times: [0, 0.2, 0.8, 1],
          ease: "easeInOut"
        }
      }
    });

    // Reset to initial state
    await controls.start({
      x: 0,
      rotate: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    });
  };

  const hapticSequences = Object.entries(hapticPatterns).reduce(
    (acc, [category, patterns]) => {
      Object.entries(patterns).forEach(([name, pattern]) => {
        acc[`${category}_${name}`] = {
          name,
          category,
          execute: () => {
            executeHapticSequence(pattern as HapticPattern);
          },
        };
      });
      return acc;
    },
    {} as Record<
      string,
      { name: string; category: string; execute: () => void }
    >
  );

  const renderHapticPatternButton = (key: string, pattern: any, name: string, category: string) => {
    return (
      <HapticButton
        key={key}
        pattern={pattern}
        name={name}
        category={category}
        onClick={() => hapticSequences[`${category}_${name}`].execute()}
      />
    );
  };

  return (
    <>
      <div className='flex flex-col items-center mt-4 mb-2 gap-4'>
        <a
          href='https://github.com/veebull/tma-haptic-feedback'
          target='_blank'
          rel='noopener noreferrer'
          className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors'
        >
          <Github className='h-4 w-4' />
          <span className='text-sm font-medium'>GitHub</span>
        </a>

        {!isMobileTWA && !isMobile && (
          <div className='flex flex-col items-center gap-2 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg'>
            <p className='text-xl text-black dark:text-white font-black'>
              Haptic feedback works only in iOS and Android devices.
            </p>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              For full haptic feedback functionality, please open this page in
              the Telegram <b>Mobile</b> App
            </p>
            <QRCode
              value='https://t.me/supertmabot/haptic'
              size={256}
              className='bg-white p-2 rounded'
            />
            <a
              href='https://t.me/supertmabot/haptic'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-500 hover:text-blue-600 text-sm'
            >
              Open directly
            </a>
          </div>
        )}
      </div>

      <h1 className='text-3xl font-bold mb-6 text-center'>
        Haptic Feedback Library for iOS and Android
      </h1>

      <h2 className='text-2xl font-semibold mb-2'>Single Haptic Impacts</h2>
      <div className='grid grid-cols-2 gap-2 w-full mb-4'>
        {singleImpactButtons.map((button, index) => (
          <motion.div
            key={button.name}
            initial={{ x: 0, rotate: 0, scale: 1 }}
            animate={buttonControls.current[index]}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant={button.variant}
              onClick={() => handleSingleImpact(button, index)}
              className="w-full"
            >
              {button.name}
            </Button>
          </motion.div>
        ))}
      </div>

      <h2 className='text-2xl font-semibold mb-2'>Haptic Sequences</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {Object.entries(hapticPatterns).map(([category, patterns]) => (
          <div key={category} className="space-y-4">
            <h3 className="text-xl font-bold capitalize">{category}</h3>
            <div className="grid gap-4">
              {Object.entries(patterns).map(([name, pattern]) => 
                renderHapticPatternButton(`${category}_${name}`, pattern, name, category)
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
