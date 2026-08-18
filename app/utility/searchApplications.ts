





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