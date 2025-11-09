import React from 'react';
import IdCardTab from '../controls/IdCardTab';
import { useIdCard } from '../hooks/useIdCard';

export default function IdCardContainer({ returnUri, onAuthComplete }) {
  const idCard = useIdCard();

  const handleWebEidLogin = (onComplete, onError) => {
    idCard.handleWebEidLogin(onComplete || onAuthComplete, onError);
  };

  const handleReturn = () => {
    idCard.handleReturn(returnUri);
  };

  return (
    <IdCardTab
      handleIdCardReturn={handleReturn}
      handleWebEidLogin={handleWebEidLogin}
    />
  );
}

