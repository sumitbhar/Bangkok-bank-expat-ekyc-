

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
  
  // FIX: Replaced `ReturnType<typeof ...>` with `number` for browser compatibility and to resolve type errors.
  // `ReturnType` can have issues with overloaded functions like `setTimeout` when Node.js types are present.
  // Explicitly using `number` is safer as it's the standard return type for browser timer functions.
  const timeoutId = useRef<number>();
  const warningTimeoutId = useRef<number>();
  const countdownIntervalId = useRef<number>();

  const startTimers = useCallback(() => {
    // Clear existing timers
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
    resetTimers();
  };

  useEffect(() => {
    if (isAuthenticated) {
      const events = ['mousemove', 'mousedown', 'keypress', 'touchstart', 'scroll'];
      
      const eventListener = () => resetTimers();
      
      events.forEach(event => window.addEventListener(event, eventListener));
      startTimers();

      return () => {
        events.forEach(event => window.removeEventListener(event, eventListener));
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
      <div className="bg-[--color-background-main] w-full max-w-md rounded-2xl shadow-2xl p-8 text-center">
        <InfoIcon className="h-16 w-16 mx-auto text-[--color-primary]" />
        <h2 className="text-2xl font-bold text-[--color-text-header] mt-4">Are you still there?</h2>
        <p className="text-[--color-text-body] mt-2">
          For your security, you will be logged out automatically due to inactivity in <span className="font-bold">{countdown}</span> seconds.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <Button variant="secondary" onClick={onIdle} className="w-full justify-center">
            Logout
          </Button>
          <Button variant="primary" onClick={stayActive} className="w-full justify-center">
            Stay Logged In
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SessionTimeout;