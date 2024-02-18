import { createClient } from "@libsql/client";

const client = createClient({
    url: process.env.DATABASE_URL ?? "",
    authToken: process.env.DATABASE_TOKEN ?? ""
});

export const addUser = async (username: string, email: string, password: string) => {
    const sql = 'INSERT INTO Users (username, email, password) VALUES (?, ?, ?)';
    
    const inserts = {
        sql,
        args: [username, email, password]
    };

    const result = await client.execute(inserts);

    return result;
};

export const findUser = async (email: string) => {
    const select = {
        sql: 'SELECT email FROM Users WHERE email = ?',
        args: [email]
    };

    const result = await client.execute(select);

    console.log(result.rowsAffected)

    return result;
};