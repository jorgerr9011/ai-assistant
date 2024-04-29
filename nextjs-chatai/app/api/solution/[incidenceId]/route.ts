import { Ollama } from "@langchain/community/llms/ollama";
import { Message as VercelChatMessage, StreamingTextResponse, streamToResponse } from 'ai';
import { PromptTemplate } from "@langchain/core/prompts";
import { BytesOutputParser } from '@langchain/core/output_parsers';
import { RemoteRunnable } from "@langchain/core/runnables/remote"
import { NextResponse } from 'next/server'
import { connectDB } from '@/utils/db'
import Incidence from '@/models/Incidence'
import { ObjectId } from "mongoose";

interface Incidencia {
    _id: ObjectId; // Specify the _id property type
    name: string;
    description: string;
    status: string;
    solution: string;
    createdAt: Date;
    updatedAt: Date;
}

const formatIncidence = (incidencia : Incidencia, solution: any): Incidencia => {

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
                timeout: 10000000
            }
        })

        /*const result = await chain.invoke({
            //chat_history: "",
            question: incidencia.description,
        })*/
        console.log(incidencia)

        const peticion = "hola, que tal?"
        const result = await chain.invoke({
            input: peticion
        })

        console.log(result)
        /*const incidenceUpdated = formatIncidence(incidencia, result)

        const res2 = await fetch(`http://localhost:3000/api/incidence/${params.incidenceId}`, {
            method: "PUT",
            body: JSON.stringify(incidenceUpdated),
            headers: {
                "Content-Type": "application/json"
            }
        });
*/
        if (res.status === 200) {
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