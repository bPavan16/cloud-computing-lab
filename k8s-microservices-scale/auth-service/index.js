const express = require("express");
const app = express();
app.use(express.json());

// Demo credentials
const validCredentials = {
  username: "admin",
  password: "1234"
};

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  
  if (username === validCredentials.username && password === validCredentials.password) {
    res.json({ 
      message: `Welcome, ${username}! Login successful.`, 
      success: true,
      user: { username, role: "admin" }
    });
  } else {
    res.status(401).json({ 
      message: "Invalid credentials. Use admin/1234", 
      success: false 
    });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "Auth service is running" });
});

app.listen(3000, () => console.log("Auth service running on port 3000"));