import React, { useRef, useEffect } from 'react';

const COUNTRY_LIST = ['Estonia', 'Latvia', 'Lithuania'];

export default function SmartIdTab(props) {
  const {
    smartCountry,
    setSmartCountry,
    smartPersonalCode,
    setSmartPersonalCode,
    smartCode,
    smartStatus,
    handleSmartContinue,
    handleSmartCancel,
    handleSmartReturn
  } = props;

  const isCancelled = smartStatus === 'Authentication cancelled';
  const isError = smartStatus && smartStatus.startsWith('Error');
  const isPolling = smartCode && !isCancelled && !isError;

  const personalCodeRef = useRef(null);

  // Autofill workaround: update state if browser autocompletes fields
  useEffect(() => {
    const interval = setInterval(() => {
      if (personalCodeRef.current && personalCodeRef.current.value !== smartPersonalCode) {
        setSmartPersonalCode(personalCodeRef.current.value);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [smartPersonalCode, setSmartPersonalCode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSmartContinue();
  };

  return (
    <div>
      <div>Login with SmartId</div>
      {smartCode && (
        <div style={{ marginTop: '16px', color: '#1976d2' }}>
          <strong>Authentication Code:</strong> {smartCode}
        </div>
      )}
      {smartStatus && (
        <div style={{ marginTop: '8px', color: isError ? '#d32f2f' : '#1976d2' }}>{smartStatus}</div>
      )}
      <form onSubmit={handleSubmit} autoComplete="on">
        <div className="input-group" style={{ marginTop: '16px', marginBottom: 0, display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
          <label style={{ width: '140px', textAlign: 'right', marginRight: '16px' }}>Country</label>
          <select
            className="dropdown-box"
            name="smartCountry"
            value={smartCountry}
            onChange={e => setSmartCountry(e.target.value)}
            style={{ width: '220px' }}
            disabled={isPolling}
          >
            {COUNTRY_LIST.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>
        <div className="input-group" style={{ display: 'flex', alignItems: 'center', marginTop: '8px', flexDirection: 'row', justifyContent: 'center' }}>
          <label style={{ width: '140px', textAlign: 'right', marginRight: '16px' }}>Personal Code</label>
          <input
            type="text"
            name="personalCode"
            placeholder="Personal Code"
            className="input-box"
            ref={personalCodeRef}
            value={smartPersonalCode}
            onChange={e => setSmartPersonalCode(e.target.value)}
            style={{ width: '220px' }}
            autoComplete="personalCode"
            disabled={isPolling}
          />
        </div>
        <button
          className="continue-btn return-btn"
          type="button"
          onClick={handleSmartReturn}
        >
          Return
        </button>
        {isPolling && (
          <button className="cancel-btn" type="button" onClick={handleSmartCancel}>
            Cancel
          </button>
        )}
        {!isPolling && (
          <button className="continue-btn" type="submit">
            Continue
          </button>
        )}
      </form>
    </div>
  );
}
