import {connectDB} from '@/utils/db'
import Incidence from '@/models/Incidence' 
import User from '@/models/User' 
import { NextResponse } from 'next/server'

export async function GET(req: Request, { params }: any) {

    try {

        await connectDB()

        const { email } = params
        const userFound = await User.findOne({email})

        //console.log(userFound)

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
        //const userUpdated = await User.findOneAndUpdate({ email }, body)

        return NextResponse.json(userUpdated)

    } catch (error: any) {

        console.log(error.message)

        return NextResponse.json(error.message, {
            status: 400
        })
    }
}
