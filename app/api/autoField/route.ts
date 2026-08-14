import {openai} from '@/lib/openai'
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {createClient} from "@/lib/supabase/server"

const KNOWN_PORTALS = [
  'LinkedIn', 'Naukri', 'Wellfound', 'Indeed',
  'Instahyre', 'Cutshort', 'Company website', 'Referral'
]

const EXTRACTION_PROMPT = `You are extracting structured data from a screenshot of a job posting.

Return ONLY a JSON object. No markdown fences, no explanation, no preamble.

Schema:
{
  "companyName": string | null,
  "role": string | null,
  "portal": string | null,
  "jobDescription": string | null
}

Rules:
- If a field is not clearly visible in the image, return null for it. Do NOT guess or infer.
- "role" is the job title only, e.g. "Senior Backend Engineer". Not the seniority band, not the department.
- "portal" must be one of: ${KNOWN_PORTALS.join(', ')}. Identify it from site branding, layout, or URL bar. If none match or you are unsure, return null.
- "jobDescription" is the responsibilities and requirements text, verbatim where legible. Omit boilerplate like "About us" or equal-opportunity statements. If the description is truncated or not visible, return null.
- Never invent a company name from a logo you cannot read clearly.`


export async function POST(req:NextRequest){

    const supabase=await createClient()
    const {imageBase64,mimeType}=await req.json()

    const {data:{user}}= await supabase.auth.getUser()
    if(!user){
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) 
    }
    try{

        
       
       const completion= await openai.chat.completions.create({
            model:"gpt-4o",
            max_tokens:1500,
            messages:[
                {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType || 'image/png'};base64,${imageBase64}`,
                detail: 'high'
              }
            },
            { type: 'text', text: EXTRACTION_PROMPT }
          ]
        }
            ]
        })

       const raw= completion.choices[0].message?.content ?? ''
       const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim()

       let parsed
    try {
      parsed = JSON.parse(cleaned)
    } catch {
      console.error('Model returned unparseable output:', raw)
      return NextResponse.json(
        { error: 'Could not read that screenshot. Try a clearer image.' },
        { status: 422 }
      )
    }

    return NextResponse.json({
      companyName: parsed.companyName ?? null,
      role: parsed.role ?? null,
      portal: KNOWN_PORTALS.includes(parsed.portal) ? parsed.portal : null,
      jobDescription: parsed.jobDescription ?? null
    })


        
            

            
            
        
          



    }
    catch(err){
        return NextResponse.json({error:`Image not found ${err}`},{status:404})
    }



    



}






















