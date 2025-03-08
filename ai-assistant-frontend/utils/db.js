import {connect, connection} from 'mongoose'
import dotenv from 'dotenv'

const conn = {
    isConnected: false
}

// Variable de entorno sin contenedor
// 'mongodb://localhost/incidenceMongo'

export async function connectDB() { 
    if(conn.isConnected) return
        
    //const db = await connect(process.env.MONGODB_URL)
    const db = await connect('mongodb://localhost/incidenceMongo')
    //console.log(db.connection.db.databaseName)
    conn.isConnected = db.connections[0].readyState
}

connection.on('connected', () => {
    console.log('Mongoose is connected')
})

connection.on('error', (err) => {
    console.log('Mongoose connection error', err)
})