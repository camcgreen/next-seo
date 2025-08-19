// Mock API for rental properties with simulated delays
// This demonstrates how Next.js rendering strategies work with real API calls

export interface Property {
  id: string
  title: string
  description: string
  city: string
  bedrooms: number
  bathrooms: number
  price: number // monthly rent in GBP
  imageUrl: string
  address: string
  features: string[]
  availableFrom: string
}

// Mock data for rental properties
const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Modern City Centre Apartment',
    description:
      'A stunning modern apartment in the heart of Manchester city centre with excellent transport links and amenities nearby.',
    city: 'Manchester',
    bedrooms: 2,
    bathrooms: 1,
    price: 1200,
    imageUrl: '/api/placeholder/400/300',
    address: '15 Deansgate, Manchester M1 5QG',
    features: ['City Centre', 'Modern', 'Transport Links', 'Balcony'],
    availableFrom: '2024-02-01',
  },
  {
    id: '2',
    title: 'Victorian House with Garden',
    description:
      'Beautiful Victorian terraced house in Birmingham with original features and a lovely garden.',
    city: 'Birmingham',
    bedrooms: 3,
    bathrooms: 2,
    price: 950,
    imageUrl: '/api/placeholder/400/300',
    address: '42 Moseley Road, Birmingham B12 9AD',
    features: ['Garden', 'Victorian', 'Original Features', 'Parking'],
    availableFrom: '2024-01-15',
  },
  {
    id: '3',
    title: 'Student-Friendly Flat',
    description:
      'Perfect for students or young professionals, close to University of Nottingham with all bills included.',
    city: 'Nottingham',
    bedrooms: 1,
    bathrooms: 1,
    price: 650,
    imageUrl: '/api/placeholder/400/300',
    address: '88 University Boulevard, Nottingham NG7 2RD',
    features: ['Bills Included', 'University Area', 'Furnished', 'WiFi'],
    availableFrom: '2024-03-01',
  },
  {
    id: '4',
    title: 'Luxury Penthouse',
    description:
      'Exclusive penthouse apartment in Leeds with panoramic city views and premium finishes throughout.',
    city: 'Leeds',
    bedrooms: 3,
    bathrooms: 3,
    price: 1800,
    imageUrl: '/api/placeholder/400/300',
    address: 'The Sky, 1 Aire Street, Leeds LS1 4PR',
    features: ['Penthouse', 'City Views', 'Luxury', 'Concierge'],
    availableFrom: '2024-01-20',
  },
  {
    id: '5',
    title: 'Family Home with Parking',
    description:
      'Spacious family home in a quiet residential area of Manchester with driveway parking and garden.',
    city: 'Manchester',
    bedrooms: 4,
    bathrooms: 2,
    price: 1400,
    imageUrl: '/api/placeholder/400/300',
    address: '23 Oak Avenue, Manchester M20 4WX',
    features: ['Family Home', 'Parking', 'Garden', 'Quiet Area'],
    availableFrom: '2024-02-15',
  },
  {
    id: '6',
    title: 'Canal-Side Apartment',
    description:
      'Contemporary apartment overlooking the historic canals of Birmingham with waterside walks.',
    city: 'Birmingham',
    bedrooms: 2,
    bathrooms: 2,
    price: 1100,
    imageUrl: '/api/placeholder/400/300',
    address: 'Canal Wharf, Birmingham B1 2JB',
    features: ['Canal Views', 'Contemporary', 'Waterside', 'Historic Area'],
    availableFrom: '2024-01-10',
  },
  {
    id: '7',
    title: 'City Centre Studio',
    description:
      "Compact but perfectly formed studio apartment in the heart of Nottingham's shopping district.",
    city: 'Nottingham',
    bedrooms: 0, // Studio
    bathrooms: 1,
    price: 550,
    imageUrl: '/api/placeholder/400/300',
    address: 'Central Square, Nottingham NG1 5FS',
    features: ['Studio', 'City Centre', 'Shopping District', 'Compact'],
    availableFrom: '2024-02-20',
  },
  {
    id: '8',
    title: 'Georgian Townhouse',
    description:
      'Elegant Georgian townhouse in Leeds with period features and modern conveniences.',
    city: 'Leeds',
    bedrooms: 4,
    bathrooms: 3,
    price: 1600,
    imageUrl: '/api/placeholder/400/300',
    address: 'Park Square, Leeds LS1 2NE',
    features: ['Georgian', 'Period Features', 'Townhouse', 'Historic'],
    availableFrom: '2024-03-10',
  },
]

// Simulate API delay (realistic response times)
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Get all properties with optional filtering
export async function getProperties(filters?: {
  city?: string
  bedrooms?: number
  bathrooms?: number
  maxPrice?: number
}): Promise<Property[]> {
  // Simulate API call delay
  await delay(300 + Math.random() * 200) // 300-500ms delay

  let filteredProperties = [...MOCK_PROPERTIES]

  if (filters) {
    if (filters.city) {
      filteredProperties = filteredProperties.filter(
        (property) =>
          property.city.toLowerCase() === filters.city!.toLowerCase()
      )
    }

    if (filters.bedrooms !== undefined) {
      filteredProperties = filteredProperties.filter(
        (property) => property.bedrooms >= filters.bedrooms!
      )
    }

    if (filters.bathrooms !== undefined) {
      filteredProperties = filteredProperties.filter(
        (property) => property.bathrooms >= filters.bathrooms!
      )
    }

    if (filters.maxPrice !== undefined) {
      filteredProperties = filteredProperties.filter(
        (property) => property.price <= filters.maxPrice!
      )
    }
  }

  return filteredProperties
}

// Get a single property by ID
export async function getProperty(id: string): Promise<Property | null> {
  // Simulate API call delay
  await delay(200 + Math.random() * 100) // 200-300ms delay

  const property = MOCK_PROPERTIES.find((p) => p.id === id)
  return property || null
}

// Get property IDs that should be pre-generated at build time
// In a real app, these might be your most popular properties
export async function getPopularPropertyIds(): Promise<string[]> {
  await delay(100) // Quick call for build-time
  // Let's pre-generate the first 3 properties (simulating "popular" ones)
  return ['1', '2', '3']
}

// Get ALL property IDs (for sitemap generation, etc.)
export async function getAllPropertyIds(): Promise<string[]> {
  await delay(100)
  return MOCK_PROPERTIES.map((property) => property.id)
}

// Get summary stats for homepage
export async function getPropertyStats(): Promise<{
  totalProperties: number
  cities: string[]
  averagePrice: number
  priceRange: { min: number; max: number }
}> {
  await delay(150)

  const cities = [...new Set(MOCK_PROPERTIES.map((p) => p.city))]
  const prices = MOCK_PROPERTIES.map((p) => p.price)
  const averagePrice = Math.round(
    prices.reduce((a, b) => a + b, 0) / prices.length
  )

  return {
    totalProperties: MOCK_PROPERTIES.length,
    cities,
    averagePrice,
    priceRange: {
      min: Math.min(...prices),
      max: Math.max(...prices),
    },
  }
}
