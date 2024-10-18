import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Charger les variables d'environnement
    const appKey = process.env.REACT_APP_APP_KEY;
    const appReference = process.env.REACT_APP_APP_REFERENCE;
    const appCode = process.env.REACT_APP_APP_CODE;

    // Simulation de la récupération du signedRequest
    const signedRequest = getSignedRequest(); // Fonction simulée

    // Vérification que BoondManager est disponible
    if (window.BoondManager) {
      console.log('BoondManager loaded:', window.BoondManager);

      // Décoder et traiter la requête signée
      const decodedData = decodeSignedRequest(signedRequest, appKey);

      if (decodedData) {
        const script = getScriptFromRequest(); // Récupérer le "script" à partir de la requête (simulé)

        switch (script) {
          case 'install':
            handleInstall(decodedData, appCode);
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
      setError('BoondManager non disponible.');
    }
  }, []);

  // Fonction simulée pour décoder le signedRequest (comme en PHP)
  const decodeSignedRequest = (signedRequest, key) => {
    try {
      // Ici, vous pouvez adapter la logique du `signedRequestDecode` de votre exemple PHP.
      // Cette fonction doit renvoyer les données décodées si la signature est correcte.
      // Simulation pour l'exemple :
      return JSON.parse(atob(signedRequest.split('.')[1])); // Décode la charge utile du JWT
    } catch (error) {
      console.error('Erreur lors du décodage de la requête signée:', error);
      return null;
    }
  };

  const getSignedRequest = () => {
    // Simuler la récupération de `signedRequest` depuis une requête ou un paramètre d'URL
    return 'exemple.signed.request.jwt';
  };

  const getScriptFromRequest = () => {
    // Simuler la récupération du script (install, uninstall, etc.)
    return 'install'; // Par exemple, 'install', 'uninstall', ou tout autre script
  };

  const handleInstall = (data, appCode) => {
    if (data.installationCode === appCode) {
      console.log("Installation réussie avec le code:", appCode);
      // Simuler la réponse d'installation réussie
      alert("Installation réussie !");
    } else {
      console.error("Échec de l'installation : mauvais code d'installation.");
      setError("Mauvais code d'installation.");
    }
  };

  const handleUninstall = (data) => {
    if (data.clientToken) {
      console.log("Désinstallation réussie pour le client:", data.clientToken);
      // Logique pour supprimer le token
      alert("Désinstallation réussie !");
    } else {
      console.error("Erreur lors de la désinstallation.");
      setError("Erreur lors de la désinstallation.");
    }
  };

  const handleMainView = (data) => {
    if (data.userToken) {
      window.BoondManager.setAppToken(localStorage.getItem('appToken')); // Récupérer le token sauvegardé
      window.BoondManager.setUserToken(data.userToken);
      
      // Appeler l'API pour obtenir l'utilisateur actuel
      window.BoondManager.callApi('application/current-user')
        .then((response) => {
          if (response && response.data && response.data.attributes) {
            const { firstName, lastName } = response.data.attributes;
            setUserInfo({ firstName, lastName });
          } else {
            throw new Error("Impossible de récupérer les informations de l'utilisateur.");
          }
        })
        .catch((err) => {
          console.error('Erreur lors de la récupération des informations utilisateur:', err);
          setError('Erreur lors de la récupération des informations utilisateur.');
        });
    } else {
      console.error('Aucun token utilisateur fourni.');
      setError('Aucun token utilisateur fourni.');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Éditer <code>src/App.js</code> et sauvegarder pour recharger.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Apprendre React
        </a>
        {/* Affichage des informations de l'utilisateur ou des erreurs */}
        {userInfo ? (
          <div>
            <h1>Bonjour {userInfo.firstName} {userInfo.lastName}</h1>
            <p>Bienvenue dans l'application React intégrée avec BoondManager !</p>
          </div>
        ) : (
          error ? <p>{error}</p> : <p>Chargement des informations utilisateur...</p>
        )}
      </header>
    </div>
  );
}

export default App;
