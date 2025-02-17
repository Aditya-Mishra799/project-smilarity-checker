import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import authOptions from "../../auth/[...nextauth]/nextAuthOptions";

export  async function GET(req, res){
    const session = await getServerSession(authOptions);
    if(!session){
        return NextResponse.json({message: "Unauthorized"}, {status : 401})
    }
    return  NextResponse.json({message: "authorized"}, {status : 200})
}