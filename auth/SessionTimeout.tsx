import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import Button from '../components/common/Button';
import { InfoIcon } from '../components/icons/InfoIcon';

const TIMEOUT_DURATION = 10 * 60 * 1000; // 10 minutes
const WARNING_DURATION = 1 * 60 * 1000; // 1 minute

interface Props {
  onIdle: () => void;
}

const SessionTimeout: React.FC<Props> = ({ onIdle }) => {
  const { isAuthenticated } = useAuth();
  const [isWarningVisible, setWarningVisible] = useState(false);
  const [countdown, setCountdown] = useState(WARNING_DURATION / 1000);
  
  // Fix: Use explicit ReturnType for browser-specific timer functions to avoid type conflicts.
  const timeoutId = useRef<ReturnType<typeof window.setTimeout>>();
  const warningTimeoutId = useRef<ReturnType<typeof window.setTimeout>>();
  const countdownIntervalId = useRef<ReturnType<typeof window.setInterval>>();

  const startTimers = useCallback(() => {
    if (timeoutId.current) window.clearTimeout(timeoutId.current);
    if (warningTimeoutId.current) window.clearTimeout(warningTimeoutId.current);
    if (countdownIntervalId.current) window.clearInterval(countdownIntervalId.current);

    // Set new timers
    warningTimeoutId.current = window.setTimeout(() => {
      setWarningVisible(true);
      setCountdown(WARNING_DURATION / 1000);
      countdownIntervalId.current = window.setInterval(() => {
        setCountdown(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }, TIMEOUT_DURATION - WARNING_DURATION);
    
    timeoutId.current = window.setTimeout(() => {
      onIdle();
      setWarningVisible(false);
    }, TIMEOUT_DURATION);

  }, [onIdle]);

  const resetTimers = useCallback(() => {
    if (isWarningVisible) return; // Don't reset if the modal is already showing
    startTimers();
  }, [startTimers, isWarningVisible]);

  const stayActive = () => {
    setWarningVisible(false);
    startTimers(); // Directly reset timers, bypassing the guard in resetTimers
  };

  useEffect(() => {
    if (isAuthenticated) {
      startTimers();

      const events: (keyof WindowEventMap)[] = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];
      events.forEach(event => window.addEventListener(event, resetTimers));

      return () => {
        events.forEach(event => window.removeEventListener(event, resetTimers));
        if (timeoutId.current) window.clearTimeout(timeoutId.current);
        if (warningTimeoutId.current) window.clearTimeout(warningTimeoutId.current);
        if (countdownIntervalId.current) window.clearInterval(countdownIntervalId.current);
      };
    }
  }, [isAuthenticated, resetTimers, startTimers]);

  if (!isWarningVisible || !isAuthenticated) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" aria-modal="true" role="dialog">
      <div className="bg-[--color-background-main] w-full max-w-md rounded-2xl shadow-2xl flex flex-col p-6 text-center">
        <InfoIcon className="h-12 w-12 text-[--color-primary] mx-auto mb-4" />
        <h2 className="text-xl font-bold text-[--color-text-header]">Session Timeout Warning</h2>
        <p className="text-[--color-text-body] my-4">
          You have been inactive. For your security, you will be logged out in{' '}
          <span className="font-bold">{countdown}</span> seconds.
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="secondary" onClick={onIdle}>
            Logout Now
          </Button>
          <Button variant="primary" onClick={stayActive}>
            Stay Logged In
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SessionTimeout;
