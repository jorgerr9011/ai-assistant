import {connectDB} from '@/utils/db'
import User from '@/models/User' 
import { NextResponse } from 'next/server'

export async function GET(req: Request, { params }: any) {

    try {

        await connectDB()

        const { email } = params
        const userFound = await User.findOne({email})

        return NextResponse.json(userFound)

    } catch (error: any) {
        console.log(error)

        return NextResponse.json(error.message, {
            status: 400
        })
    }
}

export async function PUT(req: Request, { params }: any) {

    try {

        await connectDB()
        
        const body = await req.json()

        const { email } = params
        const userUpdated = await User.findOneAndUpdate({ email }, body, {
            new: true
        });

        return NextResponse.json(userUpdated)

    } catch (error: any) {

        console.log(error.message)

        return NextResponse.json(error.message, {
            status: 400
        })
    }
}
