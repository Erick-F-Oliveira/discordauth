require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;


const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

app.get('/', (req, res) => {
    res.send('<a href="/login">Login com Discord</a>');
});

app.get('/login', (req, res) => {
    const authorizeUrl = REDIRECT_URI;
    res.redirect(authorizeUrl);
});

app.get('/callback', async (req, res) => {
    const code = req.query.code;
    const tokenUrl = 'https://discord.com/api/oauth2/token';

    try {
        const response = await axios.post(tokenUrl, new URLSearchParams({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: REDIRECT_URI
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const accessToken = response.data.access_token;

        const userResponse = await axios.get('https://discord.com/api/users/@me', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const userInfo = userResponse.data;
        console.log(userInfo);
        res.send(`Logged in as ${userInfo.username}#${userInfo.discriminator}`);
    } catch (error) {
        console.error(error);
        res.send('Error during authentication');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
