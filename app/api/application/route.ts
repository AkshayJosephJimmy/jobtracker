
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {createClient} from "@/lib/supabase/server"
import {enrichApplication} from "@/app/utility/enrichApplication"





const MS_PER_DAY = 1000 * 60 * 60 * 24


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
            notes,
            } = await req.json();


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
                notes,
               
                
            }
        })
        

        
        
        
        
        return NextResponse.json( enrichApplication(application))
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

        
        const applications= await prisma.application.findMany(
            {
                where:
                        {userId:user.id},

                 include:{
                        followUps:{
                        orderBy:{followedUpAt:'desc'},
                        take:1
                            }
                        }
                    },
                    
                
                )

      const enrichedApplication=  applications.map(app=>{
        const lastContact = app.followUps[0]?.followedUpAt ?? app.createdAt
        const daysSince = Math.floor((Date.now() - new Date(lastContact).getTime()) / MS_PER_DAY)
       

        return{
            ...app,
            daysSinceContact: daysSince,
            isFollowUpDue: daysSince >= 7 && app.status !== 'REJECTED'
        }

        })
           
            
        return NextResponse.json(enrichedApplication)
            
        }

    catch(err){
        console.error("Prisma create failed:", err);
  return NextResponse.json({ message: "Failed to fetch application" }, { status: 500 });

    }    

    




}



