import * as webeid from '@web-eid/web-eid-library/web-eid';
import { getWebEidChallenge, sendWebEidAuthToken } from '../api';

export const useIdCard = () => {
  const handleWebEidLogin = async (onComplete, onError) => {
    try {
      const lang = navigator.language.substr(0, 2);
      const { nonce, sessionId } = await getWebEidChallenge();
      const authToken = await webeid.authenticate(nonce, { lang });
      const authTokenResult = await sendWebEidAuthToken(authToken, sessionId);
      if (authTokenResult.redirectUrl) {
        if (onComplete) {
          onComplete(authTokenResult.redirectUrl);
        } else {
          window.location.href = authTokenResult.redirectUrl;
        }
      } else {
        const errorMsg = authTokenResult.error || 'Web eID login failed';
        if (onError) {
          onError(errorMsg);
        } else {
          alert(errorMsg);
        }
      }
    } catch (error) {
      console.log("Authentication failed! Error:", error);
      const errorMsg = error.message || "Web eID authentication failed";
      if (onError) {
        onError(errorMsg);
      } else {
        alert(errorMsg);
      }
    }
  };

  const handleReturn = (returnUri) => {
    if (returnUri) {
      window.location.href = returnUri;
    }
  };

  return {
    handleWebEidLogin,
    handleReturn
  };
};

