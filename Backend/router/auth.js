const express = require('express');
const router = express.Router();
require("../db/db");
const User = require("../model/userSchema");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

router.get('/', (req, res) => {
    res.send('router side hello');
    console.log('router side hello')
});
router.post('/register', async (req, res) => {
    try {

        const { name, email, phone, work, password, cpassword } = req.body;
        const userExist = await User.findOne({ email: email });
        if (userExist) {
            return res.status(422).json({ error: "Email is already exist" });
        } else if (password !== cpassword) {
            return res.status(422).json({ error: "passowrd not match" });
        }
        const existphone = await User.findOne({ phone: phone });
        if (existphone) {
            return res.status(422).json({ error: "phone is already exist" });
        }


        const newUser = new User({ name, email, phone, work, password, cpassword });


        const savedUser = await newUser.save();
        if (!savedUser) {
            return res.send({
                status: 0,
                message: "something went wrong",
                data: "",
            });
        }
        return res.send({
            status: 1,
            message: "Registration Successfully!",
            data: savedUser,
        });

    } catch (error) {
        if (error.message.includes("duplicate key")) {
            if (error.message.includes("email")) {
                return res.send({
                    status: 0,
                    message: "email already exist",
                    data: "",
                });
            } else if (error.message.includes("phone")) {
                return res.send({
                    status: 0,
                    message: "phone already exist ",
                    data: "",
                });
            }
        } else {
            return res.send({
                status: 0,
                message: error.message,
                data: error,
            });
        }
    }
});

router.post("/login", async (req, res) => {

    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "pls fill the data" });
        }
        const userLogin = await User.findOne({ email: email });
        // console.log(userLogin);
        if (userLogin) {
            const ismatch = await bcrypt.compare(password, userLogin.password);
            const token = await userLogin.generateAuthToken();

            console.log(token);

            res.cookie("jwttoken", token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly:true
            });

            if (!ismatch) {
                res.status(400).json({ error: "invalid credencial! pass" })
            } else {
                res.json({ message: "user login successfully!" })
            }
        } else {
            res.status(400).json({ error: "invalid credencial!" })

        }

    } catch (err) {
        console.log(err);
    }
});

// router.post('/register', async (req, res) => {
//     const { name, email, phone, work, password, cpassword } = req.body;

//     if (!name || email || !phone || !work || !password || !cpassword) {
//         return res.status(422).json({ error: "fill all fileds" });
//     }
//     try {
//         const userExist = await User.findOne({ email: email });
//         if (userExist) {
//             return res.status(422).json({ error: "Email is already exist" });
//         }
//         const user = new User({ name, email, phone, work, password, cpassword });
//         const userregister = await user.save();
//         if (userregister) {
//             res.status(201).json({ message: "user registered!" });
//         } else {
//             res.status(500).json({ err: "failed" });
//         }
//     } catch (err) {
//         console.log(err);
//     }

// });



module.exports = router;