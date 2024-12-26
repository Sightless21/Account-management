import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const POST = async (req: Request) => {
    try {
        const { name, email, password } = await req.json()
        const hashedPassword = await bcrypt.hashSync(password, 10)
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                hashedPassword: hashedPassword
            }
        })
        return Response.json({
            message: 'User created successfully',
            data: {
                newUser
            }
        }, { status: 201 })
    } catch (error) {
        return Response.json({
            error
        }, { status: 500 })

    }
}