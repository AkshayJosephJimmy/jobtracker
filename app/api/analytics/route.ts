import { prisma } from "@/lib/prisma";
import {createClient} from "@/lib/supabase/server"




export async function GET(request: Request) {

     const supabase=await createClient()
    
        const {data:{user}}=await supabase.auth.getUser()
        if(!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

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
    const totalApplications = applications.length;
    const responsed = applications.filter((application) => application.firstResponseAt!==null ).length; 
    const responseRate = totalApplications > 0 ? (responsed / totalApplications) * 100 : 0;

    const stats:[]=





  return new Response("Analytics API is working!");
}
























