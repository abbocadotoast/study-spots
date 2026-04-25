export interface StudySpot {
  id: number;
  name: string;
  image: string;
  rating: number;
  distance: string;
  status: string;
  tags: string[];
  occupancy: string;
  campus?: string;
}

export const initialSpots: StudySpot[] = [
  {
    id: 1,
    name: 'Main Library - 4th Floor',
    image: 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    distance: '0.2 mi away',
    status: 'Open until 12 AM',
    tags: ['Quiet', 'Outlets', 'Focus'],
    occupancy: 'High',
  },
  {
    id: 2,
    name: 'Campus Coffee Roasters',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    rating: 4.5,
    distance: '0.5 mi away',
    status: 'Open until 8 PM',
    tags: ['Coffee', 'Groups', 'Lively'],
    occupancy: 'Medium',
  },
  {
    id: 3,
    name: 'Science Building Atrium',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    rating: 4.2,
    distance: '0.4 mi away',
    status: 'Open 24/7',
    tags: ['Open late', 'Natural light'],
    occupancy: 'Low',
  },
  {
    id: 4,
    name: 'Engineering Computer Lab',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    distance: '0.3 mi away',
    status: 'Open until 10 PM',
    tags: ['Quiet', 'Dual monitors', 'Outlets'],
    occupancy: 'Medium',
  },
];
