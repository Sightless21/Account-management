"use server"

import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmpassword: string;
}

export async function createUser(formData: FormData) {
    const user = await prisma.client.findUnique({
        where: {
            email: formData.email,
        },
    })
    if (user) {
        return alert("User already exist please type again")
    } else {
        await prisma.client.create({
            data: {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                hashedPassword: await bcrypt.hashSync(formData.password, 10)
            }
        })
    }
}