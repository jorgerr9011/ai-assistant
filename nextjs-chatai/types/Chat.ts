import { ObjectId } from "mongoose";

export interface Chat {
    _id: ObjectId; // Specify the _id property type
    title: String;
    chat_history: Array<object>;
    user: ObjectId;
}
 