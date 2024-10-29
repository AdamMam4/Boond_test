export default async function handler(req, res) {
    if (req.method === 'POST') {
      const { installationCode, clientToken, issuedAt } = req.body;
  
      // Logique d'installation initiale
      if (!installationCode || !clientToken || !issuedAt) {
        return res.status(400).json({ result: false, message: 'Données manquantes' });
      }
  
      // Simulation de réponse réussie
      return res.status(200).json({
        result: true,
        signedRequest: encodeSignedRequest({
          installationCode,
          clientToken,
          issuedAt,
        }),
      });
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Méthode ${req.method} non autorisée`);
    }
  }
  
  // Fonction pour encoder le signedRequest comme dans la doc
  function encodeSignedRequest(payload) {
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = require('crypto')
      .createHmac('sha256', process.env.REACT_APP_APP_KEY)
      .update(encodedPayload)
      .digest('base64url');
    return `${signature}.${encodedPayload}`;
  }
  