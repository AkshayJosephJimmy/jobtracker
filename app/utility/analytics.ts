import { useApplication } from "../context/ApplicationsContext";


export function getResponseRate(app:any){


    const totalApplications = app.length;
    const responsed = app.filter((application:any) => application.firstResponseAt!==null ).length; 
    const responseRate = totalApplications > 0 ? (responsed / totalApplications) * 100 : 0;
    // might have to put a ghosted paramter 
    return {responseRate,totalApplications,responsed}

}

export function getPortalDetails(app:any){
    
type PortalDetails={
    
    count:number,
    responseCount:number
}

type PortalMap= Record<string,PortalDetails> 

const stats:PortalMap={}



app.forEach((application:any) => {
    const portalName = application.portal;
    if(!portalName)return;
    
    if(!(portalName in stats) ){

        stats[portalName]={count:1,responseCount:application.firtResponseAt ? 1:0}

    }else{
        stats[portalName].count++
        if(application.firstResponseAt) stats[portalName].responseCount++
    }

})

return stats



}
