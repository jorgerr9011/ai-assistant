import { Schema, model, models } from 'mongoose'

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: [true, "El email es requerido"],
        match: [
            /^\w+([\·-]?\w+)*@\w+([\·-]?\w+)*(\.\w{2,3})+$/,
            "El email no es válido"
        ]
    },
    password: {
        type: String,
        required: [true, "La contrasela es requerida"],
        select: false
    },
    username: {
        type: String,
        required: [true, "El username es requerido"],
        minLength: [3, "El usuario debe tener al menos 3 carácteres"],
        maxLength: [50, "El usuario puede tener como mucho 50 carácteres"]
    }
})

// Si entre todos los modelos existe el modelo Incidence, entonces le estamos 
// diciendo que lo use, sino existe, lo crea.
export default models.User || model('User', userSchema)