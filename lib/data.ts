export interface StudySpot {
  id: number;
  name: string;
  image: string;
  rating: number;
  location: string;
  status: string;
  tags: string[];
  occupancy: string;
  campus?: string;
  lat?: number;
  lng?: number;
  vibes?: string;
  info?: string;
}

export const PROFILE_AVATARS = [
  "https://imgs.search.brave.com/Qw3nrvrBxUMiPb7ryPkD6Jw8OzNfZhQwfRm5JiDVGx0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzY2LzM3/Lzk0LzY2Mzc5NDRh/MGQyMjM0ODUyNzQz/YTlkYzFmYzQ2NDAz/LmpwZw", // Mushroom
  "https://imgs.search.brave.com/SMA2PGmJMNPNE-gsi2uqAd3bVeY2jTut1lgkd06zGuE/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/ZGFpbHlwYXdzLmNv/bS90aG1iLzBYX3VL/dXpsdElBdmxYU0dY/bFA5eVNxcVlaUT0v/MTUwMHgwL2ZpbHRl/cnM6bm9fdXBzY2Fs/ZSgpOm1heF9ieXRl/cygxNTAwMDApOnN0/cmlwX2ljYygpOmZv/cm1hdCh3ZWJwKS9v/cmFuZ2UtY2F0LXBy/b2ZpbGUtMTI1MDMz/MDA5Mi0yMDAwLWUx/NzM4MGY3MzZjYTQw/MmU5ZTJjMjZkZjlj/NTQ4NzU2LmpwZw", // Orange Cat
  "https://d2h8qhew3fx4cx.cloudfront.net/client/3200/8f812e5282c21f611aae9a486379e868/a97345be7a8225af0a8abb1134daf1f6_small.png", // CS50 Rubber Duck
  "https://imgs.search.brave.com/GAjeDQEH_vL4Uj7JAlIasEeex4pAafLhJ8RTifqepkA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzE1LzE4Lzk3LzE0/LzM2MF9GXzE1MTg5/NzE0MzNfWmprRnd5/WkFjdmF6QWRlaHhX/dG8waEFCdVVSQjdI/a1AuanBn",
  "/avatars/books_glasses.png",
  "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=400&q=80", // Latte art
  "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=400&q=80", // Books 2
  "/avatars/cherry_shrimp.png",
  "https://imgs.search.brave.com/-hESjWpnJcr3glbWv4I7i0-m6WNEWmPXEhdwrFYdwFU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMudW5zcGxhc2gu/Y29tL3Bob3RvLTE2/NDA5NzQzNDk3MzMt/ZjJiODhiYmYxMDhj/P2ZtPWpwZyZxPTYw/Jnc9MzAwMCZpeGxp/Yj1yYi00LjAuMyZp/eGlkPU0zd3hNakEz/ZkRCOE1IeHdhRzkw/Ynkxd1lXZGxmSHg4/ZkdWdWZEQjhmSHg4/ZkE9PQ", // Book on table
  "/avatars/bernese_dog.png",
  "https://d2h8qhew3fx4cx.cloudfront.net/client/3200/e4ae53f1917bf5018c64137b248bf35b/ab6139a81c25974e225b71bb1f8019e8_small.jpeg",
];

export const initialSpots: StudySpot[] = [
  {
    id: 1,
    name: 'Main Library - 4th Floor',
    image: 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    location: '0.2 mi away',
    status: 'Open until 12 AM',
    tags: ['Quiet', 'Outlets', 'Focus'],
    occupancy: 'High',
  },
  {
    id: 2,
    name: 'Campus Coffee Roasters',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    rating: 4.5,
    location: '0.5 mi away',
    status: 'Open until 8 PM',
    tags: ['Coffee', 'Groups', 'Lively'],
    occupancy: 'Medium',
  },
  {
    id: 3,
    name: 'Science Building Atrium',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    rating: 4.2,
    location: '0.4 mi away',
    status: 'Open 24/7',
    tags: ['Open late', 'Natural light'],
    occupancy: 'Low',
  },
  {
    id: 4,
    name: 'Engineering Computer Lab',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    location: '0.3 mi away',
    status: 'Open until 10 PM',
    tags: ['Quiet', 'Dual monitors', 'Outlets'],
    occupancy: 'Medium',
  },
];
