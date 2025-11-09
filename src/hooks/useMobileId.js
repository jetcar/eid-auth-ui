import { useRef } from 'react';
import { startMobileId, checkMobileId } from '../api';

export const useMobileId = () => {
  const pollingRef = useRef(null);
  const pollingActiveRef = useRef(false);
  const pollInFlightRef = useRef(false);

  const scheduleNextPoll = (sessionId, setStatus, onComplete) => {
    if (!pollingActiveRef.current) return;
    pollingRef.current = setTimeout(() => doPoll(sessionId, setStatus, onComplete), 4000);
  };

  const doPoll = async (sessionId, setStatus, onComplete) => {
    if (!pollingActiveRef.current || pollInFlightRef.current) return;
    pollInFlightRef.current = true;
    try {
      const checkData = await checkMobileId(sessionId);
      if (checkData.error) {
        setStatus(`Error: ${checkData.error}`);
        pollingActiveRef.current = false;
        return;
      }
      if (checkData.complete) {
        setStatus('Authentication complete!');
        pollingActiveRef.current = false;
        if (onComplete) {
          onComplete(checkData.redirectUrl);
        }
      } else {
        setStatus('Waiting for authentication...');
        scheduleNextPoll(sessionId, setStatus, onComplete);
      }
    } catch {
      setStatus('Error checking status');
      scheduleNextPoll(sessionId, setStatus, onComplete);
    } finally {
      pollInFlightRef.current = false;
    }
  };

  const startPolling = (sessionId, setStatus, onComplete) => {
    pollingActiveRef.current = true;
    doPoll(sessionId, setStatus, onComplete);
  };

  const stopPolling = () => {
    pollingActiveRef.current = false;
    if (pollingRef.current) {
      clearTimeout(pollingRef.current);
      pollingRef.current = null;
    }
  };

  const handleContinue = async (params, setSessionId, setCode, setStatus, onComplete) => {
    try {
      const data = await startMobileId({
        personalCode: params.personalCode,
        phoneNumber: params.phoneNumber,
        countryCode: params.countryCode
      });
      if (data?.error) {
        setStatus(`Error: ${data.error}`);
        return;
      }
      if (data && data.sessionId) {
        setSessionId(data.sessionId);
        setCode(data.code);
        setStatus('');
        stopPolling();
        startPolling(data.sessionId, setStatus, onComplete);
      } else {
        setStatus('Failed to start MobileId authentication.');
      }
    } catch {
      setStatus('Error contacting backend');
    }
  };

  const handleCancel = (setStatus, setCode) => {
    stopPolling();
    setStatus('Authentication cancelled');
    setCode('');
  };

  const handleReturn = (returnUri, resetState) => {
    if (returnUri) {
      window.location.href = returnUri;
    } else {
      resetState();
    }
  };

  return {
    handleContinue,
    handleCancel,
    handleReturn,
    stopPolling
  };
};


