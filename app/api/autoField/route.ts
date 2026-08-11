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

    const {data:{user}}= await supabase.auth.getUser()
    if(!user){
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) 
    }

    const{image}=await req.json()



    



}






















