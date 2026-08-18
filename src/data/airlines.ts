export interface AirlinePartner {
  id: string;
  name: string;
  code: string;
  flag: string;
  hub: string;
  destinations: string;
  aircraft: string;
  frequency: string;
  baggageAllowance: string;
  catering: string;
  badge: string;
  logoUrl?: string;
  bgImage: string;
}

export const AIRLINE_PARTNERS: AirlinePartner[] = [
  {
    id: 'et',
    name: 'Ethiopian Airlines',
    code: 'ET',
    flag: '🇪🇹',
    hub: 'Addis Ababa Bole International Airport (ADD)',
    destinations: 'Direct flights to Jeddah (JED) & Madinah (MED)',
    aircraft: 'Boeing 787 Dreamliner, Airbus A350-900',
    frequency: '',
    baggageAllowance: '2 x 23kg Checked Bags + 7kg Hand Luggage',
    catering: 'Complimentary Halal Certified In-Flight Meals',
    badge: 'Official Flight Partner',
    logoUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=400',
    bgImage: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'sv',
    name: 'Saudia',
    code: 'SV',
    flag: '🇸🇦',
    hub: 'King Abdulaziz International Airport, Jeddah (JED)',
    destinations: 'Direct routes connecting Addis Ababa & Holy Cities',
    aircraft: 'Boeing 777-300ER, Airbus A330',
    frequency: '',
    baggageAllowance: '2 x 23kg Checked Bags + 8kg Hand Luggage',
    catering: 'Premium Halal meals, Arabic coffee & In-Flight Prayer Space',
    badge: 'Official Flight Partner',
    logoUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=400',
    bgImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=1200'
  }
];
