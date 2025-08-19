import Link from 'next/link'
import { getProperty, getPopularPropertyIds } from '../../../lib/api'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

// RENDERING STRATEGY: SSG with Fallback
// This demonstrates Next.js's most powerful feature:
// - Popular properties (1,2,3) are pre-generated at BUILD TIME
// - Other properties are generated on-demand when first visited
// - Once generated, they're cached as static pages
// - Perfect balance of performance, SEO, and scalability

interface Props {
  params: Promise<{ id: string }>
}

// This function tells Next.js which pages to pre-generate at build time
export async function generateStaticParams() {
  // Only pre-generate the "popular" properties (1, 2, 3)
  // Other properties will be generated on-demand with fallback
  const popularIds = await getPopularPropertyIds()

  console.log(
    '🏗️  Pre-generating these property pages at build time:',
    popularIds
  )

  return popularIds.map((id) => ({
    id: id,
  }))
}

// Generate dynamic metadata for each property
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const property = await getProperty(id)

  if (!property) {
    return {
      title: 'Property Not Found | UK Rental Properties',
    }
  }

  return {
    title: `${property.title} - £${property.price}/month | ${property.city} Rental`,
    description: `${property.description} Located in ${property.address}. ${property.bedrooms} bedrooms, ${property.bathrooms} bathrooms. Available from ${property.availableFrom}.`,
    keywords: [
      property.city.toLowerCase(),
      'rental property',
      `${property.bedrooms} bedroom`,
      ...property.features.map((f) => f.toLowerCase()),
    ],
    openGraph: {
      title: `${property.title} - £${property.price}/month`,
      description: property.description,
      type: 'article',
      images: [
        {
          url: property.imageUrl,
          width: 1200,
          height: 630,
          alt: property.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${property.title} - £${property.price}/month`,
      description: property.description,
    },
  }
}

export default async function PropertyPage({ params }: Props) {
  // This will either:
  // 1. Return pre-generated data (for properties 1,2,3)
  // 2. Generate the page on-demand and cache it (for properties 4,5,6,7,8)
  // 3. Return null if property doesn't exist
  const { id } = await params
  const property = await getProperty(id)

  // Handle 404 case
  if (!property) {
    notFound()
  }

  // Check if this was pre-generated or generated on-demand
  const isPreGenerated = ['1', '2', '3'].includes(id)

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

      <main className='max-w-4xl mx-auto px-4 py-8'>
        {/* Breadcrumb */}
        <nav className='mb-6'>
          <ol className='flex items-center space-x-2 text-sm text-gray-600'>
            <li>
              <Link href='/' className='hover:text-blue-600'>
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href='/listings' className='hover:text-blue-600'>
                Properties
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link
                href={`/listings?city=${property.city.toLowerCase()}`}
                className='hover:text-blue-600'
              >
                {property.city}
              </Link>
            </li>
            <li>/</li>
            <li className='text-gray-900'>{property.title}</li>
          </ol>
        </nav>

        {/* Property Header */}
        <div className='mb-8'>
          <h2 className='text-3xl font-bold text-gray-900 mb-2'>
            {property.title}
          </h2>
          <p className='text-gray-600 mb-4'>{property.address}</p>
          <div className='flex items-center justify-between'>
            <div className='text-2xl font-bold text-blue-600'>
              £{property.price}/month
            </div>
            <div className='text-sm text-gray-500'>
              Available from{' '}
              {new Date(property.availableFrom).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Property Image */}
        <div className='mb-8'>
          <div className='h-96 bg-gray-300 rounded-lg flex items-center justify-center'>
            <span className='text-gray-600'>Property Image Placeholder</span>
          </div>
        </div>

        {/* Property Details Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8'>
          {/* Main Details */}
          <div className='lg:col-span-2'>
            <h3 className='text-xl font-bold text-gray-900 mb-4'>
              Property Description
            </h3>
            <p className='text-gray-700 mb-6 leading-relaxed'>
              {property.description}
            </p>

            <h4 className='text-lg font-semibold text-gray-900 mb-3'>
              Features
            </h4>
            <div className='grid grid-cols-2 gap-2 mb-6'>
              {property.features.map((feature) => (
                <div key={feature} className='flex items-center text-gray-700'>
                  <span className='w-2 h-2 bg-blue-600 rounded-full mr-3'></span>
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className='lg:col-span-1'>
            <div className='bg-gray-50 rounded-lg p-6 sticky top-8'>
              <h4 className='text-lg font-semibold text-gray-900 mb-4'>
                Property Details
              </h4>

              <div className='space-y-3 mb-6'>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Bedrooms</span>
                  <span className='font-semibold'>
                    {property.bedrooms === 0 ? 'Studio' : property.bedrooms}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Bathrooms</span>
                  <span className='font-semibold'>{property.bathrooms}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>City</span>
                  <span className='font-semibold'>{property.city}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Monthly Rent</span>
                  <span className='font-semibold text-blue-600'>
                    £{property.price}
                  </span>
                </div>
              </div>

              <button className='w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-4'>
                Contact Agent
              </button>

              <button className='w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors'>
                Save Property
              </button>
            </div>
          </div>
        </div>

        {/* Related Properties */}
        <section className='mb-8'>
          <h3 className='text-xl font-bold text-gray-900 mb-6'>
            More Properties in {property.city}
          </h3>
          <div className='text-center'>
            <Link
              href={`/listings?city=${property.city.toLowerCase()}`}
              className='inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors'
            >
              View All Properties in {property.city}
            </Link>
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
            <div className='mt-2 text-sm text-gray-400'>
              <p>
                <strong>Rendering Strategy:</strong> SSG with Fallback - This
                page was{' '}
                {isPreGenerated
                  ? 'pre-generated at build time'
                  : 'generated on-demand and cached'}
                .
              </p>
              <p className='mt-1'>
                Properties 1-3 are pre-built for instant loading. Properties 4-8
                are built when first visited, then cached.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* JSON-LD Structured Data for SEO */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'RentAction',
            object: {
              '@type': 'Accommodation',
              name: property.title,
              description: property.description,
              address: {
                '@type': 'PostalAddress',
                streetAddress: property.address,
                addressLocality: property.city,
                addressCountry: 'GB',
              },
              numberOfBedrooms: property.bedrooms,
              numberOfBathroomsTotal: property.bathrooms,
              amenityFeature: property.features.map((feature) => ({
                '@type': 'LocationFeatureSpecification',
                name: feature,
              })),
            },
            price: property.price,
            priceCurrency: 'GBP',
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: property.price,
              priceCurrency: 'GBP',
              unitCode: 'MON',
            },
          }),
        }}
      />
    </div>
  )
}
