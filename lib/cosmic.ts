import { createBucketClient } from '@cosmicjs/sdk'
import type { 
  Service, 
  TeamMember, 
  Testimonial, 
  CaseStudy, 
  CosmicResponse,
  ServiceFormData,
  TeamMemberFormData,
  TestimonialFormData,
  CaseStudyFormData
} from '@/types'

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
})

// Error helper for Cosmic SDK
function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

// Services
export async function getServices(): Promise<Service[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'services' })
      .props(['id', 'title', 'slug', 'metadata', 'created_at', 'modified_at'])
      .depth(1);
    
    return (response.objects as Service[]).sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch services');
  }
}

export async function getService(id: string): Promise<Service | null> {
  try {
    const response = await cosmic.objects.findOne({
      id,
      type: 'services'
    }).depth(1);
    
    return response.object as Service;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function createService(data: ServiceFormData): Promise<Service> {
  try {
    const response = await cosmic.objects.insertOne({
      type: 'services',
      title: data.title,
      metadata: data.metadata
    });
    
    return response.object as Service;
  } catch (error) {
    console.error('Error creating service:', error);
    throw new Error('Failed to create service');
  }
}

export async function updateService(id: string, data: Partial<ServiceFormData>): Promise<Service> {
  try {
    const updateData: any = {};
    
    if (data.title) {
      updateData.title = data.title;
    }
    
    if (data.metadata) {
      updateData.metadata = data.metadata;
    }
    
    const response = await cosmic.objects.updateOne(id, updateData);
    return response.object as Service;
  } catch (error) {
    console.error('Error updating service:', error);
    throw new Error('Failed to update service');
  }
}

export async function deleteService(id: string): Promise<void> {
  try {
    await cosmic.objects.deleteOne(id);
  } catch (error) {
    console.error('Error deleting service:', error);
    throw new Error('Failed to delete service');
  }
}

// Team Members
export async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'team-members' })
      .props(['id', 'title', 'slug', 'metadata', 'created_at', 'modified_at'])
      .depth(1);
    
    return (response.objects as TeamMember[]).sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch team members');
  }
}

export async function getTeamMember(id: string): Promise<TeamMember | null> {
  try {
    const response = await cosmic.objects.findOne({
      id,
      type: 'team-members'
    }).depth(1);
    
    return response.object as TeamMember;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function createTeamMember(data: TeamMemberFormData): Promise<TeamMember> {
  try {
    const response = await cosmic.objects.insertOne({
      type: 'team-members',
      title: data.title,
      metadata: data.metadata
    });
    
    return response.object as TeamMember;
  } catch (error) {
    console.error('Error creating team member:', error);
    throw new Error('Failed to create team member');
  }
}

export async function updateTeamMember(id: string, data: Partial<TeamMemberFormData>): Promise<TeamMember> {
  try {
    const updateData: any = {};
    
    if (data.title) {
      updateData.title = data.title;
    }
    
    if (data.metadata) {
      updateData.metadata = data.metadata;
    }
    
    const response = await cosmic.objects.updateOne(id, updateData);
    return response.object as TeamMember;
  } catch (error) {
    console.error('Error updating team member:', error);
    throw new Error('Failed to update team member');
  }
}

export async function deleteTeamMember(id: string): Promise<void> {
  try {
    await cosmic.objects.deleteOne(id);
  } catch (error) {
    console.error('Error deleting team member:', error);
    throw new Error('Failed to delete team member');
  }
}

// Testimonials
export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'testimonials' })
      .props(['id', 'title', 'slug', 'metadata', 'created_at', 'modified_at'])
      .depth(1);
    
    return (response.objects as Testimonial[]).sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch testimonials');
  }
}

export async function getTestimonial(id: string): Promise<Testimonial | null> {
  try {
    const response = await cosmic.objects.findOne({
      id,
      type: 'testimonials'
    }).depth(1);
    
    return response.object as Testimonial;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function createTestimonial(data: TestimonialFormData): Promise<Testimonial> {
  try {
    const response = await cosmic.objects.insertOne({
      type: 'testimonials',
      title: data.title,
      metadata: data.metadata
    });
    
    return response.object as Testimonial;
  } catch (error) {
    console.error('Error creating testimonial:', error);
    throw new Error('Failed to create testimonial');
  }
}

export async function updateTestimonial(id: string, data: Partial<TestimonialFormData>): Promise<Testimonial> {
  try {
    const updateData: any = {};
    
    if (data.title) {
      updateData.title = data.title;
    }
    
    if (data.metadata) {
      updateData.metadata = data.metadata;
    }
    
    const response = await cosmic.objects.updateOne(id, updateData);
    return response.object as Testimonial;
  } catch (error) {
    console.error('Error updating testimonial:', error);
    throw new Error('Failed to update testimonial');
  }
}

export async function deleteTestimonial(id: string): Promise<void> {
  try {
    await cosmic.objects.deleteOne(id);
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    throw new Error('Failed to delete testimonial');
  }
}

// Case Studies
export async function getCaseStudies(): Promise<CaseStudy[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'case-studies' })
      .props(['id', 'title', 'slug', 'metadata', 'created_at', 'modified_at'])
      .depth(2);
    
    return (response.objects as CaseStudy[]).sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch case studies');
  }
}

export async function getCaseStudy(id: string): Promise<CaseStudy | null> {
  try {
    const response = await cosmic.objects.findOne({
      id,
      type: 'case-studies'
    }).depth(2);
    
    return response.object as CaseStudy;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function createCaseStudy(data: CaseStudyFormData): Promise<CaseStudy> {
  try {
    const response = await cosmic.objects.insertOne({
      type: 'case-studies',
      title: data.title,
      metadata: data.metadata
    });
    
    return response.object as CaseStudy;
  } catch (error) {
    console.error('Error creating case study:', error);
    throw new Error('Failed to create case study');
  }
}

export async function updateCaseStudy(id: string, data: Partial<CaseStudyFormData>): Promise<CaseStudy> {
  try {
    const updateData: any = {};
    
    if (data.title) {
      updateData.title = data.title;
    }
    
    if (data.metadata) {
      updateData.metadata = data.metadata;
    }
    
    const response = await cosmic.objects.updateOne(id, updateData);
    return response.object as CaseStudy;
  } catch (error) {
    console.error('Error updating case study:', error);
    throw new Error('Failed to update case study');
  }
}

export async function deleteCaseStudy(id: string): Promise<void> {
  try {
    await cosmic.objects.deleteOne(id);
  } catch (error) {
    console.error('Error deleting case study:', error);
    throw new Error('Failed to delete case study');
  }
}