# Daily Dose

Your daily dose of amazing content — all in one place!
A Next.js app that displays all sorts of words, quotes, facts, space images, cocktails, activities, and historical moments from multiple APIs. Refreshes every single daily for a fresh experience every time you visit.

## 🌟 Features

- **Word of the Day** - Expand your vocabulary with a new word, its definition, and usage examples
- **Quote of the Day** - Be inspired with a thought-provoking quote from famous personalities
- **Fact of the Day** - Learn something new with a random fact that will amaze you
- **NASA APOD** - Explore the cosmos with stunning images from NASA's Astronomy Picture of the Day
- **Cocktail of the Day** - Discover a new drink recipe to try and impress your friends
- **Activity of the Day** - Beat boredom with a random activity suggestion to try today
- **Historical Fact of the Day** - Travel back in time with an interesting historical fact from this day

## 🌐 APIs Used

- **Wordnik** (Word of the Day) — `https://api.wordnik.com`
- **ZenQuotes** (Quote of the Day) — `https://zenquotes.io`
- **API Ninjas** (Fact of the Day) — `https://api-ninjas.com/api/facts`
- **NASA APOD** (NASA APOD) — `https://api.nasa.gov/planetary/apod`
- **TheCocktailDB** (Cocktail of the Day) — `https://www.thecocktaildb.com`
- **Bored API** (Activity of the Day) — `https://bored.api.lewagon.com/api/activity`
- **Today in History (Muffinlabs)** (Historical Fact of the Day) — `https://history.muffinlabs.com/date/{month}/{day}`

## 🚀 Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the Repository:
```bash
git clone <https://github.com/rusheen7/dailyDose.git>
cd dailydose
```

2. Install Dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 API Keys Setup

Create a .env.local file and do the following:
1. Visit [NASA API Portal](https://api.nasa.gov/)
2. Sign up for a free API key
3. Add to your `.env.local` file
```bash
API_NINJAS_API_KEY="your-api-key-here"
```


1. Visit [Wordnik](https://developer.wordnik.com/)
2. Sign up for a free API key
3. Add to your `.env.local` file
```bash
NASA_API_KEY=your-api-key-here
```
