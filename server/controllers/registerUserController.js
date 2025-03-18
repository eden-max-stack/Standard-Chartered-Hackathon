const express = require('express');

const registerUser = async(req, res) => {

    const { uid, name, email } = req.body;

    if (!uid || !name || !email ) return res.status(400).json({ message: 'All fields are required.' });

    try {
        // check if user already exists
        let user = await Role.findOne({ uid });
        if (user) return res.status(409).json({ message: 'User already exists.' });

        user = new Role({ uid, name, email });
        await user.save();


        return res.status(201).json({ message: 'User registered succesfully.', user });
    } catch (error) {
        console.error('error: ', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { registerUser };