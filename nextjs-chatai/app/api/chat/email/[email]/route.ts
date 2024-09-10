import { NextResponse } from 'next/server'
import { connectDB } from "@/utils/db";
import User from "@/models/User";

// Función para borrar historial de mensajes del chat 
export async function PUT(req: Request, { params }: any) {

    try {
  
      await connectDB()
      const { email } = params
  
      //let usuario = await req.json()
      let userFound = await User.findOne({email})
  
      userFound.chat_history = []
      const userUpdated = await User.findOneAndUpdate({ email }, userFound, {
        new: true
      });
  
      console.log(userUpdated)
  
      return NextResponse.json(userUpdated)
  
    } catch (error: any) {
  
      console.log(error.message)
  
      return NextResponse.json(error.message, {
        status: 400
      })
    }
  }