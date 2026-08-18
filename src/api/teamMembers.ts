// src/api/teamMembers.ts
import { api } from './client';
import { TeamMember } from '../types';

export async function getPublicTeamMembersApi(): Promise<TeamMember[]> {
  try {
    const res = await api.get('/team-members');
    // Backend returns { status, success, count, data: [...] }
    return res?.data || [];
  } catch (error) {
    console.error('❌ Error fetching team members:', error);
    return [];
  }
}