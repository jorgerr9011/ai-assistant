import { NextResponse } from "next/server";
import User from '@/models/User';
import bcrypt from 'bcryptjs'
import { connectDB } from "@/utils/db";
import { ObjectId } from "mongoose";

interface Usuario {
    email: string;
    password: string;
    username: string;
    _id: ObjectId; // Specify the _id property type
}

export async function POST(req: Request) {

    try {
        await connectDB()
        
        const {username, email, password} = await req.json()

        if (!password || password < 6) {
            return NextResponse.json({
                message: "La contraseña debe tener al menos 6 carácteres"
            }, {
            status: 400
            })
        }

        const userFound = await User.findOne({email})  
        
        if (userFound) {
            return NextResponse.json({
                message: "Email alredy exists"
            }, {
                status: 400
            })
        } 

        const hashed_pw = await bcrypt.hash(password, 12)

        const newUser = new User({
            email,
            hashed_pw,
            username,
        })

        const savedUser = await newUser.save()

        return NextResponse.json(savedUser)

    } catch (error: any) {
        return NextResponse.json(error.message, {
            status: 400
        })
    }
}