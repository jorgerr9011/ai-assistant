import {connectDB} from '@/utils/db'
import Incidence from '@/models/Incidence' 
import { NextResponse } from 'next/server'

export async function GET(req: Request) {

    connectDB()

    const incidencias = await Incidence.find()

    return NextResponse.json(incidencias)
}

export async function POST(req: Request) {

    try {
        const body = await req.json();

        const incidencia = new Incidence(body)
        const savedIncidence = await incidencia.save()
        
        return NextResponse.json(savedIncidence)

    } catch (error : any){
        return NextResponse.json(error.message, {
            status: 400
        })
    }
}

export async function PUT(req: Request){
    
    return new Response()
}

export async function DELETE(req: Request) {

    return new Response()
}