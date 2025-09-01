// Base Cosmic object interface
export interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, any>;
  type: string;
  created_at: string;
  modified_at: string;
}

// Service interface
export interface Service extends CosmicObject {
  type: 'services';
  metadata: {
    service_name?: string;
    short_description?: string;
    full_description?: string;
    service_icon?: {
      url: string;
      imgix_url: string;
    };
    starting_price?: string;
    key_features?: string[];
  };
}

// Team Member interface
export interface TeamMember extends CosmicObject {
  type: 'team-members';
  metadata: {
    full_name?: string;
    job_title?: string;
    profile_photo?: {
      url: string;
      imgix_url: string;
    };
    bio?: string;
    email?: string;
    linkedin_url?: string;
    twitter_handle?: string;
    years_experience?: number;
  };
}

// Testimonial interface
export interface Testimonial extends CosmicObject {
  type: 'testimonials';
  metadata: {
    client_name?: string;
    client_title?: string;
    company_name?: string;
    testimonial_text?: string;
    rating?: {
      key: string;
      value: string;
    };
    client_photo?: {
      url: string;
      imgix_url: string;
    };
    related_service?: Service;
  };
}

// Case Study interface
export interface CaseStudy extends CosmicObject {
  type: 'case-studies';
  metadata: {
    project_title?: string;
    client_name?: string;
    project_overview?: string;
    challenge?: string;
    solution?: string;
    results?: string;
    featured_image?: {
      url: string;
      imgix_url: string;
    };
    project_gallery?: Array<{
      url: string;
      imgix_url: string;
    }>;
    services_used?: Service[];
    team_members?: TeamMember[];
    project_duration?: string;
    website_url?: string;
  };
}

// API response types
export interface CosmicResponse<T> {
  objects: T[];
  total: number;
  limit?: number;
  skip?: number;
}

// Dashboard statistics
export interface DashboardStats {
  totalServices: number;
  totalTeamMembers: number;
  totalTestimonials: number;
  totalCaseStudies: number;
  recentActivity: Array<{
    type: string;
    title: string;
    timestamp: string;
  }>;
}

// Form data types
export interface ServiceFormData {
  title: string;
  metadata: {
    service_name: string;
    short_description: string;
    full_description?: string;
    starting_price?: string;
    key_features?: string[];
  };
}

export interface TeamMemberFormData {
  title: string;
  metadata: {
    full_name: string;
    job_title: string;
    bio?: string;
    email?: string;
    linkedin_url?: string;
    twitter_handle?: string;
    years_experience?: number;
  };
}

export interface TestimonialFormData {
  title: string;
  metadata: {
    client_name: string;
    client_title?: string;
    company_name?: string;
    testimonial_text: string;
    rating?: {
      key: string;
      value: string;
    };
  };
}

export interface CaseStudyFormData {
  title: string;
  metadata: {
    project_title: string;
    client_name: string;
    project_overview: string;
    challenge?: string;
    solution?: string;
    results?: string;
    project_duration?: string;
    website_url?: string;
  };
}

// Type guards
export function isService(obj: CosmicObject): obj is Service {
  return obj.type === 'services';
}

export function isTeamMember(obj: CosmicObject): obj is TeamMember {
  return obj.type === 'team-members';
}

export function isTestimonial(obj: CosmicObject): obj is Testimonial {
  return obj.type === 'testimonials';
}

export function isCaseStudy(obj: CosmicObject): obj is CaseStudy {
  return obj.type === 'case-studies';
}

// Rating options
export type RatingValue = '3' | '4' | '5';

export const RATING_OPTIONS: Array<{ key: RatingValue; value: string }> = [
  { key: '5', value: '5 Stars' },
  { key: '4', value: '4 Stars' },
  { key: '3', value: '3 Stars' },
];