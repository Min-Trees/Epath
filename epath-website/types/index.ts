// Program types
export interface Program {
  id: string
  name: string
  nameEn: string
  level: 'kindergarten' | 'elementary' | 'middle' | 'high'
  description: string
  tracks: string[]
  subjects: string[]
  curriculum: string
  imageUrl?: string
  createdAt: Date
  updatedAt: Date
}

// FAQ types
export interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  order: number
  createdAt: Date
}

// Testimonial types
export interface Testimonial {
  id: string
  parentName: string
  location: string
  quote: string
  avatarUrl?: string
  rating?: number
  createdAt: Date
}

// Partner types
export interface Partner {
  id: string
  name: string
  logoUrl: string
  description: string
  website?: string
  type: 'certification' | 'curriculum' | 'lab' | 'other'
  createdAt: Date
}

// Contact form types
export interface ContactFormData {
  name: string
  email: string
  phone: string
  studentGrade?: string
  message: string
  programOfInterest?: string
  source?: string
  createdAt: Date
}

// Statistics types
export interface Statistic {
  id: string
  value: string
  label: string
  labelEn: string
  icon?: string
}

// Navigation types
export interface NavItem {
  label: string
  href: string
  children?: NavItem[]
}

// Core Value types
export interface CoreValue {
  id: string
  number: string
  title: string
  description: string
  icon: string
  color: string
  bgColor: string
}

// Learning Pathway types
export interface LearningPathway {
  id: string
  level: string
  levelEn: string
  programs: string[]
  curriculum: string
  color: string
  bgColor: string
}

// 5-Step Model types
export interface StepModel {
  id: string
  number: number
  title: string
  titleEn: string
  description: string
  color: string
  bgColor: string
}

// Page SEO types
export interface SEOMetadata {
  title: string
  description: string
  keywords?: string
  ogImage?: string
}

// Admin types
export interface AdminUser {
  uid: string
  email: string
  displayName?: string
  role: 'admin' | 'editor'
  createdAt: Date
}
