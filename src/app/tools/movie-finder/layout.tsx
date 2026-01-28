import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Movie Finder - Free Movie Discovery Tool | Glen Pais",
  description: "Discover movies from around the world. Filter by country, year, rating, genre, and more using the IMDB API. Free movie finder tool for finding your next favorite film.",
  keywords: [
    "movie finder",
    "movie search",
    "IMDB API",
    "movie discovery",
    "film finder",
    "movie filter",
    "movie database",
    "free movie tool",
    "movie search tool",
    "find movies",
    "movie recommendations",
    "film search",
  ],
  authors: [{ name: "Glen Pais", url: "https://flavglen.dev" }],
  creator: "Glen Pais",
  publisher: "Glen Pais",
  openGraph: {
    title: "Movie Finder - Free Movie Discovery Tool | Glen Pais",
    description: "Discover movies from around the world. Filter by country, year, rating, genre, and more using the IMDB API. Free movie finder tool for finding your next favorite film.",
    type: "website",
    url: "https://flavglen.dev/tools/movie-finder",
    siteName: "Glen Pais Portfolio",
    images: [
      {
        url: "https://flavglen.dev/tools/movie-finder-og.png",
        width: 1200,
        height: 630,
        alt: "Movie Finder Tool - Discover Movies from Around the World",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Movie Finder - Free Movie Discovery Tool",
    description: "Discover movies from around the world. Filter by country, year, rating, genre, and more using the IMDB API.",
    images: ["https://flavglen.dev/tools/movie-finder-og.png"],
    creator: "@flavglen",
    site: "@flavglen",
  },
  alternates: {
    canonical: "https://flavglen.dev/tools/movie-finder",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "Tools",
}

export default function MovieFinderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
