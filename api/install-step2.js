export default async function handler(req, res) {
    if (req.method === 'POST') {
      const { appToken, clientToken, clientName, issuedAt } = req.body;
  
      // Vérification des données de la requête
      if (!appToken || !clientToken || !clientName) {
        return res.status(400).json({ result: false, message: 'Données manquantes' });
      }
  
      // Stockage du token (vous pouvez stocker dans une base de données ou localStorage si nécessaire)
      storeToken(appToken);
  
      // Réponse de confirmation finale
      return res.status(200).json({
        result: true,
        signedRequest: encodeSignedRequest({
          appToken,
          clientToken,
          clientName,
          issuedAt,
        }),
      });
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Méthode ${req.method} non autorisée`);
    }
  }
  
  // Fonction pour stocker le token d'application
  function storeToken(token) {
    // Logique de stockage : par exemple dans localStorage si vous travaillez côté client, 
    // ou une base de données côté serveur
    console.log('Token stocké :', token);
  }
  
  // Fonction pour encoder le signedRequest
  function encodeSignedRequest(payload) {
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = require('crypto')
      .createHmac('sha256', process.env.REACT_APP_APP_KEY)
      .update(encodedPayload)
      .digest('base64url');
    return `${signature}.${encodedPayload}`;
  }
  