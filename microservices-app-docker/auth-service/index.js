const express = require('express');
const app = express();
app.use(express.json());

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "1234") {
    res.json({ message: "Login successful" });
  } else {
    res.json({ message: "Login failed" });
  }
});

app.listen(5001, () => console.log("Auth service running on port 5001"));