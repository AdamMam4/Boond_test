import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Vérification que BoondManager est disponible
    if (window.BoondManager) {
      // Initialisation de BoondManager
      window.BoondManager.init({
        targetOrigin: '*'
      })
        .then(() => {
          // Redimensionnement automatique
          window.BoondManager.setAutoResize();
          // Récupération des informations de l'utilisateur courant
          return window.BoondManager.callApi('application/current-user');
        })
        .then((response) => {
          if (response && response.data && response.data.attributes) {
            const { firstName, lastName } = response.data.attributes;
            setUserInfo({ firstName, lastName });
          } else {
            throw new Error('User data unavailable');
          }
        })
        .catch((err) => {
          console.error('BoondManager init error:', err);
          setError('Erreur lors de l\'initialisation de BoondManager.');
        });
    } else {
      setError('BoondManager non disponible.');
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        {/* Afficher les informations de l'utilisateur si disponibles */}
        {userInfo ? (
          <div>
            <h1>Hello {userInfo.firstName} {userInfo.lastName}</h1>
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
