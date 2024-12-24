/* eslint-disable @typescript-eslint/no-unused-vars */
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export default async function GET(req : Request) { 
    const session = await getServerSession(authOptions)
    return Response.json({
        message: 'test',
        session
    })

}
