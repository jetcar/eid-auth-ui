import React, { useState, useEffect } from 'react';
import './App.css';
import MobileIdTab from './controls/MobileIdTab';
import SmartIdTab from './controls/SmartIdTab';
import IdCardTab from './controls/IdCardTab';
import { getOidcParams } from './utils/oidcParams';
import { useMobileId } from './hooks/useMobileId';
import { useSmartId } from './hooks/useSmartId';
import { useIdCard } from './hooks/useIdCard';

const COUNTRY_LIST = ['Estonia', 'Latvia', 'Lithuania'];

function App() {
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('activeTab') || 'IdCard');
  const [mobileCountry, setMobileCountry] = useState(COUNTRY_LIST[0]);
  const [mobilePersonalCode, setMobilePersonalCode] = useState('');
  const [mobilePhoneNumber, setMobilePhoneNumber] = useState('');
  const [mobileSessionId, setMobileSessionId] = useState(''); // eslint-disable-line no-unused-vars
  const [mobileCode, setMobileCode] = useState('');
  const [mobileStatus, setMobileStatus] = useState('');
  const [smartCountry, setSmartCountry] = useState(COUNTRY_LIST[0]);
  const [smartPersonalCode, setSmartPersonalCode] = useState('');
  const [smartSessionId, setSmartSessionId] = useState(''); // eslint-disable-line no-unused-vars
  const [smartCode, setSmartCode] = useState('');
  const [smartStatus, setSmartStatus] = useState('');

  const mobileId = useMobileId();
  const smartId = useSmartId();
  const idCard = useIdCard();

  const oidcParams = getOidcParams();
  const returnUri = oidcParams['return_uri'] || oidcParams['redirect_uri'] || oidcParams['returnUrl'] || oidcParams['redirectUrl'];

  const handleTabChange = (tab) => {
    if (tab === 'MobileId' && !mobilePersonalCode && smartPersonalCode) {
      setMobilePersonalCode(smartPersonalCode);
    }
    if (tab === 'SmartId' && !smartPersonalCode && mobilePersonalCode) {
      setSmartPersonalCode(mobilePersonalCode);
    }
    if (tab === 'MobileId' && mobileCountry === COUNTRY_LIST[0] && smartCountry !== COUNTRY_LIST[0]) {
      setMobileCountry(smartCountry);
    }
    if (tab === 'SmartId' && smartCountry === COUNTRY_LIST[0] && mobileCountry !== COUNTRY_LIST[0]) {
      setSmartCountry(mobileCountry);
    }
    setActiveTab(tab);
    localStorage.setItem('activeTab', tab);
  };

  useEffect(() => {
    const lastTab = localStorage.getItem('activeTab');
    if (lastTab && lastTab !== activeTab) {
      setActiveTab(lastTab);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    return () => {
      mobileId.stopPolling();
      smartId.stopPolling();
    };
  }, [activeTab, mobileId, smartId]);

  const onAuthComplete = (redirectUrl) => {
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'IdCard':
        return (
          <IdCardTab
            handleIdCardReturn={() => idCard.handleReturn(returnUri)}
            handleWebEidLogin={(onComplete, onError) => idCard.handleWebEidLogin(onComplete || onAuthComplete, onError)}
          />
        );
      case 'MobileId':
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
            handleMobileContinue={(params) =>
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
              )
            }
            handleMobileCancel={() => mobileId.handleCancel(setMobileStatus, setMobileCode)}
            handleMobileReturn={() =>
              mobileId.handleReturn(returnUri, () => {
                setMobileStatus('');
                setMobileCode('');
                setMobileSessionId('');
                setMobilePersonalCode('');
                setMobilePhoneNumber('');
              })
            }
          />
        );
      case 'SmartId':
        return (
          <SmartIdTab
            smartCountry={smartCountry}
            setSmartCountry={setSmartCountry}
            smartPersonalCode={smartPersonalCode}
            setSmartPersonalCode={setSmartPersonalCode}
            smartCode={smartCode}
            smartStatus={smartStatus}
            handleSmartContinue={() =>
              smartId.handleContinue(
                {
                  country: smartCountry,
                  personalCode: smartPersonalCode
                },
                setSmartSessionId,
                setSmartCode,
                setSmartStatus,
                onAuthComplete
              )
            }
            handleSmartCancel={() => smartId.handleCancel(setSmartStatus, setSmartCode)}
            handleSmartReturn={() =>
              smartId.handleReturn(returnUri, () => {
                setSmartStatus('');
                setSmartCode('');
                setSmartSessionId('');
                setSmartPersonalCode('');
              })
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <h2>Login</h2>
      <div className="tab-container">
        <button
          className={activeTab === 'IdCard' ? 'active' : ''}
          onClick={() => handleTabChange('IdCard')}
        >
          IdCard
        </button>
        <button
          className={activeTab === 'MobileId' ? 'active' : ''}
          onClick={() => handleTabChange('MobileId')}
        >
          MobileId
        </button>
        <button
          className={activeTab === 'SmartId' ? 'active' : ''}
          onClick={() => handleTabChange('SmartId')}
        >
          SmartId
        </button>
      </div>
      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
}


export default App;

