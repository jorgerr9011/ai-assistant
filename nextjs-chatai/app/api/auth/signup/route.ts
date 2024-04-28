import { NextResponse } from "next/server";
import User from '@/models/User';
import bcrypt from 'bcryptjs'
import { connectDB } from "@/utils/db";
import { Usuario } from '@/types/User'

export async function POST(req: Request) {

    try {
        await connectDB()
        
        const {email, password, username} = await req.json()

        if (!password || password < 6) {

            console.log("La contraseña debe tener al menos 6 carácteres")

            return NextResponse.json({
                message: "La contraseña debe tener al menos 6 carácteres"
            }, {
            status: 400
            })
        }

        const userFound = await User.findOne({email})  
        
        if (userFound) {
            console.log("Email alredy exists")

            return NextResponse.json({
                message: "Email alredy exists"
            }, {
                status: 400
            })
        } 

        const hashed_pw = await bcrypt.hash(password, 12)

        const newUser = new User({
            email: email,
            password: hashed_pw,
            username: username,
        })

        const savedUser = await newUser.save()

        return NextResponse.json(savedUser)

    } catch (error: any) {

        console.log(error.message)

        return NextResponse.json(error.message, {
            status: 400
        })
    }
}

export async function DELETE(req: Request) {

    try {

        await connectDB()

        await User.deleteMany()

        return new NextResponse()
    } catch (error) {
        console.log(error)
    }
}
