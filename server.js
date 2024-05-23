const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

const KEYCLOAK_CLIENT_ID = "backend-service";
const KEYCLOAK_CLIENT_SECRET = "HP37ArvXQm7qCNse4cM0CRLJTXj3Zqsa"; // your client secret
const KEYCLOAK_REALM = "quarkus";
const KEYCLOAK_SERVER_URL = "http://localhost:8100";
const REDIRECT_URI = "http://localhost:3000/callback"; // your client's redirect URI

app.get('/login', (req, res) => {
  const authUrl = `${KEYCLOAK_SERVER_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/auth?client_id=${encodeURIComponent(KEYCLOAK_CLIENT_ID)}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=openid`;
  res.redirect(authUrl);
});

app.get('/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const response = await axios.post(`${KEYCLOAK_SERVER_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`, new URLSearchParams({
      client_id: KEYCLOAK_CLIENT_ID,
      client_secret: KEYCLOAK_CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
      code,
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const { access_token, refresh_token, id_token } = response.data;
    // Here you can store/use the tokens as needed
    res.json({ access_token, refresh_token, id_token });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});