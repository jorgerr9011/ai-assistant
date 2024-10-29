import { connectDB } from '@/utils/db'
import Chat from '@/models/Chat'
import Usuario from '@/models/User'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {

    try {
        const { searchParams } = new URL(req.url)
        const user = searchParams.get('user')
        await connectDB()
        
        let chats
        if (user) {
            chats = await Chat.find({ user })
        } else {
            chats = await Chat.find()
        }

        return NextResponse.json(chats)

    } catch (error: any) {
        return NextResponse.json(error.message, {
            status: 400
        })
    }
}

export async function POST(req: Request) {

    try {
        await connectDB()
        const body = await req.json();
        const chat = new Chat(body)
        const savedChat = await chat.save()

        return NextResponse.json(savedChat)

    } catch (error: any) {

        console.log(error.message)
        return NextResponse.json(error.message, {
            status: 400
        })
    }
}

/*
export async function DELETE(req: Request) {

    try {
        await connectDB()
        await Incidence.deleteMany()
        return new NextResponse()

    } catch (error: any) {

        console.log(error.message)
        return NextResponse.json(error.message, {
            status: 400
        })
    }
}
*/