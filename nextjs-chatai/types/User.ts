import { ObjectId } from "mongoose";

export interface Usuario {
    _id: ObjectId; // Specify the _id property type
    email: string;
    username: string;
    open_incidences_count: number;
    completed_incidences_count: number;
}