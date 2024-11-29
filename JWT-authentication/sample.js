// Node.js Backend
const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const secretKey = 'yourSecretKey';

// Mock user data
const users = [
    { id: 1, username: 'user1', password: 'password1' },
    { id: 2, username: 'user2', password: 'password2' }
];

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    console.log(req.user);
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ message: 'Token is required' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token is invalid' });
        }
        req.user = decoded;
        next();
    });
};

// Endpoint for user login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Check if user exists and password is correct
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        // Generate JWT token
        const token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
});

// Endpoint for sample data (protected)
app.get('/data', verifyToken, (req, res) => {
    res.json({ data: 'Sample data that requires authentication' });
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});


// React Frontend
import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', {
                username,
                password
            });
            const token = response.data.token;
            setToken(token);
            // Store token in localStorage or sessionStorage
            localStorage.setItem('token', token);
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const handleLogout = () => {
        setToken('');
        // Clear token from localStorage or sessionStorage
        localStorage.removeItem('token');
    };

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/data', {
                headers: {
                    'Authorization': token
                }
            });
            console.log('Data:', response.data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit">Login</button>
            </form>
            <button onClick={handleLogout}>Logout</button>
            <button onClick={fetchData}>Fetch Data</button>
        </div>
    );
};

export default App;
