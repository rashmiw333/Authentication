const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

// app.get("/auth/google/callback", (req, res) => {
//   res.send("Google callback route is working!");
// });

app.get("/", (req, res) => {
  res.send("<h1>Welcome to OAuth API Server.</h1>");
});

app.get("/auth/github", (req, res) => {
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user,repo,security_events`;
   
  res.redirect(githubAuthUrl);
});

// app.get("/auth/github/callback", async (req, res) => {
//   const { code } = req.query;

//   try {
//     const tokenResponse = await axios.post(
//       "https://github.com/login/oauth/access_token",
//       {
//         client_id: process.env.GITHUB_CLIENT_ID,
//         client_secret: process.env.GITHUB_CLIENT_SECRET,
//         code,
//       },
//       {
//         headers: { Accept: "application/json" },
//       }
//     );

//     const accessToken = tokenResponse.data.access_token;
//     res.cookie("access_token", accessToken);
//     return res.redirect(`${process.env.FRONTEND_URL}/github.com/${username}`);
// } catch (error) {
//   res.status(500).json(error);
// }
// });


app.get("/auth/github/callback", async (req, res) => {
  const { code } = req.query;

  try {
    // Get access token
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // Get GitHub user details
    const userResponse = await axios.get(
      "https://api.github.com/user",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      }
    );

    // Get username
    const username = userResponse.data.login;

    // Redirect to GitHub profile
    res.redirect(`https://github.com/${username}`);

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send("GitHub authentication failed");
  }
});



//===================google



app.get("/auth/google", (req, res) => {
  const googleAuthUrl = new URL(
    "https://accounts.google.com/o/oauth2/v2/auth"
  );

  googleAuthUrl.searchParams.set(
    "client_id",
    process.env.GOOGLE_CLIENT_ID
  );

  googleAuthUrl.searchParams.set(
    "redirect_uri",
    `http://localhost:${PORT}/auth/google/callback`
  );

  googleAuthUrl.searchParams.set("response_type", "code");
  googleAuthUrl.searchParams.set("scope", "openid profile email");
  googleAuthUrl.searchParams.set("prompt", "select_account");

  res.redirect(googleAuthUrl.toString());
});

app.get("/auth/google/callback", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send("Authorization code not provided.");
  }

  try {
    // Exchange authorization code for access token
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: `http://localhost:${PORT}/auth/google/callback`,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // Get Google user details
    const userResponse = await axios.get(
      "https://openidconnect.googleapis.com/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log("Google User:", userResponse.data);

    // Redirect to Google Account profile page
    return res.redirect(
      "https://myaccount.google.com/profile/profiles-summary"
    );

  } catch (error) {
    console.error(
      "Google OAuth Error:",
      error.response?.data || error.message
    );

    res.status(500).send("Google authentication failed.");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});