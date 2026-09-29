





export function searchApplications(applications: any[], searchTerm: string) {

 const SEARCHABLE_FIELDS: string[] = [
  'companyName',
  'role',
  'portal',
  'notes',
  'resumeName'
]


    const query = searchTerm.toLowerCase().trim()
    if (!query) {
        return applications
    }
    const tokens = query.split(/\s+/)

    const filteredApplications = applications.filter(app=>
        tokens.every(token=>

            
            
            SEARCHABLE_FIELDS.some(field=>{
                const value=app[field]
                return typeof value === 'string' && value.toLowerCase().includes(token)
            }))
        )



return filteredApplications


}

export function followUpApplication(applications:any[]){

    const FILTER_THRESHOLD=7

    const filteredApplications=applications.filter((application)=>application.daysSinceContact >=FILTER_THRESHOLD)

    return filteredApplications



}

export function getWeeklyApplications(applications:any[]){

const MS_PER_DAY = 1000 * 60 * 60 * 24   // 86,400,000


    const filteredApplications=applications.filter((application)=>{

        const daysAgo = Math.floor(
        (Date.now() - new Date(application.applyDate).getTime()) / MS_PER_DAY
)
        
        return daysAgo <7
    })
        
    return filteredApplications

}