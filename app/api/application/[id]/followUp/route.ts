import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {createClient} from "@/lib/supabase/server"

export async function POST(req:NextRequest,{params}:{params:Promise<{id:string}>}){
    const MS_PER_DAY = 1000 * 60 * 60 * 24

    const {message} =await req.json()

    const {id}=await params

   

   const followUp= await prisma.followUp.create({
    data:{

        applicationId:id,
        message:message || null,
        followedUpAt:new Date() 
    }
   })
    const application=await prisma.application.findUnique({
        where:{
            id:id,
        },
            include: {
            followUps: { orderBy: { followedUpAt: 'desc' } }
    
        }
    })
      const lastContact = application!.followUps[0]?.followedUpAt ?? application!.applyDate
    const daysSince = Math.floor((Date.now() - new Date(lastContact).getTime()) / MS_PER_DAY)

    const enrichedApplication={...application,
                                daysSinceContact:daysSince

    }

    return Response.json(enrichedApplication)


}










