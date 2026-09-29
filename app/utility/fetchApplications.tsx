import { Application } from "@/app/utility/types/application"



 export async function fetchApplications():Promise<Application[]>{
    
       
      const res= await fetch('/api/application')
      if (res.status === 401) {
    throw new Error('Unauthorized')
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch applications (${res.status})`)
  }

  return res.json()
        
        

        
    
      }