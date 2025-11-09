import React, { useState, useEffect } from 'react';
import './App.css';
import MobileIdContainer from './containers/MobileIdContainer';
import SmartIdContainer from './containers/SmartIdContainer';
import IdCardContainer from './containers/IdCardContainer';
import { getOidcParams } from './utils/oidcParams';

function App() {
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('activeTab') || 'IdCard');

  const oidcParams = getOidcParams();
  const returnUri = oidcParams['return_uri'] || oidcParams['redirect_uri'] || oidcParams['returnUrl'] || oidcParams['redirectUrl'];

  const handleTabChange = (tab) => {
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

  const onAuthComplete = (redirectUrl) => {
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'IdCard':
        return <IdCardContainer returnUri={returnUri} onAuthComplete={onAuthComplete} />;
      case 'MobileId':
        return <MobileIdContainer returnUri={returnUri} onAuthComplete={onAuthComplete} />;
      case 'SmartId':
        return <SmartIdContainer returnUri={returnUri} onAuthComplete={onAuthComplete} />;
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

