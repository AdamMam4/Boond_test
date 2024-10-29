import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import CryptoJS from 'crypto-js';

function App() {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const appKey = process.env.REACT_APP_APP_KEY;

    // Simuler la récupération du signedRequest
    const signedRequest = getSignedRequest();

    if (signedRequest) {
      const decodedData = decodeSignedRequest(signedRequest, appKey);
      if (decodedData) {
        const script = decodedData.script || 'mainView'; // Ex: 'install', 'uninstall', etc.
        switch (script) {
          case 'install':
            handleInstall(decodedData);
            break;
          case 'uninstall':
            handleUninstall(decodedData);
            break;
          default:
            handleMainView(decodedData);
            break;
        }
      } else {
        setError("La requête signée n'a pas pu être décodée.");
      }
    } else {
      setError('Aucun signedRequest trouvé.');
    }
  }, []);

  const isBase64Url = (str) => {
    // Vérifier les caractères valides pour Base64URL
    const base64UrlPattern = /^[A-Za-z0-9\-_]+$/;
    return base64UrlPattern.test(str) && (str.length % 4 === 0);
  };
  
  // Décodage pour vérifier si le payload est en Base64URL et contient un JSON valide
  const decodePayload = (payload) => {
    if (!isBase64Url(payload)) {
      console.error("Le payload n'est pas en Base64URL");
      return null;
    }
    try {
      const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error("Erreur lors du décodage ou du parsing du payload:", error);
      return null;
    }
  };
  

  const decodeSignedRequest = (signedRequest, appKey) => {
    try {
      const [encodedSignature, payload] = signedRequest.split('.');
      
      if (!encodedSignature || !payload) {
        throw new Error("Format de signedRequest invalide.");
      }
  
      // Vérifier si le payload est en Base64URL
      const decodedPayload = decodePayload(payload);
      if (!decodedPayload) {
        console.error("Le payload n'est pas un JSON valide après décodage.");
        return null;
      }
  
      // Calcul de la signature attendue
      const expectedSignature = CryptoJS.HmacSHA256(payload, appKey).toString(CryptoJS.enc.Base64);
      const expectedSignatureBase64Url = expectedSignature.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  
      if (encodedSignature !== expectedSignatureBase64Url) {
        console.error("Signature non valide.");
        return null;
      }
  
      return decodedPayload;
    } catch (error) {
      console.error('Erreur lors du décodage du signedRequest:', error.message);
      return null;
    }
  };
  

  const getSignedRequest = () => {
    // Méthode réelle pour obtenir le signedRequest
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJFeGFtcGxlIiwibGFzdE5hbWUiOiJKV1QgVXNlciIsInNjcmlwdCI6Imluc3RhbGwifQ.j6ef5-5-5_something_encoded';
  };

  const handleInstall = (data) => {
    console.log("Installation réussie pour:", data);
  };

  const handleUninstall = (data) => {
    console.log("Désinstallation réussie pour:", data);
  };

  const handleMainView = (data) => {
    if (data.userToken) {
      setUserInfo(data);
    } else {
      console.error("Token utilisateur manquant.");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {userInfo ? (
          <h1>Bonjour {userInfo.firstName} {userInfo.lastName}</h1>
        ) : (
          error ? <p>{error}</p> : <p>Chargement des informations utilisateur...</p>
        )}
      </header>
    </div>
  );
}

export default App;
