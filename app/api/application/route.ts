
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {createClient} from "@/lib/supabase/server"








export async function POST(req:NextRequest) {

    const supabase=await createClient()

     
      const {data:{user}}=await supabase.auth.getUser()
    if(!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
 


    const   {userId,
            companyName,
            role,
            status,
            portal,
            jobDescription,
            applyDate,
            resumeName,
            resumeLink,
            hasReferral,
            notes,} = await req.json();


    if(!userId || !companyName || !role || !status || !portal || !jobDescription || !applyDate   || hasReferral === undefined ){
        return NextResponse.json({message:"Missing required fields"}, {status:400})
    }        

    try{

        
        const application = await prisma.application.create({
            data:{
                userId,
                companyName,
                role,
                status,
                portal,
                jobDescription,
                applyDate: new Date(applyDate),
                resumeName,
                resumeLink,
                hasReferral,
                notes
            }
        })
        
        return NextResponse.json({message:"Application added successfully", application})
    }catch(err){
          console.error("Prisma create failed:", err);
  return NextResponse.json({ message: `Failed to create application ${err}`, }, { status: 500 });
    }




    





}
export async function GET(){

   const supabase=await createClient()

    const {data:{user}}=await supabase.auth.getUser()
    if(!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try{

        
        const applications= await prisma.application.findMany({where:
            {userId:user.id}})
            
            
            return NextResponse.json(applications)
            
        }

    catch(err){
        console.error("Prisma create failed:", err);
  return NextResponse.json({ message: "Failed to fetch application" }, { status: 500 });

    }    

    




}