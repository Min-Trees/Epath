import { NextResponse } from 'next/server'
import { FaqsRepo, CoreValuesRepo, PathwaysRepo, ProgramsRepo, PartnersRepo, EventsRepo, AdmissionStepsRepo, AchievementsRepo, TeamMembersRepo } from '@/lib/cms-repo'
import { CollectionNames } from '@/lib/cms-types'

export async function GET() {
  try {
    const [faqs, coreValues, pathways, programs, partners, events, admissionSteps, achievements, teamMembers] =
      await Promise.all([
        FaqsRepo.listActive(),
        CoreValuesRepo.listActive(),
        PathwaysRepo.listActive(),
        ProgramsRepo.listActive(),
        PartnersRepo.listActive(),
        EventsRepo.listActive(),
        AdmissionStepsRepo.listActive(),
        AchievementsRepo.listActive(),
        TeamMembersRepo.listActive(),
      ])
    return NextResponse.json({
      [CollectionNames.faqs]: faqs,
      [CollectionNames.coreValues]: coreValues,
      [CollectionNames.learningPathways]: pathways,
      [CollectionNames.programs]: programs,
      [CollectionNames.partners]: partners,
      [CollectionNames.events]: events,
      [CollectionNames.admissionSteps]: admissionSteps,
      [CollectionNames.achievements]: achievements,
      [CollectionNames.teamMembers]: teamMembers,
    })
  } catch (error) {
    // When Firestore is not configured, return an empty payload so the
    // website can fall back to its hardcoded data without breaking.
    console.warn('[public/cms] Firestore unavailable:', (error as Error).message)
    return NextResponse.json({ configured: false })
  }
}