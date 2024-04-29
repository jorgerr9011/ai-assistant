import { RemoteRunnable } from "@langchain/core/runnables/remote"
import { NextResponse } from 'next/server'
import { Incidencia } from '@/types/Incidence'

const formatIncidence = (incidencia : Incidencia, solution: any): Incidencia => {
    incidencia.status = "CLOSED"
    incidencia.solution = solution
    return incidencia
}

export async function PUT(req: Request, { params }: any) {

    try {
        const res = await fetch(`http://localhost:3000/api/incidence/${params.incidenceId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const incidencia = await res.json()
        
        const chain = new RemoteRunnable({
            url: 'http://localhost:8000/incidence',
            options: {
                timeout: 1000000000
            }
        })
        
        const result = await chain.invoke(incidencia.description)

        console.log(result)
        const incidenceUpdated = formatIncidence(incidencia, result)

        const res2 = await fetch(`http://localhost:3000/api/incidence/${params.incidenceId}`, {
            method: "PUT",
            body: JSON.stringify(incidenceUpdated),
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (res2.status === 200) {
            return NextResponse.json(result, {
                status: 200
            })

        } else {
            return NextResponse.json(res.text, {
                status:400
            })
        }

    } catch (error: any) {
        console.log("Hubo un error en la petición "+error.message)
        return NextResponse.json(error.message, {
            status: 400
        })
    }
}