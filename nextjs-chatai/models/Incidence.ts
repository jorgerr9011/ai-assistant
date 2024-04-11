import { timeStamp } from 'console'
import { Schema, model, models } from 'mongoose'

const incidenceSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es requerido'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'La descripción es requerida'],
        trim: true
    },
    status: {
        type: String,
        enum: ['CLOSED', 'OPEN']
    }
}, {
    timestamps: true
})

// Si entre todos los modelos existe el modelo Incidence, entonces le estamos 
// diciendo que lo use, sino existe, lo crea.
export default models.Incidence || model('Incidence', incidenceSchema)