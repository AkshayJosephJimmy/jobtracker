
const MS_PER_DAY = 1000 * 60 * 60 * 24

export function enrichApplication(app:any) {
  const followUps = app.followUps ?? []
  const lastContact = followUps[0]?.followedUpAt ?? app.applyDate
  const daysSince = Math.floor((Date.now() - new Date(lastContact).getTime()) / MS_PER_DAY)

  return {
    ...app,
    followUps,
    daysSinceContact: daysSince,
    isFollowUpDue: daysSince >= 7 && app.status !== 'REJECTED'
  }
}















