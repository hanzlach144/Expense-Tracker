const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

async function registerUser(req, res) {

    const user = req.body;

    try {

        const hashedPassword = await bcrypt.hash(user.password, 10);

        const sql = `
        INSERT INTO users
        (username, email, password)
        VALUES (?, ?, ?)
        `;

        db.query(
            sql,
            [
                user.username,
                user.email,
                hashedPassword
            ],
            function (error) {

                if (error) {
                    return res.status(500).json(error);
                }

                res.json({
                    message: "User Registered Successfully"
                });

            }
        );

    }

    catch (error) {

        res.status(500).json(error);

    }

}

async function loginUser(req, res) {

    const { email, password } = req.body;

    const sql = `
    SELECT * FROM users
    WHERE email = ?
    `;

    db.query(sql, [email], async function (error, results) {

        if (error) {
            return res.status(500).json(error);
        }

        if (results.length === 0) {

            return res.status(401).json({
                message: "User not found"
            });

        }

        const user = results[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {

            return res.status(401).json({
                message: "Wrong Password"
            });

        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        res.json({
            message: "Login Successful",
            token,
            user
        });

    });

}

module.exports = {
    registerUser,
    loginUser
};