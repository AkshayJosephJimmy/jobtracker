


 export async function fetchApplications(){
    
       
      const res= await fetch('/api/application')
      console.log(res)
      const data=await res.json()




        console.log("ddfs",data)
        return data;
        
        

        
    
      }