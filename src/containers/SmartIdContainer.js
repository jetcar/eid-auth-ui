import React, { useState } from 'react';
import SmartIdTab from '../controls/SmartIdTab';
import { useSmartId } from '../hooks/useSmartId';

const COUNTRY_LIST = ['Estonia', 'Latvia', 'Lithuania'];

export default function SmartIdContainer({ returnUri, onAuthComplete, syncPersonalCode, syncCountry }) {
  const [smartCountry, setSmartCountry] = useState(COUNTRY_LIST[0]);
  const [smartPersonalCode, setSmartPersonalCode] = useState('');
  const [smartSessionId, setSmartSessionId] = useState('');
  const [smartCode, setSmartCode] = useState('');
  const [smartStatus, setSmartStatus] = useState('');

  const smartId = useSmartId();

  // Sync state when activated
  React.useEffect(() => {
    if (syncPersonalCode && !smartPersonalCode) {
      setSmartPersonalCode(syncPersonalCode);
    }
    if (syncCountry && smartCountry === COUNTRY_LIST[0]) {
      setSmartCountry(syncCountry);
    }
  }, [syncPersonalCode, syncCountry, smartPersonalCode, smartCountry]);

  const handleContinue = () => {
    smartId.handleContinue(
      {
        country: smartCountry,
        personalCode: smartPersonalCode
      },
      setSmartSessionId,
      setSmartCode,
      setSmartStatus,
      onAuthComplete
    );
  };

  const handleCancel = () => {
    smartId.handleCancel(setSmartStatus, setSmartCode);
  };

  const handleReturn = () => {
    smartId.handleReturn(returnUri, () => {
      setSmartStatus('');
      setSmartCode('');
      setSmartSessionId('');
      setSmartPersonalCode('');
    });
  };

  React.useEffect(() => {
    return () => {
      smartId.stopPolling();
    };
  }, [smartId]);

  return (
    <SmartIdTab
      smartCountry={smartCountry}
      setSmartCountry={setSmartCountry}
      smartPersonalCode={smartPersonalCode}
      setSmartPersonalCode={setSmartPersonalCode}
      smartCode={smartCode}
      smartStatus={smartStatus}
      handleSmartContinue={handleContinue}
      handleSmartCancel={handleCancel}
      handleSmartReturn={handleReturn}
    />
  );
}

export { COUNTRY_LIST };

