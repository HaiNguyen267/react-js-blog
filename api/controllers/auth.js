import { db } from '../db.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const register = (req, res) => {
    // check if email already taken
    const email = req.body.email
    const query = "SELECT * FROM users WHERE email = ?"

    db.query(query, [email], (err, data) => {
        if (err) return res.json({ error: err })
        if (data.length) return res.status(409).json({ message: "Email already taken" })

        let { username, email, password } = req.body
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)

        const query = "INSERT INTO users (username, email, password) VALUES (?)"
        db.query(query, [[username, email, hash]], (err, data) => {
            if (err) return res.json({ error: err })
            res.status(200).json({ message: "Registration successfully!", password: password })
        })



    })
}

export const login = (req, res) => {
    const email = req.body.email;

    const query = "SELECT * FROM users WHERE email = ?"

    db.query(query, [email], async (err, data) => {
        if (err) return res.json({ error: err })
        // wrong email
        if (!data.length) return res.status(404).json({ message: "Email or password is incorrect" })

        // check password
        const isPasswordCorrect = bcrypt.compareSync(
            req.body.password,
            data[0].password)

        // wrong password
        if (!isPasswordCorrect) return res.status(400).json({ message: "Email or password is incorrect", correctPassword: data[0].password, yourPassword: req.body.password, isPasswordCorrect: isPasswordCorrect })

        const token = jwt.sign({ id: data[0].id }, "process.env.JWT_SECRET")

        const { password, ...other } = data[0]
        res.cookie("access_token", token, {
            httpOnly: true
        }).status(200).json(other)
    })
}

export const logout = (req, res) => {
    res.clearCookie("access_token", {
        sameSite: true,
        secure: true
    }).status(200).json("Logged out successfully")
}