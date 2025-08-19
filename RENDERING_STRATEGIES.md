# Next.js Rendering Strategies & SEO Demo

This demo showcases different Next.js rendering strategies and SEO techniques through a rental property website.

## 🏗️ Rendering Strategies Used

### 1. Home Page - SSG (Static Site Generation)

**File:** `app/page.tsx`

```typescript
// This runs at BUILD TIME (not on each request)
export default async function Home() {
  const stats = await getPropertyStats() // Called during build
  // ...
}
```

**How it works:**

- Page is generated at **build time**
- HTML is pre-built and served as static files
- API calls happen during the build process
- Fastest possible loading times
- Perfect for landing pages that don't change often

**Benefits:**

- ⚡ Fastest loading (static HTML)
- 🔍 Excellent SEO (fully rendered HTML)
- 💰 Cheapest hosting (just static files)
- 🚀 CDN-friendly

**When to use:** Landing pages, about pages, marketing pages

---

### 2. Listings Page - ISR (Incremental Static Regeneration)

**File:** `app/listings/page.tsx`

```typescript
// Revalidate every 60 seconds (in production)
export const revalidate = 60

export default function ListingsPage({ searchParams }: Props) {
  // This page is static but updates automatically
}
```

**How it works:**

- Page is generated at **build time** (like SSG)
- But it **automatically updates** every 60 seconds
- First visitor after 60s triggers regeneration
- New version is cached for subsequent visitors
- Best of both worlds: static performance + fresh data

**Benefits:**

- ⚡ Fast loading (static until revalidation)
- 🔄 Always fresh data (updates automatically)
- 🔍 Great SEO (static HTML)
- 📈 Scales well (cached between updates)

**When to use:** Product listings, news articles, any page with data that changes occasionally

---

### 3. Property Detail Pages - SSG with Fallback

**File:** `app/property/[id]/page.tsx`

```typescript
export async function generateStaticParams() {
  // Only pre-generate popular properties (1, 2, 3)
  const popularIds = await getPopularPropertyIds()
  return popularIds.map((id) => ({ id }))
}
```

**How it works:**

- **Build time:** Pre-generates pages for properties 1, 2, 3 ("popular" ones)
- **Runtime:** When someone visits property 4, 5, 6, 7, or 8:
  1. Next.js generates the page on-demand
  2. Caches it as a static page
  3. Future visitors get the cached static version

**Benefits:**

- 🚀 Popular pages load instantly (pre-generated)
- 📈 Handles unlimited content (generates on-demand)
- 🔍 Perfect SEO for all pages (static HTML)
- ⚡ Once generated, pages are as fast as SSG
- 💰 Fast builds (only pre-generate what matters)

**When to use:** E-commerce products, blog posts, user profiles - any dynamic content with some pages more popular than others

---

## 🔍 SEO Techniques Implemented

### 1. Dynamic Meta Tags

Each page generates appropriate meta tags based on content:

```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const property = await getProperty(params.id)
  return {
    title: `${property.title} - £${property.price}/month | ${property.city} Rental`,
    description: `${property.description} Located in ${property.address}...`,
    // OpenGraph, Twitter cards, etc.
  }
}
```

### 2. Structured Data (JSON-LD)

Property pages include structured data for rich snippets:

```typescript
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "RentAction",
    "object": {
      "@type": "Accommodation",
      // ... property details
    }
  }
</script>
```

### 3. URL-Based Filtering

SEO-friendly URLs that search engines can crawl:

- `/listings?city=manchester&bedrooms=2`
- Each filter combination gets its own indexable URL

### 4. Sitemap Generation

Dynamic sitemap includes all pages:

- Static pages (home, listings)
- All property pages
- City-specific listing pages

### 5. Robots.txt

Proper robots.txt configuration to guide search engines.

---

## 🚀 Performance Benefits

### Load Times by Strategy:

1. **SSG (Home):** ~50ms (static HTML)
2. **ISR (Listings):** ~50-100ms (cached) or ~300-500ms (regenerating)
3. **SSG with Fallback (Properties):**
   - Pre-generated: ~50ms
   - On-demand: ~200-300ms (first visit), then ~50ms (cached)

### SEO Benefits:

- All pages serve fully-rendered HTML
- Fast loading times improve search rankings
- Structured data enables rich snippets
- Dynamic meta tags optimize for specific searches

---

## 🧪 Testing the Demo

### 1. Build and Start

```bash
npm run build  # See which pages are pre-generated
npm start      # Production mode to see real performance
```

### 2. Check Pre-generated Pages

During build, you'll see:

```
○ /                    # SSG
○ /listings            # ISR
○ /property/1          # SSG (pre-generated)
○ /property/2          # SSG (pre-generated)
○ /property/3          # SSG (pre-generated)
```

Properties 4-8 are NOT pre-generated but will be created on-demand.

### 3. Test Fallback Behavior

1. Visit `/property/4` - will be generated on-demand
2. Check network tab - see the generation time
3. Refresh - now it's cached and loads instantly

### 4. Test ISR

1. Visit `/listings`
2. Wait 60+ seconds
3. Visit again - page regenerates with fresh data

---

## 📊 When to Use Each Strategy

| Strategy           | Use Case                           | Examples                        | Pros                | Cons                                    |
| ------------------ | ---------------------------------- | ------------------------------- | ------------------- | --------------------------------------- |
| **SSG**            | Static content                     | Landing pages, About            | Fastest, Best SEO   | Content can become stale                |
| **ISR**            | Semi-dynamic content               | Product listings, News          | Fast + Fresh data   | Complexity, Cache invalidation          |
| **SSG + Fallback** | Dynamic content with popular items | E-commerce, Blogs               | Scalable, Great SEO | First-visit delay for unpopular content |
| **SSR**            | Highly dynamic                     | User dashboards, Real-time data | Always fresh        | Slower, Server load                     |

---

## 🎯 Key Takeaways

1. **Choose rendering strategy per page** - don't use one strategy for everything
2. **SSG with Fallback is incredibly powerful** - handles unlimited content with great performance
3. **ISR is perfect for content that changes occasionally** - product catalogs, news sites
4. **SEO requires server-side rendering** - CSR alone isn't enough for search engines
5. **URL structure matters for SEO** - make every filter combination indexable

This demo shows how Next.js's rendering strategies can create fast, SEO-friendly applications that scale to millions of pages!
