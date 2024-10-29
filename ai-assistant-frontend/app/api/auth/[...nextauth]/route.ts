import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { connectDB } from '@/utils/db'
import User from '@/models/User'
import bcrypt from 'bcryptjs'

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            id: "credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password", placeholder: "******" }
            },
            async authorize(credentials) {
                await connectDB()

                // creo que al indicar una interrogación señalamos que puede llegar cualquier valor
                // En el modelo configuramos que a la password no se la podría hacer select, ahora al 
                // necesitar obtenerla tendremos que pedirle que nos la traiga explícitamente
                const userFound = await User.findOne({ email: credentials?.email }).select("+password")

                // no hay que ser muy descriptivos en el error, ya que a un atacante podría
                // darle info
                if (!userFound) throw new Error("Invalid credentials")

                // al indicar una exclamación, señalamos que sí o sí va a llegar ese credential
                const passwordMatch = await bcrypt.compare(credentials!.password, userFound.password)

                if (!passwordMatch) throw new Error("Invalid credentials")

                return userFound
            },
        }),
    ],
    pages: {
        signIn: "/login"
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
        // jwt es cuando se crea la token (la cookie) en el navegador
        async jwt({token, user}) {
            
            // queremos guardar en token los datos que añadimos en el authorize de Credentials (el user que creamos arriba)
            // a veces no va a existir el usuario, así que hay que poner un if
            if (user) token.user = user
            // esta función tiene que retornar algo 100%
            return token
        },
        // cuando la sesión es asignada 
        async session({session, token}) {
            session
            session.user = token.user as any
            return session
        },
    },
});

export { handler as GET, handler as POST }