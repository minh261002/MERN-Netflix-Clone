const router = require('express').Router();
const CryptoJS = require('crypto-js');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.post("/register", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString()
    })

    try {
        const user = await newUser.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json(error)
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({
            email: req.body.email
        });

        if (!user) {
            return res.status(401).json('Thông tin đăng nhập không chính xác');
        }

        const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
        const originPassword = bytes.toString(CryptoJS.enc.Utf8);

        if (originPassword !== req.body.password) {
            return res.status(401).json('Thông tin đăng nhập không chính xác');
        }

        const accessToken = jwt.sign(
            {id: user._id, isAdmin: user.isAdmin},
            process.env.SECRET_KEY,
            {expiresIn: "1d"}
        )

        const {password ,...info} = user._doc;

        res.status(200).json({...info, accessToken});
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;