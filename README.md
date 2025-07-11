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
- **TypeScript**
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

**Note:** The app works without API keys using fallback data, but having them it what makes the experience.

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

**Daily Dose** - Your daily dose of amazing content! 🌟
