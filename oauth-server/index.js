const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

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


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});