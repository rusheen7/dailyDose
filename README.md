# Daily Dose 💊

Your daily dose of amazing content! A Next.js app that aggregates various daily content from different APIs, refreshing daily to provide you with words, quotes, facts, space images, cocktails, activities, and historical moments.

## Features 🌟

- **Word of the Day** - Expand your vocabulary with new words, definitions, and examples
- **Quote of the Day** - Get inspired with thought-provoking quotes from famous personalities
- **Fact of the Day** - Learn something new with random useless facts
- **NASA Picture of the Day** - Explore the cosmos with stunning images from NASA
- **Cocktail of the Day** - Discover new drink recipes to try
- **Activity Suggestion** - Beat boredom with random activity suggestions
- **Historical Fact** - Travel back in time with historical facts from this day

## Tech Stack 🛠️

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Server-Side Rendering (SSR)** for optimal performance
- **API Integration** with multiple external services

## APIs Used 🌐

- **WordsAPI** (RapidAPI) - Word definitions and examples
- **Quotable API** - Inspirational quotes
- **Useless Facts API** - Random facts
- **NASA APOD API** - Astronomy Picture of the Day
- **TheCocktailDB API** - Cocktail recipes
- **BoredAPI** - Activity suggestions
- **Today in History API** - Historical facts

## Getting Started 🚀

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd dailydose
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (optional for enhanced features):
```bash
# Create a .env.local file
cp .env.example .env.local
```

Add the following variables to `.env.local`:
```env
# NASA API Key (optional - uses DEMO_KEY if not provided)
NASA_API_KEY=your_nasa_api_key_here

# RapidAPI Key (optional - for enhanced word features)
RAPIDAPI_KEY=your_rapidapi_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Keys Setup 🔑

### NASA API Key (Optional)
1. Visit [NASA API Portal](https://api.nasa.gov/)
2. Sign up for a free API key
3. Add to your `.env.local` file

### RapidAPI Key (Optional)
1. Visit [RapidAPI](https://rapidapi.com/)
2. Sign up and subscribe to WordsAPI
3. Add to your `.env.local` file

**Note:** The app works without API keys using fallback data, but having them enhances the experience.

## Project Structure 📁

```
dailydose/
├── app/
│   ├── components/
│   │   └── Navigation.tsx
│   ├── word-of-the-day/
│   │   ├── page.tsx
│   │   └── WordOfTheDay.tsx
│   ├── quote-of-the-day/
│   │   ├── page.tsx
│   │   └── QuoteOfTheDay.tsx
│   ├── fact-of-the-day/
│   │   ├── page.tsx
│   │   └── FactOfTheDay.tsx
│   ├── nasa-picture/
│   │   ├── page.tsx
│   │   └── NasaPicture.tsx
│   ├── cocktail-of-the-day/
│   │   ├── page.tsx
│   │   └── CocktailOfTheDay.tsx
│   ├── activity-suggestion/
│   │   ├── page.tsx
│   │   └── ActivitySuggestion.tsx
│   ├── historical-fact/
│   │   ├── page.tsx
│   │   └── HistoricalFact.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── public/
├── package.json
└── README.md
```

## Features in Detail 📋

### Word of the Day
- Fetches random words with definitions
- Shows part of speech and example usage
- Uses WordsAPI for comprehensive word data

### Quote of the Day
- Displays inspirational quotes
- Shows author and tags
- Uses Quotable API for diverse quotes

### Fact of the Day
- Random useless facts
- Includes source attribution
- Uses Useless Facts API

### NASA Picture of the Day
- High-quality space images
- Detailed explanations
- Uses NASA's APOD API

### Cocktail of the Day
- Complete cocktail recipes
- Ingredients and instructions
- Uses TheCocktailDB API

### Activity Suggestion
- Random activity ideas
- Difficulty and cost indicators
- Uses BoredAPI

### Historical Fact
- Historical events from today's date
- Year and detailed descriptions
- Uses Today in History API

## Performance Optimizations ⚡

- **SSR** for fast initial page loads
- **Caching** with 24-hour revalidation
- **Image optimization** with Next.js Image component
- **Suspense boundaries** for better loading states
- **Fallback data** for API failures

## Styling & UI 🎨

- **Responsive design** for all screen sizes
- **Dark mode support** with Tailwind CSS
- **Beautiful gradients** and modern UI
- **Smooth animations** and transitions
- **Accessible design** with proper contrast and focus states

## Deployment 🚀

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing 🤝

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License 📄

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments 🙏

- All the free APIs that make this project possible
- Next.js team for the amazing framework
- Tailwind CSS for the utility-first styling
- The open-source community for inspiration

---

**Daily Dose** - Your daily dose of amazing content! 🌟
