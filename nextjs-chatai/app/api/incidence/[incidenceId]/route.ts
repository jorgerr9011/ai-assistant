import {connectDB} from '@/utils/db'
import Incidence from '@/models/Incidence' 
import { NextResponse } from 'next/server'

export async function GET(req: Request, { params } : any) {

    try {
        await connectDB()

        const incidencia = await Incidence.findById(params.incidenceId)

        if (!incidencia)
            return NextResponse.json({
                message: "Incidencia no encontrada"
            }, {
                status: 404
            })

        return NextResponse.json(incidencia)

    } catch (error : any) {
        return NextResponse.json(error.message, {
            status: 400
        })
    }
}

export async function DELETE(req: Request, {params}: any) {
    
    try {
        await connectDB()
        const incidenceDeleted = await Incidence.findByIdAndDelete(params.incidenceId)

        if(!incidenceDeleted)
            return NextResponse.json({
                message: "Incidencia no encontrada",
            }, {
                status: 404
            })
        
        return NextResponse.json(incidenceDeleted)

    } catch (error : any) {
        return NextResponse.json(error.message, {
            status: 400
        })
    }
}

export async function PUT(req: Request, {params}: any) {
    
    try {
        await connectDB()
        
        const body = await req.json()

        const incidenceUpdated = await Incidence.findByIdAndUpdate(params.incidenceId, body, {
            new: true
        })

        return NextResponse.json(incidenceUpdated)

    } catch (error : any) {
        return NextResponse.json(error.message, {
            status: 400
        })
    }
}