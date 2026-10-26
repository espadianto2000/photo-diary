export const MAX_GROUPS_PER_USER = 2
export const MAX_MEMBERS_PER_GROUP = 7

export type GroupSummary = {
  id: string
  name: string
  memberCount: number
  role: "owner" | "member"
}

export function canJoinAnotherGroup(groupCount: number): boolean {
  return groupCount < MAX_GROUPS_PER_USER
}
