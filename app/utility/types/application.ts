// types/application.ts
import type { Application as PrismaApplication, FollowUp as PrismaFollowUp } from "@prisma/client"


export type FollowUp = Omit<PrismaFollowUp, "followedUpAt" | "createdAt"> & {
  followedUpAt: string
  createdAt: string
}
export type Application = Omit<PrismaApplication, 'applyDate' | 'createdAt' | 'updatedAt'> & {
  applyDate: string;
  createdAt: string;
  updatedAt: string;
   daysSinceContact: number
  isFollowUpDue: boolean
  followUps: FollowUp[]
};