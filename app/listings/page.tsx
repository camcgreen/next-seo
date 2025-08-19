import Link from 'next/link'
import { getProperties } from '../../lib/api'
import type { Metadata } from 'next'
import { Suspense } from 'react'

// RENDERING STRATEGY: ISR (Incremental Static Regeneration)
// This page is statically generated but can be updated without rebuilding
// Perfect for pages with data that changes occasionally
// Benefits: Static performance + fresh data, great SEO

// Revalidate every 60 seconds (in production)
export const revalidate = 60

interface SearchParams {
  city?: string
  bedrooms?: string
  bathrooms?: string
  maxPrice?: string
}

interface Props {
  searchParams: Promise<SearchParams>
}

// Dynamic metadata based on search params
export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { city, bedrooms } = await searchParams

  let title = 'Browse Rental Properties'
  let description = 'Find rental properties across the UK'

  if (city) {
    title = `Rental Properties in ${
      city.charAt(0).toUpperCase() + city.slice(1)
    }`
    description = `Discover rental properties in ${
      city.charAt(0).toUpperCase() + city.slice(1)
    }`
  }

  if (bedrooms) {
    title += ` - ${bedrooms}+ Bedrooms`
    description += ` with ${bedrooms} or more bedrooms`
  }

  return {
    title: `${title} | UK Rental Properties`,
    description,
    openGraph: {
      title: `${title} | UK Rental Properties`,
      description,
    },
  }
}

// This component handles the filtering UI
function FilterForm({ searchParams }: { searchParams: SearchParams }) {
  const cities = ['Manchester', 'Birmingham', 'Nottingham', 'Leeds']

  return (
    <form method='GET' className='bg-gray-50 p-6 rounded-lg mb-8'>
      <h3 className='text-lg font-semibold mb-4'>Filter Properties</h3>
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <div>
          <label
            htmlFor='city'
            className='block text-sm font-medium text-gray-700 mb-2'
          >
            City
          </label>
          <select
            id='city'
            name='city'
            defaultValue={searchParams.city || ''}
            className='w-full border border-gray-300 rounded-md px-3 py-2'
          >
            <option value=''>All Cities</option>
            {cities.map((city) => (
              <option key={city} value={city.toLowerCase()}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor='bedrooms'
            className='block text-sm font-medium text-gray-700 mb-2'
          >
            Min Bedrooms
          </label>
          <select
            id='bedrooms'
            name='bedrooms'
            defaultValue={searchParams.bedrooms || ''}
            className='w-full border border-gray-300 rounded-md px-3 py-2'
          >
            <option value=''>Any</option>
            <option value='0'>Studio</option>
            <option value='1'>1+</option>
            <option value='2'>2+</option>
            <option value='3'>3+</option>
            <option value='4'>4+</option>
          </select>
        </div>

        <div>
          <label
            htmlFor='bathrooms'
            className='block text-sm font-medium text-gray-700 mb-2'
          >
            Min Bathrooms
          </label>
          <select
            id='bathrooms'
            name='bathrooms'
            defaultValue={searchParams.bathrooms || ''}
            className='w-full border border-gray-300 rounded-md px-3 py-2'
          >
            <option value=''>Any</option>
            <option value='1'>1+</option>
            <option value='2'>2+</option>
            <option value='3'>3+</option>
          </select>
        </div>

        <div>
          <label
            htmlFor='maxPrice'
            className='block text-sm font-medium text-gray-700 mb-2'
          >
            Max Price (£/month)
          </label>
          <select
            id='maxPrice'
            name='maxPrice'
            defaultValue={searchParams.maxPrice || ''}
            className='w-full border border-gray-300 rounded-md px-3 py-2'
          >
            <option value=''>Any Price</option>
            <option value='600'>£600</option>
            <option value='800'>£800</option>
            <option value='1000'>£1,000</option>
            <option value='1200'>£1,200</option>
            <option value='1500'>£1,500</option>
            <option value='2000'>£2,000</option>
          </select>
        </div>
      </div>

      <div className='mt-4 flex gap-4'>
        <button
          type='submit'
          className='bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors'
        >
          Apply Filters
        </button>
        <Link
          href='/listings'
          className='bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors'
        >
          Clear All
        </Link>
      </div>
    </form>
  )
}

// Loading component
function PropertyListingsLoading() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className='bg-gray-200 animate-pulse rounded-lg h-80'
        ></div>
      ))}
    </div>
  )
}

// Property listings component that fetches data
async function PropertyListings({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  // Parse filters from URL params
  const filters: {
    city?: string
    bedrooms?: number
    bathrooms?: number
    maxPrice?: number
  } = {}
  if (searchParams.city) filters.city = searchParams.city
  if (searchParams.bedrooms) filters.bedrooms = parseInt(searchParams.bedrooms)
  if (searchParams.bathrooms)
    filters.bathrooms = parseInt(searchParams.bathrooms)
  if (searchParams.maxPrice) filters.maxPrice = parseInt(searchParams.maxPrice)

  // This API call happens at build time AND every 60 seconds (revalidate)
  const properties = await getProperties(filters)

  if (properties.length === 0) {
    return (
      <div className='text-center py-12'>
        <h3 className='text-xl font-semibold text-gray-900 mb-2'>
          No properties found
        </h3>
        <p className='text-gray-600 mb-4'>
          Try adjusting your filters to see more results.
        </p>
        <Link
          href='/listings'
          className='text-blue-600 hover:text-blue-700 underline'
        >
          View all properties
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className='mb-6'>
        <h3 className='text-lg font-semibold text-gray-900'>
          {properties.length}{' '}
          {properties.length === 1 ? 'property' : 'properties'} found
        </h3>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {properties.map((property) => (
          <Link
            key={property.id}
            href={`/property/${property.id}`}
            className='block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow'
          >
            <div className='h-48 bg-gray-300 flex items-center justify-center'>
              <span className='text-gray-600'>Property Image</span>
            </div>

            <div className='p-4'>
              <h4 className='font-semibold text-gray-900 mb-2'>
                {property.title}
              </h4>
              <p className='text-gray-600 text-sm mb-3 line-clamp-2'>
                {property.description}
              </p>

              <div className='flex justify-between items-center mb-3'>
                <span className='text-lg font-bold text-blue-600'>
                  £{property.price}/month
                </span>
                <span className='text-sm text-gray-500'>{property.city}</span>
              </div>

              <div className='flex items-center text-sm text-gray-600 space-x-4'>
                <span>
                  {property.bedrooms === 0
                    ? 'Studio'
                    : `${property.bedrooms} bed`}
                </span>
                <span>{property.bathrooms} bath</span>
              </div>

              <div className='mt-3 flex flex-wrap gap-1'>
                {property.features.slice(0, 2).map((feature) => (
                  <span
                    key={feature}
                    className='inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded'
                  >
                    {feature}
                  </span>
                ))}
                {property.features.length > 2 && (
                  <span className='inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded'>
                    +{property.features.length - 2} more
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

// Main page component
export default async function ListingsPage({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams
  return (
    <div className='min-h-screen bg-white'>
      {/* Header */}
      <header className='bg-blue-600 text-white'>
        <div className='max-w-6xl mx-auto px-4 py-6'>
          <h1 className='text-3xl font-bold'>UK Rental Properties</h1>
          <nav className='mt-4'>
            <ul className='flex space-x-6'>
              <li>
                <Link href='/' className='hover:underline'>
                  Home
                </Link>
              </li>
              <li>
                <Link href='/listings' className='hover:underline'>
                  Browse Properties
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className='max-w-6xl mx-auto px-4 py-8'>
        <div className='mb-8'>
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>
            Browse Properties
          </h2>
          <p className='text-gray-600'>
            Find your perfect rental property with our advanced filtering
            options.
          </p>
        </div>

        {/* Filter Form */}
        <FilterForm searchParams={resolvedSearchParams} />

        {/* Property Listings with Suspense */}
        <Suspense fallback={<PropertyListingsLoading />}>
          <PropertyListings searchParams={resolvedSearchParams} />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className='bg-gray-800 text-white mt-16'>
        <div className='max-w-6xl mx-auto px-4 py-8'>
          <div className='text-center'>
            <p>
              &copy; 2024 UK Rental Properties. This is a demo for learning
              Next.js rendering strategies.
            </p>
            <p className='mt-2 text-sm text-gray-400'>
              <strong>Rendering Strategy:</strong> This page uses ISR
              (Incremental Static Regeneration) - static generation with
              automatic updates every 60 seconds.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
