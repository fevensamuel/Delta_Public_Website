import { 
  PackageItem, 
  SmsSubscriber, 
  GalleryItem, 
  Testimonial
} from '../types';

export const INITIAL_PACKAGES: PackageItem[] = [
  {
    id: 'pkg-economy-1',
    title: 'Economy Umrah Package',
    titleAr: 'باقة العمرة الاقتصادية',
    titleAm: 'የኢኮኖሚ ኡምራ ፓኬጅ',
    category: 'Economy',
    price: 890,
    priceUsd: 890,
    durationDays: 10,
    departureCity: 'Addis Ababa (Direct Flight)',
    inclusions: [
      'Umrah Electronic Visa Issuance & Processing',
      'Return Flight Ticket (Ethiopian Airlines or Saudia)',
      'Comfortable Star Accommodation near Haram',
      'Air-Conditioned VIP Bus Transportation (Jeddah-Makkah-Madinah)',
      'Guided Historical Ziyarah Tours in Makkah & Madinah',
      '5L Zamzam Water Bottle per pilgrim',
      'Experienced Mutawwif Guide for All Rituals'
    ],
    exclusions: ['Personal Expenses & Laundry', 'Excess Baggage Fees'],
    rating: 4.8,
    reviewsCount: 142,
    popular: false,
    image: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&q=80&w=800',
    availableDates: ['15 Aug 2026', '01 Sep 2026', '20 Sep 2026', '10 Oct 2026'],
    itinerary: [
      { day: 1, title: 'Departure & Ihram at Miqat', titleEn: 'Departure & Ihram at Miqat', description: 'Depart from home airport, wear Ihram at Miqat, arrive in Jeddah & transfer to Makkah.', descriptionEn: 'Depart from home airport, wear Ihram at Miqat, arrive in Jeddah & transfer to Makkah.' },
      { day: 2, title: 'Perform First Umrah', titleEn: 'Perform First Umrah', description: 'Guided Tawaf & Sa’i with our experienced Mutawwif followed by Halq/Taqseer.', descriptionEn: 'Guided Tawaf & Sa’i with our experienced Mutawwif followed by Halq/Taqseer.' },
      { day: 3, title: 'Rest & Ibadaah in Haram', titleEn: 'Rest & Ibadaah in Haram', description: 'Free time for prayers and optional voluntary Tawaf in Masjid al-Haram.', descriptionEn: 'Free time for prayers and optional voluntary Tawaf in Masjid al-Haram.' },
      { day: 4, title: 'Makkah Ziyarah Tour', titleEn: 'Makkah Ziyarah Tour', description: 'Visit Jabal al-Noor (Cave Hira), Jabal al-Thawr, Mina, Arafat, and Muzdalifah.', descriptionEn: 'Visit Jabal al-Noor (Cave Hira), Jabal al-Thawr, Mina, Arafat, and Muzdalifah.' },
      { day: 5, title: 'Transfer to Madinah al-Munawwarah', titleEn: 'Transfer to Madinah al-Munawwarah', description: 'Travel via comfortable AC bus to the City of the Prophet (PBUH).', descriptionEn: 'Travel via comfortable AC bus to the City of the Prophet (PBUH).' },
      { day: 6, title: 'Greeting the Prophet (PBUH) & Rawdah Visit', titleEn: 'Greeting the Prophet (PBUH) & Rawdah Visit', description: 'Guided greeting at Al-Masjid an-Nabawi and permit assistance for Rawdah ash-Sharifah.', descriptionEn: 'Guided greeting at Al-Masjid an-Nabawi and permit assistance for Rawdah ash-Sharifah.' },
      { day: 7, title: 'Madinah Historical Sites', titleEn: 'Madinah Historical Sites', description: 'Visit Quba Mosque (First Mosque in Islam), Mount Uhud, and Qiblatain Mosque.', descriptionEn: 'Visit Quba Mosque (First Mosque in Islam), Mount Uhud, and Qiblatain Mosque.' },
      { day: 8, title: 'Ibadaah in Prophet Mosque', titleEn: 'Ibadaah in Prophet Mosque', description: 'Spiritual contemplation and prayers in Madinah.', descriptionEn: 'Spiritual contemplation and prayers in Madinah.' },
      { day: 9, title: 'Final Shopping & Farewell', titleEn: 'Final Shopping & Farewell', description: 'Purchase dates and souvenirs; packing and final preparation.', descriptionEn: 'Purchase dates and souvenirs; packing and final preparation.' },
      { day: 10, title: 'Return Flight Home', titleEn: 'Return Flight Home', description: 'Transfer to Madinah/Jeddah Airport for departure with blessed memories.', descriptionEn: 'Transfer to Madinah/Jeddah Airport for departure with blessed memories.' }
    ]
  },
  {
    id: 'pkg-standard-2',
    title: 'Standard Comfort Umrah Package',
    titleAr: 'باقة العمرة القياسية المريحة',
    titleAm: 'የስታንዳርድ ምቹ ኡምራ ፓኬጅ',
    category: 'Standard',
    price: 1250,
    priceUsd: 1250,
    durationDays: 12,
    departureCity: 'Addis Ababa (Direct Flight)',
    inclusions: [
      'Express Umrah E-Visa with Insurance',
      'Direct Roundtrip Flight (Ethiopian Airlines / Saudia)',
      'Premium Accommodation Steps from Haram Courtyard',
      'Daily Buffet Breakfast included',
      'Luxury AC Transport between cities',
      'Full Ziyarah Package with Scholars',
      '5L Zamzam Water & Ihram Towel Kit',
      'Dedicated 24/7 Group Assistant'
    ],
    exclusions: ['Personal Purchases', 'Room Service'],
    rating: 4.9,
    reviewsCount: 289,
    popular: true,
    featured: true,
    image: 'https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?auto=format&fit=crop&q=80&w=800',
    availableDates: ['20 Aug 2026', '05 Sep 2026', '18 Sep 2026', '12 Oct 2026'],
    itinerary: [
      { day: 1, title: 'Arrival in Jeddah & Transfer to Makkah', titleEn: 'Arrival in Jeddah & Transfer to Makkah', description: 'VIP meet and assist at Jeddah airport and shuttle to hotel.', descriptionEn: 'VIP meet and assist at Jeddah airport and shuttle to hotel.' },
      { day: 2, title: 'Perform Umrah Rituals', titleEn: 'Perform Umrah Rituals', description: 'Guided Umrah with scholar instructions and group support.', descriptionEn: 'Guided Umrah with scholar instructions and group support.' },
      { day: 3, title: 'Holy Makkah Ziyarah', titleEn: 'Holy Makkah Ziyarah', description: 'Comprehensive tour of Makkah historical landmarks.', descriptionEn: 'Comprehensive tour of Makkah historical landmarks.' },
      { day: 4, title: 'Spiritual Gathering & Hadith Circle', titleEn: 'Spiritual Gathering & Hadith Circle', description: 'Evening lecture on the significance of Makkah and Umrah.', descriptionEn: 'Evening lecture on the significance of Makkah and Umrah.' },
      { day: 5, title: 'High-Speed Haramain Train to Madinah', titleEn: 'High-Speed Haramain Train to Madinah', description: 'Experience the 300km/h bullet train ride from Makkah to Madinah.', descriptionEn: 'Experience the 300km/h bullet train ride from Makkah to Madinah.' },
      { day: 6, title: 'Rawdah Sharifah Visit', titleEn: 'Rawdah Sharifah Visit', description: 'Guaranteed Nusuk permit entry for prayers in Rawdah Sharifah.', descriptionEn: 'Guaranteed Nusuk permit entry for prayers in Rawdah Sharifah.' },
      { day: 7, title: 'Historical Madinah Ziyarah', titleEn: 'Historical Madinah Ziyarah', description: 'Quba Mosque, Uhud Martyrs cemetery, and Date Farms.', descriptionEn: 'Quba Mosque, Uhud Martyrs cemetery, and Date Farms.' },
      { day: 8, title: 'Second Optional Umrah', titleEn: 'Second Optional Umrah', description: 'Transport to Masjid Ayesha (Tan’im) for those wishing to perform a second Umrah.', descriptionEn: 'Transport to Masjid Ayesha (Tan’im) for those wishing to perform a second Umrah.' },
      { day: 9, title: 'Free Days in Madinah', titleEn: 'Free Days in Madinah', description: 'Focus on Quran recitation and prayers in Prophet Mosque.', descriptionEn: 'Focus on Quran recitation and prayers in Prophet Mosque.' },
      { day: 10, title: 'Reflection & Shopping', titleEn: 'Reflection & Shopping', description: 'Spiritual reflection and date market shopping.', descriptionEn: 'Spiritual reflection and date market shopping.' },
      { day: 11, title: 'Farewell Greeting', titleEn: 'Farewell Greeting', description: 'Farewell Greeting at Al-Masjid an-Nabawi.', descriptionEn: 'Farewell Greeting at Al-Masjid an-Nabawi.' },
      { day: 12, title: 'Departure Flight', titleEn: 'Departure Flight', description: 'Airport transfer and return home.', descriptionEn: 'Airport transfer and return home.' }
    ]
  },
  {
    id: 'pkg-premium-3',
    title: 'Premium Group Umrah Package',
    titleAr: 'باقة العمرة الفاخرة الممتازة',
    titleAm: 'የፕሪሚየም ኡምራ ፓኬጅ',
    category: 'Premium',
    price: 1650,
    priceUsd: 1650,
    durationDays: 14,
    departureCity: 'Addis Ababa (Direct Flight)',
    inclusions: [
      'VIP Umrah E-Visa Fast-Track',
      'Direct Flights on Ethiopian Airlines or Saudia',
      'Front-Row Courtyard Hotels with Haram Views',
      'Full Board Gourmet Breakfast Buffet Included',
      'Private High-Speed Haramain Express Train Tickets',
      'Private Scholar & Personal Mutawwif Escort',
      'Complete Pilgrim Luxury Kit & Zamzam Water',
      '24/7 VIP Concierge Support'
    ],
    exclusions: ['Special Customized Excursions'],
    rating: 5.0,
    reviewsCount: 312,
    popular: false,
    featured: true,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800',
    availableDates: ['25 Aug 2026', '10 Sep 2026', '01 Oct 2026', '15 Nov 2026'],
    itinerary: [
      { day: 1, title: 'VIP Arrival & Check-in', titleEn: 'VIP Arrival & Check-in', description: 'Private transfer from Jeddah airport directly to hotel.', descriptionEn: 'Private transfer from Jeddah airport directly to hotel.' },
      { day: 2, title: 'Private Guided Umrah', titleEn: 'Private Guided Umrah', description: 'Personal Mutawwif leading Tawaf and Sa’i.', descriptionEn: 'Personal Mutawwif leading Tawaf and Sa’i.' },
      { day: 3, title: 'Haram Reflection Day', titleEn: 'Haram Reflection Day', description: 'Relax and perform voluntary prayers in Masjid al-Haram.', descriptionEn: 'Relax and perform voluntary prayers in Masjid al-Haram.' },
      { day: 4, title: 'Excursion to Taif Mountains', titleEn: 'Excursion to Taif Mountains', description: 'Day trip to Taif (Masjid Addas, Cable car, Rose factories).', descriptionEn: 'Day trip to Taif (Masjid Addas, Cable car, Rose factories).' },
      { day: 5, title: 'Bullet Train to Madinah VIP Class', titleEn: 'Bullet Train to Madinah VIP Class', description: 'First-class seat on Haramain Speed Train.', descriptionEn: 'First-class seat on Haramain Speed Train.' },
      { day: 6, title: 'Direct Rawdah Sharifah Access', titleEn: 'Direct Rawdah Sharifah Access', description: 'Nusuk VIP queue pass for Rawdah Sharifah.', descriptionEn: 'Nusuk VIP queue pass for Rawdah Sharifah.' },
      { day: 7, title: 'Exclusive Madinah Date Farm Brunch', titleEn: 'Exclusive Madinah Date Farm Brunch', description: 'Private brunch at organic Madinah Date Gardens.', descriptionEn: 'Private brunch at organic Madinah Date Gardens.' },
      { day: 8, title: 'Badr Battlefield Tour', titleEn: 'Badr Battlefield Tour', description: 'Historical excursion to the Site of Badr with Islamic history expert.', descriptionEn: 'Historical excursion to the Site of Badr with Islamic history expert.' },
      { day: 9, title: 'Holy Quran Exhibition & Printing Press', titleEn: 'Holy Quran Exhibition & Printing Press', description: 'Exclusive visit to King Fahd Complex for Printing the Holy Quran.', descriptionEn: 'Exclusive visit to King Fahd Complex for Printing the Holy Quran.' },
      { day: 10, title: 'Spiritual Retreat', titleEn: 'Spiritual Retreat', description: 'Dedicated time for Quran reading and continuous worship.', descriptionEn: 'Dedicated time for Quran reading and continuous worship.' },
      { day: 11, title: 'Optional 2nd Umrah', titleEn: 'Optional 2nd Umrah', description: 'Private transfer for Ihram at Miqat.', descriptionEn: 'Private transfer for Ihram at Miqat.' },
      { day: 12, title: 'Relaxation & Souvenirs', titleEn: 'Relaxation & Souvenirs', description: 'Leisure and date purchasing in Madinah.', descriptionEn: 'Leisure and date purchasing in Madinah.' },
      { day: 13, title: 'Farewell Prayers', titleEn: 'Farewell Prayers', description: 'Farewell gathering with Delta Travel team.', descriptionEn: 'Farewell gathering with Delta Travel team.' },
      { day: 14, title: 'VIP Airport Departure', titleEn: 'VIP Airport Departure', description: 'Lounge access at Airport & flight home.', descriptionEn: 'Lounge access at Airport & flight home.' }
    ]
  },
  {
    id: 'pkg-vip-4',
    title: 'VIP Bespoke Umrah Experience',
    titleAr: 'تجربة العمرة الفاخرة المخصصة VIP',
    titleAm: 'የቪ.አይ.ፒ ልዩ ኡምራ ፓኬጅ',
    category: 'VIP',
    price: 2100,
    priceUsd: 2100,
    durationDays: 15,
    departureCity: 'Addis Ababa (Direct Flight)',
    inclusions: [
      'Express VIP Visa Issuance & Private Airport Escort',
      'Business Class Flight Tickets (Saudia / Ethiopian Airlines)',
      'Luxury Suites with Direct Kaaba Views',
      'Private GMC Vehicle Transfers Throughout',
      'Personal Dedicated Islamic Scholar Guide',
      'Private Ziyarah Tours to Historical Landmarks',
      '5L Zamzam Water Delivered to Airport',
      '24/7 Concierge Service'
    ],
    exclusions: ['Personal Expenses'],
    rating: 5.0,
    reviewsCount: 98,
    popular: true,
    image: 'https://images.unsplash.com/photo-1572949645841-094f3a9c4c94?auto=format&fit=crop&q=80&w=800',
    availableDates: ['01 Sep 2026', '15 Sep 2026', '01 Oct 2026', '20 Nov 2026'],
    itinerary: [
      { day: 1, title: 'Private VIP Arrival', titleEn: 'Private VIP Arrival', description: 'Private vehicle meet & greet at Jeddah Airport.', descriptionEn: 'Private vehicle meet & greet at Jeddah Airport.' },
      { day: 2, title: 'Private Scholar Umrah Guidance', titleEn: 'Private Scholar Umrah Guidance', description: 'Complete Umrah guidance with private scholar.', descriptionEn: 'Complete Umrah guidance with private scholar.' },
      { day: 3, title: 'VIP Rawdah Permit & Ziyarah', titleEn: 'VIP Rawdah Permit & Ziyarah', description: 'Exclusive entry assistance to Rawdah in Madinah.', descriptionEn: 'Exclusive entry assistance to Rawdah in Madinah.' },
      { day: 15, title: 'Return Flight', titleEn: 'Return Flight', description: 'Return home with full satisfaction.', descriptionEn: 'Return home with full satisfaction.' }
    ]
  }
];

export const INITIAL_SUBSCRIBERS: SmsSubscriber[] = [
  {
    id: 'sub-1',
    phone: '+251911234567',
    email: 'ahmed@example.com',
    channel: 'Web Lead Banner',
    subscribedAt: '2026-07-20'
  },
  {
    id: 'sub-2',
    phone: '+251922334455',
    email: 'fatima@example.com',
    channel: 'Footer Form',
    subscribedAt: '2026-07-24'
  }
];

export const INITIAL_GALLERY: GalleryItem[] = [
  // PHOTO ITEMS
  {
    id: 'g1',
    title: 'Holy Kaaba & Mataf Courtyard',
    titleAr: 'الكعبة المشرفة والصحن الشريف',
    type: 'photo',
    imageUrl: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&q=80&w=1000',
    location: 'Masjid al-Haram, Makkah',
    description: 'Serene view of the Holy Kaaba during early morning Fajr prayers.'
  },
  {
    id: 'g2',
    title: 'Green Dome at Al-Masjid an-Nabawi',
    titleAr: 'القبلة الخضراء بالمسجد النبوي',
    type: 'photo',
    imageUrl: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&q=80&w=1000',
    location: 'Madinah al-Munawwarah',
    description: 'The iconic Green Dome of the Prophet’s Mosque at sunset.'
  },
  {
    id: 'g3',
    title: 'Delta Pilgrim Group Departure',
    titleAr: 'مجموعة معتمري شركة دلتا',
    type: 'photo',
    imageUrl: 'https://images.unsplash.com/photo-1572949645841-094f3a9c4c94?auto=format&fit=crop&q=80&w=1000',
    location: 'Addis Ababa Bole Airport & Jeddah',
    description: 'Group photo of Delta Travel pilgrims heading to the Holy Land in ihram.'
  },
  {
    id: 'g4',
    title: 'Clock Tower Architecture',
    titleAr: 'إطلالة أبراح الساعة الفاخرة',
    type: 'photo',
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1000',
    location: 'Makkah Clock Tower',
    description: 'Breathtaking view of Masjid al-Haram from nearby towers.'
  },
  {
    id: 'g5',
    title: 'Prophet Mosque Courtyard Umbrellas',
    titleAr: 'مظلات المسجد النبوي الشريف',
    type: 'photo',
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=1000',
    location: 'Al-Masjid an-Nabawi',
    description: 'Shaded automated umbrellas providing cool sanctuary to worshippers.'
  },
  {
    id: 'g6',
    title: 'Pilgrims at Mount Uhud',
    titleAr: 'الزوار عند جبل أحد',
    type: 'photo',
    imageUrl: 'https://images.unsplash.com/photo-1565552070092-2313627f12aa?auto=format&fit=crop&q=80&w=1000',
    location: 'Mount Uhud, Madinah',
    description: 'Delta Mutawwif explaining the historic Battle of Uhud during guided Ziyarah.'
  },

  // VIDEO ITEMS
  {
    id: 'v1',
    title: 'Night Tawaf Around the Holy Kaaba',
    titleAr: 'طواف الليل حول الكعبة المشرفة',
    type: 'video',
    imageUrl: 'https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?auto=format&fit=crop&q=80&w=1000',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: '3:45',
    location: 'Masjid al-Haram, Makkah',
    description: 'Atmospheric video capturing peaceful spiritual night Tawaf prayers in Makkah.'
  },
  {
    id: 'v2',
    title: 'Prophet Mosque Evening Adhan & Courtyard',
    titleAr: 'أذان المغرب بالمسجد النبوي الشريف',
    type: 'video',
    imageUrl: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&q=80&w=1000',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    duration: '2:50',
    location: 'Madinah al-Munawwarah',
    description: 'Spiritual video recording of Maghrib adhan echoing across Al-Masjid an-Nabawi.'
  },
  {
    id: 'v3',
    title: 'Delta Group Departure & Talbiyah Journey',
    titleAr: 'رحلة مغادرة معتمري دلتا مع التلبية',
    type: 'video',
    imageUrl: 'https://images.unsplash.com/photo-1572949645841-094f3a9c4c94?auto=format&fit=crop&q=80&w=1000',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    duration: '4:15',
    location: 'Ethiopian Airlines & Saudia Direct Flight',
    description: 'Heartwarming video of Delta Travel pilgrims reciting Talbiyah together on board.'
  },
  {
    id: 'v4',
    title: 'Guided Ziyarah Tour of Mount Uhud & Quba Mosque',
    titleAr: 'جولة زيارة جبل أحد ومسجد قباء',
    type: 'video',
    imageUrl: 'https://images.unsplash.com/photo-1565552070092-2313627f12aa?auto=format&fit=crop&q=80&w=1000',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    duration: '5:10',
    location: 'Madinah Historic Landmarks',
    description: 'Educational Ziyarah video led by our experienced Islamic scholars and guides.'
  }
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Sheikh Ibrahim Omar',
    location: 'Addis Ababa, Ethiopia',
    rating: 5,
    text: 'Alhamdulillah, Delta Travel made our Umrah journey so smooth! From flight bookings on Ethiopian Airlines to full Mutawwif guide support in Makkah.',
    textAr: 'الحمد لله، جعلت شركة دلتا للسفريات رحلة العمرة سلسة للغاية! من حجز الطيران إلى الإرشاد في مكة والمدينة.',
    packageTaken: 'Standard Comfort Umrah Package',
    date: 'June 2026',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 't2',
    name: 'Amina Yassin',
    location: 'Dire Dawa, Ethiopia',
    rating: 5,
    text: 'As a woman traveling with my family, security and organization were my top priorities. Delta Travel exceeded all expectations.',
    textAr: 'بصفتي امرأة تسافر مع عائلتي، كانت السلامة والتنظيم من أهم أولوياتي. لقد فاقت شركة دلتا كل توقعاتنا.',
    packageTaken: 'Premium Group Umrah Package',
    date: 'May 2026',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
  }
];
