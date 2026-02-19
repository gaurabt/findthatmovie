# FindThatMovie 🎬

A smart movie discovery application that helps you find films based on your description. Simply describe what you remember about a movie, and our AI-powered search will match it to the right film!

## Overview

**FindThatMovie** is an intelligent web application built with Next.js and powered by cutting-edge AI technology. Whether you remember just a plot detail, a scene, or a character description, our app uses Google's Gemini AI to understand your description and the TMDB database to find the exact movie you're looking for.

## Features

- 🤖 **AI-Powered Search**: Uses Google Gemini to intelligently interpret your movie descriptions
- 🎥 **Comprehensive Database**: Access to thousands of movies through TMDB API
- ⚡ **Fast & Responsive**: Built with Next.js for optimal performance
- 🎨 **Modern UI**: Clean, intuitive interface using Tailwind CSS
- 📱 **Mobile Friendly**: Responsive design works on all devices

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org) 15.5.4
- **Language**: TypeScript
- **AI Engine**: [Google Generative AI (Gemini)](https://ai.google.dev/)
- **Movie Database**: [The Movie Database (TMDB)](https://www.themoviedb.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Runtime**: React 19.1.0

## Getting Started

### Prerequisites

- Node.js 18+ (or your preferred Node version)
- npm or yarn package manager
- Google Gemini API key
- TMDB API key

### Installation

1. Clone the repository:

```bash
git clone https://github.com/gaurabt/findthatmovie.git
cd findthatmovie
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   - Create a `.env.local` file in the root directory
   - Add your API keys:

```env
GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint

## Project Structure

```
findThatMovie/
├── app/
│   ├── api/
│   │   └── search/
│   │       └── route.ts      # Search API endpoint
│   ├── layout.tsx            # Application layout
│   ├── page.tsx              # Home page
│   └── globals.css           # Global styles
├── components/
│   ├── SearchBar.tsx         # Search input component
│   ├── SearchPanel.tsx       # Search panel container
│   ├── SearchResults.tsx     # Results display component
│   └── MovieCard.tsx         # Individual movie card
├── utils/
│   ├── gemini.ts            # Gemini AI integration
│   ├── tmdb.ts              # TMDB API integration
│   └── searchProcessor.ts   # Search logic processor
└── public/                   # Static assets
```

## API Integration

### Google Gemini AI

Converts user descriptions into relevant search terms using natural language processing

### TMDB API

Fetches movie data including:

- Movie titles and descriptions
- Release dates
- Ratings and votes
- Poster images

## Future Enhancements

- [ ] User authentication and saved searches
- [ ] Advanced filters (genre, year, rating)
- [ ] Multiple language support
- [ ] Movie recommendations
- [ ] Share functionality

## Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

## Author

Created with ❤️ by [gaurabt](https://github.com/gaurabt)
