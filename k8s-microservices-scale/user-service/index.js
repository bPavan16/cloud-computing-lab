const express = require('express');
const app = express();
app.use(express.json());

// Dummy users data
const dummyUsers = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "user", age: 28, department: "Engineering" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", role: "user", age: 35, department: "Marketing" },
  { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "moderator", age: 42, department: "Support" },
  { id: 4, name: "Diana Prince", email: "diana@example.com", role: "user", age: 30, department: "HR" },
  { id: 5, name: "Admin User", email: "admin@example.com", role: "admin", age: 45, department: "IT" }
];

// Get all users
app.get('/users', (req, res) => {
  res.json(dummyUsers);
});

// Get user by ID
app.get('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = dummyUsers.find(u => u.id === userId);
  
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// Get users by role
app.get('/users/role/:role', (req, res) => {
  const role = req.params.role.toLowerCase();
  const filteredUsers = dummyUsers.filter(u => u.role.toLowerCase() === role);
  res.json(filteredUsers);
});

// Get users by department
app.get('/users/department/:dept', (req, res) => {
  const department = req.params.dept;
  const filteredUsers = dummyUsers.filter(u => 
    u.department.toLowerCase() === department.toLowerCase()
  );
  res.json(filteredUsers);
});

// Create new user (dummy - just returns success message)
app.post('/users', (req, res) => {
  const { name, email, role, age, department } = req.body;
  const newUser = {
    id: dummyUsers.length + 1,
    name,
    email,
    role: role || "user",
    age: age || 25,
    department: department || "General"
  };
  
  dummyUsers.push(newUser);
  res.status(201).json({ message: "User created successfully", user: newUser });
});

// Update user (dummy - just returns success message)
app.put('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = dummyUsers.findIndex(u => u.id === userId);
  
  if (userIndex !== -1) {
    dummyUsers[userIndex] = { ...dummyUsers[userIndex], ...req.body };
    res.json({ message: "User updated successfully", user: dummyUsers[userIndex] });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// Delete user (dummy - just returns success message)
app.delete('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = dummyUsers.findIndex(u => u.id === userId);
  
  if (userIndex !== -1) {
    const deletedUser = dummyUsers.splice(userIndex, 1)[0];
    res.json({ message: "User deleted successfully", user: deletedUser });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// Get user statistics
app.get('/stats', (req, res) => {
  const stats = {
    totalUsers: dummyUsers.length,
    roleDistribution: {
      admin: dummyUsers.filter(u => u.role === 'admin').length,
      moderator: dummyUsers.filter(u => u.role === 'moderator').length,
      user: dummyUsers.filter(u => u.role === 'user').length
    },
    departmentDistribution: {}
  };
  
  dummyUsers.forEach(user => {
    if (stats.departmentDistribution[user.department]) {
      stats.departmentDistribution[user.department]++;
    } else {
      stats.departmentDistribution[user.department] = 1;
    }
  });
  
  res.json(stats);
});

app.get('/health', (req, res) => {
  res.json({ status: "User service is running" });
});

app.listen(5002, () => console.log("User service running on port 5002"));