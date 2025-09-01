# Professional Company Management Dashboard

![App Preview](https://imgix.cosmicjs.com/d45478c0-8729-11f0-822a-71b898000c45-photo-1460925895917-afdab827c52f-1756727417216.jpg?w=1200&h=300&fit=crop&auto=format,compress)

A comprehensive React dashboard for managing your company's content including services, team members, testimonials, and case studies. Built with Next.js 15, TypeScript, and Tailwind CSS, this dashboard provides an intuitive interface for viewing, editing, and managing all your business content.

## Features

- **📊 Dashboard Overview** - Real-time statistics and content summaries
- **🔧 Services Management** - Create, edit, and manage your service offerings
- **👥 Team Management** - Manage team member profiles and information
- **⭐ Testimonials** - Handle client testimonials and ratings
- **📈 Case Studies** - Manage detailed project case studies
- **🔍 Advanced Search** - Filter and search across all content types
- **📱 Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **🎨 Modern UI** - Clean, professional interface with smooth animations

<!-- CLONE_PROJECT_BUTTON -->

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> "Create a content model for a company website with services, team members, testimonials, and case studies"

### Code Generation Prompt

> Create a React dashboard that displays and manages my existing content

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## Technologies Used

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **CMS:** Cosmic
- **Icons:** Lucide React
- **Charts:** Chart.js with react-chartjs-2
- **Runtime:** Bun

## Getting Started

### Prerequisites

- Bun installed on your machine
- A Cosmic account with your content bucket set up

### Installation

1. Install dependencies:
```bash
bun install
```

2. Set up environment variables:
```bash
# Copy the example env file
cp .env.example .env.local

# Add your Cosmic credentials
COSMIC_BUCKET_SLUG=your-bucket-slug
COSMIC_READ_KEY=your-read-key
COSMIC_WRITE_KEY=your-write-key
```

3. Run the development server:
```bash
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Cosmic SDK Examples

```typescript
// Fetch all services
const services = await cosmic.objects.find({
  type: 'services'
}).props(['id', 'title', 'slug', 'metadata']).depth(1);

// Get a single case study with related data
const caseStudy = await cosmic.objects.findOne({
  type: 'case-studies',
  slug: 'project-slug'
}).depth(2);

// Create a new testimonial
await cosmic.objects.insertOne({
  type: 'testimonials',
  title: 'New Testimonial',
  metadata: {
    client_name: 'John Doe',
    testimonial_text: 'Great service!',
    rating: { key: '5', value: '5 Stars' }
  }
});
```

## Cosmic CMS Integration

This dashboard is designed to work seamlessly with your Cosmic content structure:

- **Services** - Manage service offerings with descriptions, pricing, and features
- **Team Members** - Handle team profiles with photos and social links
- **Testimonials** - Client feedback with ratings and related services
- **Case Studies** - Detailed project showcases with galleries and team assignments

## Deployment Options

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in the Vercel dashboard
4. Deploy automatically

### Netlify
1. Build the project: `bun run build`
2. Deploy the `out` folder to Netlify
3. Configure environment variables in Netlify settings

### Other Platforms
The app can be deployed to any platform that supports Next.js applications.
