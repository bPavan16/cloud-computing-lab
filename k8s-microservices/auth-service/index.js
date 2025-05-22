const express = require("express");
const app = express();
app.use(express.json());

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  res.json({ message: `Hello, ${username}` });
});

app.listen(3000, () => console.log("Auth running on port 3000"));
