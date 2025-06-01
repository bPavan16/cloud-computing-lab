const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;
const mongoURL = "mongodb://localhost:27017";

// Get the current directory
const currentDir = __dirname;
console.log('Current directory:', currentDir);

// Check if page.html exists in the current directory
const pageHtmlPath = path.join(currentDir, 'public', 'page.html');
fs.access(pageHtmlPath, fs.constants.F_OK, (err) => {
  console.log(`${pageHtmlPath} ${err ? 'does not exist' : 'exists'}`);
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from both the 'public' directory and the current directory
app.use(express.static(path.join(currentDir, 'public')));
app.use(express.static(currentDir));

// Database connection function
async function connectDB() {
  const client = new MongoClient(mongoURL);
  await client.connect();
  return { client, collection: client.db("registration").collection("users") };
}

// CREATE - Register a new user
app.post('/api/users', async (req, res) => {
  const { name, email } = req.body;

  try {
    const { client, collection } = await connectDB();
    await collection.insertOne({ name, email, createdAt: new Date() });
    client.close();

    res.status(201).json({ success: true, message: "User registered successfully!" });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ success: false, message: "Error registering user" });
  }
});

// READ - Get all users
app.get('/api/users', async (req, res) => {
  try {
    const { client, collection } = await connectDB();
    const users = await collection.find({}).toArray();
    client.close();

    res.json({ success: true, data: users });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ success: false, message: "Error fetching users" });
  }
});

// READ - Get a single user
app.get('/api/users/:id', async (req, res) => {
  try {
    const { client, collection } = await connectDB();
    const user = await collection.findOne({ _id: new ObjectId(req.params.id) });
    client.close();

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, data: user });
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ success: false, message: "Error fetching user" });
  }
});

// UPDATE - Update a user
app.put('/api/users/:id', async (req, res) => {
  const { name, email } = req.body;
  
  try {
    const { client, collection } = await connectDB();
    const result = await collection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { name, email, updatedAt: new Date() } }
    );
    client.close();

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "User updated successfully!" });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ success: false, message: "Error updating user" });
  }
});

// DELETE - Delete a user
app.delete('/api/users/:id', async (req, res) => {
  try {
    const { client, collection } = await connectDB();
    const result = await collection.deleteOne({ _id: new ObjectId(req.params.id) });
    client.close();

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "User deleted successfully!" });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ success: false, message: "Error deleting user" });
  }
});

// Define a specific route for the homepage - try multiple possible locations
app.get('/', (req, res) => {
  const possibleLocations = [
    path.join(currentDir, 'public', 'page.html'),
    path.join(currentDir, 'page.html')
  ];
  
  // Try each location until we find one that exists
  for (const location of possibleLocations) {
    if (fs.existsSync(location)) {
      console.log(`Serving page from: ${location}`);
      return res.sendFile(location);
    }
  }
  
  // If we couldn't find the file, send a helpful error
  res.status(404).send(`
    <h1>Page Not Found</h1>
    <p>The page.html file could not be found in any of these locations:</p>
    <ul>
      ${possibleLocations.map(loc => `<li>${loc}</li>`).join('')}
    </ul>
    <p>Current directory: ${currentDir}</p>
  `);
});

// API 404 handler (for API routes only)
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: "API endpoint not found" });
});

// Serve the frontend for any other route
app.get('*', (req, res) => {
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
  console.log(`Current directory: ${currentDir}`);
  console.log(`Looking for page.html in: ${path.join(currentDir, 'public', 'page.html')}`);
});