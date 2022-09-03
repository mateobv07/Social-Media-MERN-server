import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js'

export const signIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if(!existingUser) return res.satus(404),json({ message: "User does not exist"})

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if(!isPasswordCorrect) return res.satus(400),json({ message: "Invalid credentials"})

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id}, 'test', { expiresIn: "1h"});

        res.status(200).json({ result: existingUser, token: token })
    } catch (error){
        res.status(500).json({ message: "Something wwent wrong" })
    }
} 

export const signUp = async (req, res) => {

} 