import React, { useEffect, useState } from 'react';
import jwtDecode from 'jsonwebtoken'; // Importation de jsonwebtoken
import { Buffer } from 'buffer';
window.Buffer = Buffer;

import crypto from 'crypto-browserify';
window.crypto = crypto;

import stream from 'stream-browserify';
window.stream = stream;

const App = () => {
  const [appKey, setAppKey] = useState('');
  const [appReference, setAppReference] = useState('');
  const [appCode, setAppCode] = useState('');

  // Simule la récupération d'un signedRequest
  const getSignedRequest = () => {
    const signedRequest = 'exemple.signed.request.jwt'; // Remplacez par la récupération réelle du signedRequest
    console.log("Signed Request reçu:", signedRequest);
    return signedRequest;
  };

  // Fonction pour décoder en toute sécurité le signedRequest
  const decodeSignedRequest = (signedRequest, secretKey) => {
    try {
      const decoded = jwtDecode(signedRequest, secretKey); // Décodage sécurisé du JWT
      console.log("Données décodées:", decoded);
      return decoded;
    } catch (error) {
      console.error('Erreur lors du décodage de la requête signée:', error);
      return null;
    }
  };

  useEffect(() => { 
    // Appel pour obtenir le signedRequest
    const signedRequest = getSignedRequest();

    // Décodage du signedRequest
    const secretKey = 'votre_clé_secrète'; // Clé secrète utilisée pour signer le JWT
    const decodedRequest = decodeSignedRequest(signedRequest, secretKey);

    // Si le décodage a réussi, mettez à jour les états avec les valeurs extraites
    if (decodedRequest) {
      setAppKey(decodedRequest.appKey || '');
      setAppReference(decodedRequest.appReference || '');
      setAppCode(decodedRequest.appCode || '');
    }
  }, []);

  return (
    <div>
      <h1>Informations décodées</h1>
      <p><strong>App Key:</strong> {appKey}</p>
      <p><strong>App Reference:</strong> {appReference}</p>
      <p><strong>App Code:</strong> {appCode}</p>
    </div>
  );
};

export default App;
