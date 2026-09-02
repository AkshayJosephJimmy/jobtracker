import { useApplication } from "../context/ApplicationsContext";


 function getResponseRate(app:any){


    const totalApplications = app.length;
    const responsed = app.filter((application:any) => application.firstResponseAt!==null ).length; 
    const responseRate = totalApplications > 0 ? (responsed / totalApplications) * 100 : 0;
    const label=["Total Applicaiton","Response Rate","Ghosted"]

    label.map


    // might have to put a ghosted paramter 
   // return {responseRate,totalApplications,responsed}
  // label: 'TOTAL APPLIED', value: '420', delta: '+18', deltaTone: 'up', sub: 'this week' }
    return [{   
                label:"Total Application",
                value:totalApplications,
            },
            {
                label:"Response Rate",
                value:responseRate
                
            },
            
            

    ]

}

 function getPortalDetails(app:any){
    
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

        stats[portalName]={count:1,responseCount:application.firstResponseAt ? 1:0}

    }else{
        stats[portalName].count++
        if(application.firstResponseAt) stats[portalName].responseCount++
    }

})

return Object.entries(stats).map(([name,s])=>({
    name,
    count:s.count,
    responseCount:s.responseCount

}))





}

export function getAnalyticsData(application:any){


const stat=getResponseRate(application)
const portal=getPortalDetails(application)
return {
    stat,
    portal
}



}
