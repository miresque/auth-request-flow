const express = require('express');
const jwt = require('jsonwebtoken');

require('dotenv').config();
const secretKey = process.env.JWT_SECRET

const router = express.Router();

const invalidCredentialsMsg = "Some of your credentials may be missing or invalid!"
const mockUser = {
    username: 'authguy',
    password: 'mypassword',
    profile: {
        firstName: 'Chris',
        lastName: 'Wolstenholme',
        age: 43
    }
};

const detailsIsValid = (user, pass) => {
    if ( user === mockUser.username &&
        pass === mockUser.password) {
        return true
    } else {
        return false
    }
}

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!detailsIsValid(username, password)) {
        return res.status(401).json({ error: invalidCredentialsMsg });
    }
    
    const token = jwt.sign({ username, password }, secretKey);
    res.status(201).json({ token });
});

router.get('/profile', (req, res) => {
    const autho = req.get('authorization').split(' ');

    try {
        jwt.verify(autho[1], secretKey);
        res.status(200).json({ profile: mockUser });
    } catch (e) {
        res.status(401).json({ error: e.message });
    }
});


module.exports = router;
