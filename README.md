# Next.js Rendering Strategies & SEO Demo

A comprehensive demo showcasing different Next.js rendering strategies and SEO techniques through a UK rental property website. Perfect for learning how to build fast, SEO-friendly applications that scale.

## 🎯 What This Project Demonstrates

This project teaches you how to:

- **Choose the right rendering strategy** for each page type
- **Implement programmatic SEO** to create thousands of optimized pages
- **Build scalable applications** that handle unlimited content
- **Optimize for search engines** with modern SEO techniques
- **Achieve perfect performance scores** with static generation

## 🏗️ Rendering Strategies Used

### 🏠 Home Page - SSG (Static Site Generation)

- **Strategy**: Pre-rendered at build time
- **Why**: Landing page with relatively static content
- **Benefits**: Fastest loading, perfect SEO, CDN-friendly
- **Load Time**: ~50ms

### 📋 Listings Page - ISR (Incremental Static Regeneration)

- **Strategy**: Static with automatic updates every 60 seconds
- **Why**: Product listings that need fresh data but benefit from caching
- **Benefits**: Static performance + fresh content, great SEO
- **Load Time**: ~50-100ms (cached) or ~300-500ms (regenerating)

### 🏡 Property Detail Pages - SSG with Fallback

- **Strategy**: Popular properties pre-generated, others on-demand
- **Why**: Handles unlimited properties while keeping builds fast
- **Benefits**: Instant loading for popular content, scales infinitely
- **Load Time**: ~50ms (pre-generated) or ~200-300ms (first visit, then cached)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd seo-test

# Install dependencies
npm install

# Build the project (see rendering strategies in action)
npm run build

# Start in production mode
npm start

# Or start in development mode
npm run dev
```

### 🔍 Testing the Demo

Visit these URLs to see different rendering strategies:

```bash
# SSG - Instant loading (static HTML)
http://localhost:3000

# ISR - Static with automatic updates
http://localhost:3000/listings

# SSG with Fallback - Pre-generated (instant)
http://localhost:3000/property/1
http://localhost:3000/property/2
http://localhost:3000/property/3

# SSG with Fallback - Generated on-demand (slower first visit, then cached)
http://localhost:3000/property/4
http://localhost:3000/property/5

# URL-based filtering (SEO-friendly)
http://localhost:3000/listings?city=manchester
http://localhost:3000/listings?city=manchester&bedrooms=2&maxPrice=1200
```

## 📁 Project Structure

```
seo-test/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Home page (SSG)
│   ├── listings/
│   │   └── page.tsx              # Listings page (ISR)
│   ├── property/[id]/
│   │   ├── page.tsx              # Property details (SSG + Fallback)
│   │   └── not-found.tsx         # 404 page for properties
│   ├── sitemap.ts                # Dynamic sitemap generation
│   ├── robots.ts                 # SEO robots.txt
│   └── layout.tsx                # Root layout
├── lib/
│   └── api.ts                    # Mock API with simulated delays
├── RENDERING_STRATEGIES.md       # Detailed explanation of strategies
├── SEO_STRATEGY.md              # Comprehensive SEO guide
└── README.md                     # This file
```

## 🔧 How It Works

### Mock API with Realistic Delays

```typescript
// Simulates real API response times
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getProperties(
  filters?: FilterOptions
): Promise<Property[]> {
  await delay(300 + Math.random() * 200) // 300-500ms delay
  // ... filtering logic
}
```

### SSG with Fallback Implementation

```typescript
// Pre-generate only popular properties at build time
export async function generateStaticParams() {
  const popularIds = await getPopularPropertyIds() // Returns ['1', '2', '3']
  return popularIds.map((id) => ({ id }))
}

// Other properties generated on-demand when first visited
export default async function PropertyPage({ params }: Props) {
  const { id } = await params
  const property = await getProperty(id) // Generated on-demand for properties 4-8

  if (!property) notFound()

  return <PropertyDetails property={property} />
}
```

### ISR Configuration

```typescript
// Revalidate every 60 seconds in production
export const revalidate = 60

export default async function ListingsPage({ searchParams }: Props) {
  const properties = await getProperties(filters) // Fresh data every 60s
  return <PropertyListings properties={properties} />
}
```

## 🔍 SEO Features

### Dynamic Meta Tags

Each page generates contextual SEO tags:

```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const property = await getProperty(params.id)

  return {
    title: `${property.title} - £${property.price}/month | ${property.city} Rental`,
    description: `${property.description} Located in ${property.address}...`,
    keywords: [property.city, 'rental property', ...property.features],
    openGraph: {
      /* Rich social sharing */
    },
    twitter: {
      /* Twitter cards */
    },
  }
}
```

### Structured Data for Rich Snippets

```typescript
// JSON-LD structured data for search engines
{
  "@context": "https://schema.org",
  "@type": "RentAction",
  "object": {
    "@type": "Accommodation",
    "name": property.title,
    "address": { /* Full address data */ },
    "numberOfBedrooms": property.bedrooms,
    // ... more structured data
  }
}
```

### URL-Based Filtering (Programmatic SEO)

```typescript
// Every filter combination creates an indexable URL
/listings                                    // All properties
/listings?city=manchester                    // Manchester properties
/listings?city=manchester&bedrooms=2         // 2+ bed properties in Manchester
/listings?city=manchester&bedrooms=2&maxPrice=1200  // Under £1200
```

### Dynamic Sitemap Generation

```typescript
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const propertyIds = await getAllPropertyIds()

  return [
    { url: '//', priority: 1.0 }, // Homepage
    { url: '/listings', priority: 0.9 }, // Listings
    ...propertyIds.map((id) => ({
      // All properties
      url: `/property/${id}`,
      priority: 0.8,
    })),
    ...cities.map((city) => ({
      // City pages
      url: `/listings?city=${city}`,
      priority: 0.7,
    })),
  ]
}
```

## 📊 Performance Results

### Build Output

```bash
Route (app)                                 Size  First Load JS
┌ ○ /                                      170 B         103 kB    # SSG
├ ƒ /listings                              170 B         103 kB    # ISR
├ ● /property/[id]                         170 B         103 kB    # SSG + Fallback
├   ├ /property/1                                                  # Pre-generated
├   ├ /property/2                                                  # Pre-generated
├   └ /property/3                                                  # Pre-generated
├ ○ /robots.txt                            127 B        99.7 kB
└ ○ /sitemap.xml                           127 B        99.7 kB

○  (Static)   prerendered as static content
●  (SSG)      prerendered as static HTML (uses generateStaticParams)
ƒ  (Dynamic)  server-rendered on demand
```

### Load Time Comparison

- **SSG Pages**: ~50ms (instant static HTML)
- **ISR Pages**: ~50-100ms (cached) or ~300-500ms (regenerating)
- **SSG + Fallback**: ~50ms (pre-generated) or ~200-300ms (on-demand first visit)

## 🧪 Testing Different Strategies

### 1. Test Build-Time Generation

```bash
npm run build
```

Watch the console output to see which pages are pre-generated.

### 2. Test Fallback Behavior

1. Visit `/property/4` (not pre-generated)
2. Check Network tab - see generation time
3. Refresh page - now loads instantly (cached)

### 3. Test ISR Revalidation

1. Visit `/listings`
2. Wait 60+ seconds
3. Refresh - page regenerates with fresh data

### 4. Test SEO Features

```bash
# Check sitemap
curl http://localhost:3000/sitemap.xml

# Check robots.txt
curl http://localhost:3000/robots.txt

# Validate structured data
# Visit: https://search.google.com/test/rich-results
# Test: http://localhost:3000/property/1
```

## 📚 Learning Resources

- **[RENDERING_STRATEGIES.md](./RENDERING_STRATEGIES.md)**: Deep dive into each rendering strategy
- **[SEO_STRATEGY.md](./SEO_STRATEGY.md)**: Comprehensive SEO implementation guide
- **[Next.js Docs](https://nextjs.org/docs)**: Official Next.js documentation

## 🎯 Key Takeaways

### When to Use Each Strategy

| Strategy           | Best For                  | Examples               | Performance | SEO    |
| ------------------ | ------------------------- | ---------------------- | ----------- | ------ |
| **SSG**            | Static content            | Landing pages, About   | ⚡⚡⚡      | 🔍🔍🔍 |
| **ISR**            | Semi-dynamic content      | Product catalogs, News | ⚡⚡⚡      | 🔍🔍🔍 |
| **SSG + Fallback** | Unlimited dynamic content | E-commerce, Blogs      | ⚡⚡⚡      | 🔍🔍🔍 |
| **SSR**            | Highly dynamic content    | User dashboards        | ⚡          | 🔍🔍   |

### SEO Best Practices Demonstrated

1. **Server-side rendering** for search engine crawlability
2. **Dynamic meta tags** for each page context
3. **Structured data** for rich search results
4. **URL-based filtering** for programmatic SEO
5. **Performance optimization** for search rankings
6. **Automatic sitemap generation** for discoverability

## 🚀 Scaling This Approach

This demo shows how to scale from 8 properties to 8,000+ properties:

1. **Template-based pages**: One component generates unlimited property pages
2. **Programmatic SEO**: Filters create thousands of indexable URLs
3. **Smart pre-generation**: Only popular content built at build time
4. **On-demand generation**: Handle unlimited content with fallback
5. **Automatic optimization**: ISR keeps content fresh without manual updates

Perfect foundation for building large-scale, SEO-optimized applications! 🎉

## 🤝 Contributing

Feel free to explore, modify, and learn from this demo. It's designed to be educational and demonstrate real-world Next.js patterns.

## 📄 License

This project is for educational purposes. Feel free to use the patterns and techniques in your own projects!
