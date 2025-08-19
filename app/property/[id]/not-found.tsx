import Link from 'next/link'

export default function PropertyNotFound() {
  return (
    <div className='min-h-screen bg-white flex items-center justify-center'>
      <div className='text-center'>
        <h1 className='text-4xl font-bold text-gray-900 mb-4'>
          Property Not Found
        </h1>
        <p className='text-gray-600 mb-8'>
          The property you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <div className='space-x-4'>
          <Link
            href='/listings'
            className='inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors'
          >
            Browse All Properties
          </Link>
          <Link
            href='/'
            className='inline-block bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors'
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
