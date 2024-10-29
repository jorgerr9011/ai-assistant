import { Schema, model, models } from 'mongoose'

const chatSchema = new Schema({
    title: {
        type: String,
    },
    chat_history: {
        type: Array,
        default: []
    },
    user: {
        type: Schema.Types.ObjectId,
    }
}, {
    timestamps: true
})

export default models.Chat || model('Chat', chatSchema)