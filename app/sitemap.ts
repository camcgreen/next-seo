import { MetadataRoute } from 'next'
import { getAllPropertyIds } from '../lib/api'

// Dynamic sitemap generation for SEO
// This helps search engines discover all pages on your site
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://your-domain.com' // Replace with your actual domain

  // Get all property IDs for dynamic routes
  const propertyIds = await getAllPropertyIds()

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/listings`,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 0.9,
    },
  ]

  // Dynamic property pages
  const propertyPages = propertyIds.map((id) => ({
    url: `${baseUrl}/property/${id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // City-specific listing pages for SEO
  const cities = ['manchester', 'birmingham', 'nottingham', 'leeds']
  const cityPages = cities.map((city) => ({
    url: `${baseUrl}/listings?city=${city}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...propertyPages, ...cityPages]
}
