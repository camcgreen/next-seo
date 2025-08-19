import Link from 'next/link'
import { getPropertyStats } from '../lib/api'
import type { Metadata } from 'next'

// RENDERING STRATEGY: SSG (Static Site Generation)
// This page is generated at BUILD TIME and served as static HTML
// Perfect for landing pages that don't change often
// Benefits: Fastest loading, best SEO, cached by CDN

export const metadata: Metadata = {
  title: 'UK Rental Properties | Find Your Perfect Home',
  description:
    'Discover rental properties across Manchester, Birmingham, Nottingham, and Leeds. From studios to family homes, find your perfect rental property.',
  keywords: [
    'rental properties',
    'UK rentals',
    'Manchester',
    'Birmingham',
    'Nottingham',
    'Leeds',
    'apartments',
    'houses',
  ],
  openGraph: {
    title: 'UK Rental Properties | Find Your Perfect Home',
    description:
      'Discover rental properties across Manchester, Birmingham, Nottingham, and Leeds.',
    type: 'website',
    url: 'https://your-domain.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UK Rental Properties | Find Your Perfect Home',
    description:
      'Discover rental properties across Manchester, Birmingham, Nottingham, and Leeds.',
  },
}

// This runs at BUILD TIME (not on each request)
export default async function Home() {
  // This API call happens during the build process
  const stats = await getPropertyStats()

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

      {/* Hero Section */}
      <main className='max-w-6xl mx-auto px-4 py-8'>
        <section className='text-center mb-12'>
          <h2 className='text-4xl font-bold text-gray-900 mb-4'>
            Find Your Perfect Rental Property
          </h2>
          <p className='text-xl text-gray-600 mb-8'>
            Discover quality rental properties across the UK&apos;s major cities
          </p>

          {/* Quick Stats - This data was fetched at BUILD TIME */}
          <div className='bg-gray-50 rounded-lg p-6 mb-8'>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              <div>
                <div className='text-2xl font-bold text-blue-600'>
                  {stats.totalProperties}
                </div>
                <div className='text-sm text-gray-600'>
                  Properties Available
                </div>
              </div>
              <div>
                <div className='text-2xl font-bold text-blue-600'>
                  {stats.cities.length}
                </div>
                <div className='text-sm text-gray-600'>Cities Covered</div>
              </div>
              <div>
                <div className='text-2xl font-bold text-blue-600'>
                  £{stats.averagePrice}
                </div>
                <div className='text-sm text-gray-600'>
                  Average Monthly Rent
                </div>
              </div>
              <div>
                <div className='text-2xl font-bold text-blue-600'>
                  £{stats.priceRange.min}-{stats.priceRange.max}
                </div>
                <div className='text-sm text-gray-600'>Price Range</div>
              </div>
            </div>
          </div>

          <Link
            href='/listings'
            className='inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors'
          >
            Browse All Properties
          </Link>
        </section>

        {/* Featured Cities */}
        <section className='mb-12'>
          <h3 className='text-2xl font-bold text-gray-900 mb-6 text-center'>
            Popular Cities
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {stats.cities.map((city) => (
              <Link
                key={city}
                href={`/listings?city=${city.toLowerCase()}`}
                className='block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow'
              >
                <h4 className='text-lg font-semibold text-gray-900 mb-2'>
                  {city}
                </h4>
                <p className='text-gray-600'>Explore properties in {city}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* SEO Content */}
        <section className='prose max-w-none'>
          <h3 className='text-2xl font-bold text-gray-900 mb-4'>
            Why Choose Our Rental Properties?
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div>
              <h4 className='text-lg font-semibold mb-2'>Quality Assured</h4>
              <p className='text-gray-600 mb-4'>
                All our rental properties are carefully vetted to ensure they
                meet high standards of quality and safety.
              </p>

              <h4 className='text-lg font-semibold mb-2'>Prime Locations</h4>
              <p className='text-gray-600'>
                From Manchester&apos;s vibrant city centre to Birmingham&apos;s
                historic quarters, find properties in the UK&apos;s most
                desirable locations.
              </p>
            </div>
            <div>
              <h4 className='text-lg font-semibold mb-2'>
                Transparent Pricing
              </h4>
              <p className='text-gray-600 mb-4'>
                No hidden fees or surprises. All rental prices are clearly
                displayed with full details of what&apos;s included.
              </p>

              <h4 className='text-lg font-semibold mb-2'>Easy Search</h4>
              <p className='text-gray-600'>
                Filter by city, bedrooms, bathrooms, and price to find exactly
                what you&apos;re looking for.
              </p>
            </div>
          </div>
        </section>
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
              <strong>Rendering Strategy:</strong> This page uses SSG (Static
              Site Generation) - built at build time for maximum performance and
              SEO.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
