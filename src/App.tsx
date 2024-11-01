import { useRef, useCallback, useEffect, useState } from 'react';
import './App.css';
import WebApp from '@twa-dev/sdk';
import { Button } from './components/ui/button';
import hapticPatterns from './config/hapticPatterns.json';
import { Github } from 'lucide-react';
import QRCode from 'react-qr-code';
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
  const [isTWA, setIsTWA] = useState(true);

  useEffect(() => {
    // Check if we're running in TWA mode and on mobile
    console.log('WEBAPP.READY', WebApp.ready());
    setIsTWA(WebApp.ready() !== undefined && WebApp.platform !== 'unknown');
  }, []);

  // Use a ref to store the cleanup function of the current haptic sequence
  const cleanupRef = useRef<(() => void) | null>(null);

  const stopCurrentHaptic = useCallback(() => {
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }
  }, []);

  const executeHapticSequence = async (pattern: HapticPattern) => {
    // Stop any currently playing sequence
    stopCurrentHaptic();

    let isPlaying = true;
    // Store the cleanup function
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

  const handleSingleImpact = (button: (typeof singleImpactButtons)[number]) => {
    // Stop any currently playing sequence
    stopCurrentHaptic();

    if (button.type === 'selection') {
      WebApp.HapticFeedback.selectionChanged();
    } else if (button.isNotification) {
      WebApp.HapticFeedback.notificationOccurred(
        button.type as 'error' | 'success' | 'warning'
      );
    } else {
      WebApp.HapticFeedback.impactOccurred(
        button.type as Exclude<
          HapticType,
          'error' | 'success' | 'warning' | 'none'
        >
      );
    }
  };

  // Create a flat map of all patterns for easier access
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

        {!isTWA && (
          <div className='flex flex-col items-center gap-2 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg'>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              For full haptic feedback functionality, please open this page in
              the Telegram Mobile App
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
        {singleImpactButtons.map((button) => (
          <Button
            key={button.name}
            variant={button.variant}
            onClick={() => handleSingleImpact(button)}
          >
            {button.name}
          </Button>
        ))}
      </div>

      <h2 className='text-2xl font-semibold mb-2'>Haptic Sequences</h2>
      {Object.entries(hapticPatterns).map(([category, _]) => (
        <div key={category} className='mb-4'>
          <h4 className='text-lg font-semibold capitalize mb-2'>{category}</h4>
          <div className='grid grid-cols-2 gap-2'>
            {Object.entries(hapticSequences)
              .filter(([key]) => key.startsWith(category))
              .map(([key, { name, execute }]) => (
                <Button key={key} variant='outline' onClick={execute}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Button>
              ))}
          </div>
        </div>
      ))}
    </>
  );
}

export default App;
