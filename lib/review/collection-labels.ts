// Helpers to load metadata about collections used in the review queue.
// Safe to import from both server and client components.
import { CollectionNames, REVIEWABLE_COLLECTIONS } from '../cms-types'

export const COLLECTION_LABELS: Record<string, string> = {
  [CollectionNames.faqs]: 'FAQ',
  [CollectionNames.coreValues]: 'Giá trị cốt lõi',
  [CollectionNames.learningPathways]: 'Lộ trình học',
  [CollectionNames.programs]: 'Chương trình học',
  [CollectionNames.partners]: 'Đối tác',
  [CollectionNames.events]: 'Sự kiện',
  [CollectionNames.admissionSteps]: 'Bước nhập học',
  [CollectionNames.achievements]: 'Thành tích',
  [CollectionNames.teamMembers]: 'Đội ngũ',
  [CollectionNames.statistics]: 'Thống kê',
  [CollectionNames.testimonials]: 'Phản hồi PH',
  [CollectionNames.blogPosts]: 'Bài viết',
  [CollectionNames.pages]: 'Page Section',
}

export function getCollectionLabel(name: string): string {
  return COLLECTION_LABELS[name] || name
}

export const REVIEWABLE_COLLECTION_NAMES: string[] = [...REVIEWABLE_COLLECTIONS]
