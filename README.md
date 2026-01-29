# 💅 Nail Studio

A beautiful nail art inspiration portal built for Elena, featuring a modern pink-themed design with Pinterest-style layouts.

## 🌟 Features

- **🎨 Beautiful Pink Theme**: Soft pinks, hot pink accents, and rose gold highlights
- **📱 Mobile-First Design**: Optimized for phone usage with responsive layouts  
- **🔍 Smart Search**: Powered by Brave Search API for nail art inspiration
- **📌 Pinterest-Style Grid**: Masonry layout for browsing nail designs
- **💾 Save & Organize**: Create collections and save your favorite ideas
- **🤔 AI Suggestions**: "Help Me Decide" feature for personalized recommendations
- **✨ Modern UI**: Clean components with soft shadows and rounded corners

## 🚀 Live Demo

- **Production**: https://nail-studio-poralp921-jean-pierre-webbs-projects.vercel.app
- **Aliased**: https://nail-studio-orcin.vercel.app

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS with custom pink theme
- **Typography**: Poppins font family
- **Database**: Prisma (currently mocked for v1)
- **Deployment**: Vercel
- **Search API**: Brave Search API
- **Language**: TypeScript

## 📱 Pages

- **🏠 Home**: Hero section with trending nail art grid
- **🔍 Search**: Search for nail art with smart filtering
- **💡 Ideas**: Save and organize your nail art inspirations  
- **📁 Collections**: Pinterest-style boards for organizing designs
- **🎯 Help Me Decide**: AI-powered suggestions based on preferences

## 🎨 Design System

### Colors
- **Primary Pink**: #ec4899
- **Soft Pink**: #fdf2f8, #fce7f3
- **Rose Gold**: #f59e0b
- **Backgrounds**: Gradient from soft pink to white

### Components
- **Navbar**: Responsive navigation with gradient logo
- **SearchBar**: Prominent search with popular suggestions
- **MasonryGrid**: Pinterest-style responsive layout
- **ImageCard**: Nail art display with save/source actions
- **Modal**: Clean modals for creating collections/ideas

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd nail-studio

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Add your BRAVE_API_KEY

# Run development server
npm run dev

# Build for production
npm run build
```

### Environment Variables
```env
BRAVE_API_KEY=your_brave_search_api_key
```

## 🏗️ Project Structure

```
src/
├── app/                 # App Router pages
│   ├── api/            # API routes (search, collections, ideas)
│   ├── collections/    # Collections page
│   ├── ideas/          # Ideas page  
│   ├── search/         # Search page
│   ├── suggest/        # Help Me Decide page
│   └── page.tsx        # Home page
├── components/         # Reusable UI components
│   ├── ImageCard.tsx   # Nail art image display
│   ├── MasonryGrid.tsx # Pinterest-style grid
│   ├── Navbar.tsx      # Main navigation
│   └── SearchBar.tsx   # Search component
└── lib/
    └── prisma.ts       # Database client (mocked)
```

## 📋 Todo / Future Features

- [ ] **Real Database**: Replace mock Prisma with actual Turso database
- [ ] **User Authentication**: User accounts and personal collections
- [ ] **Social Features**: Share collections and follow other users
- [ ] **Advanced AI**: Smarter nail art recommendations
- [ ] **Trend Analysis**: Track popular nail art trends over time
- [ ] **Photo Upload**: Allow users to upload their own nail photos
- [ ] **Tutorial Integration**: Step-by-step nail art tutorials
- [ ] **Shopping Integration**: Links to nail products and tools

## 🎯 Built For Elena

This nail art inspiration portal was specifically designed for Elena (JP's 12-year-old daughter), with:
- **Mobile-friendly interface** for easy browsing on her phone
- **Beautiful pink aesthetic** matching her style preferences  
- **Simple, intuitive navigation** that's easy to understand
- **Visual-first experience** perfect for discovering nail art inspiration
- **Safe, curated content** appropriate for young users

## 🚀 Deployment

The app is automatically deployed to Vercel on every push to the main branch.

### Manual Deployment
```bash
npm run build
npx vercel --prod
```

## 📄 License

Built with ❤️ for Elena by George (AI)