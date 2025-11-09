import React, { useState } from 'react';
import MobileIdTab from '../controls/MobileIdTab';
import { useMobileId } from '../hooks/useMobileId';

const COUNTRY_LIST = ['Estonia', 'Latvia', 'Lithuania'];

export default function MobileIdContainer({ returnUri, onAuthComplete, syncPersonalCode, syncCountry }) {
  const [mobileCountry, setMobileCountry] = useState(COUNTRY_LIST[0]);
  const [mobilePersonalCode, setMobilePersonalCode] = useState('');
  const [mobilePhoneNumber, setMobilePhoneNumber] = useState('');
  const [mobileSessionId, setMobileSessionId] = useState('');
  const [mobileCode, setMobileCode] = useState('');
  const [mobileStatus, setMobileStatus] = useState('');

  const mobileId = useMobileId();

  // Sync state when activated
  React.useEffect(() => {
    if (syncPersonalCode && !mobilePersonalCode) {
      setMobilePersonalCode(syncPersonalCode);
    }
    if (syncCountry && mobileCountry === COUNTRY_LIST[0]) {
      setMobileCountry(syncCountry);
    }
  }, [syncPersonalCode, syncCountry, mobilePersonalCode, mobileCountry]);

  const handleContinue = (params) => {
    mobileId.handleContinue(
      {
        personalCode: mobilePersonalCode,
        phoneNumber: params.phoneNumber,
        countryCode: params.countryCode
      },
      setMobileSessionId,
      setMobileCode,
      setMobileStatus,
      onAuthComplete
    );
  };

  const handleCancel = () => {
    mobileId.handleCancel(setMobileStatus, setMobileCode);
  };

  const handleReturn = () => {
    mobileId.handleReturn(returnUri, () => {
      setMobileStatus('');
      setMobileCode('');
      setMobileSessionId('');
      setMobilePersonalCode('');
      setMobilePhoneNumber('');
    });
  };

  React.useEffect(() => {
    return () => {
      mobileId.stopPolling();
    };
  }, [mobileId]);

  return (
    <MobileIdTab
      mobileCountry={mobileCountry}
      setMobileCountry={setMobileCountry}
      mobilePersonalCode={mobilePersonalCode}
      setMobilePersonalCode={setMobilePersonalCode}
      mobilePhoneNumber={mobilePhoneNumber}
      setMobilePhoneNumber={setMobilePhoneNumber}
      mobileCode={mobileCode}
      mobileStatus={mobileStatus}
      handleMobileContinue={handleContinue}
      handleMobileCancel={handleCancel}
      handleMobileReturn={handleReturn}
    />
  );
}

export { COUNTRY_LIST };

