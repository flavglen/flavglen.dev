"use client"

import { useState } from "react"
import { Header } from "@/components/sections/Header"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ReactSelect, SelectOption } from "@/components/ui/react-select"
import { Film, Search, Star, Calendar, Clock, Loader2, ArrowLeft, ChevronDown, ChevronUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface Movie {
  id: string
  type: string
  primaryTitle: string
  originalTitle: string
  primaryImage?: {
    url: string
    width: number
    height: number
  }
  startYear?: number
  runtimeSeconds?: number
  genres?: string[]
  rating?: {
    aggregateRating: number
    voteCount: number
  }
  plot?: string
}

export default function MovieFinderPage() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [quickFiltersOpen, setQuickFiltersOpen] = useState(true)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filters, setFilters] = useState({
    types: "MOVIE",
    countryCodes: "",
    languageCodes: "",
    genres: "",
    startYear: "",
    endYear: "",
    minAggregateRating: "7",
    maxAggregateRating: "",
    sortBy: "SORT_BY_POPULARITY",
    limit: "50",
  })

  const handleSearch = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams()
      
      if (filters.types) params.set("types", filters.types)
      if (filters.countryCodes) params.set("countryCodes", filters.countryCodes)
      if (filters.languageCodes) params.set("languageCodes", filters.languageCodes)
      if (filters.genres) params.set("genres", filters.genres)
      if (filters.startYear) params.set("startYear", filters.startYear)
      if (filters.endYear) params.set("endYear", filters.endYear)
      if (filters.minAggregateRating) params.set("minAggregateRating", filters.minAggregateRating)
      if (filters.maxAggregateRating) params.set("maxAggregateRating", filters.maxAggregateRating)
      if (filters.sortBy) params.set("sortBy", filters.sortBy)
      if (filters.limit) params.set("limit", filters.limit)

      const response = await fetch(`https://api.imdbapi.dev/titles?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error("Failed to fetch movies")
      }

      const data = await response.json()
      setMovies(data.titles || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setMovies([])
    } finally {
      setLoading(false)
    }
  }

  const formatRuntime = (seconds?: number) => {
    if (!seconds) return "N/A"
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const typeOptions: SelectOption[] = [
    { value: "MOVIE", label: "Movie" },
    { value: "TV_SERIES", label: "TV Series" },
    { value: "TV_MOVIE", label: "TV Movie" },
    { value: "TV_EPISODE", label: "TV Episode" },
    { value: "TV_SHORT", label: "TV Short" },
    { value: "VIDEO", label: "Video" },
  ]

  const languageOptions: SelectOption[] = [
    { value: "", label: "All Languages" },
    { value: "en", label: "English" },
    { value: "hi", label: "Hindi" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "it", label: "Italian" },
    { value: "pt", label: "Portuguese" },
    { value: "ru", label: "Russian" },
    { value: "ja", label: "Japanese" },
    { value: "ko", label: "Korean" },
    { value: "zh", label: "Chinese" },
    { value: "ar", label: "Arabic" },
    { value: "ta", label: "Tamil" },
    { value: "te", label: "Telugu" },
    { value: "ml", label: "Malayalam" },
    { value: "kn", label: "Kannada" },
    { value: "mr", label: "Marathi" },
    { value: "bn", label: "Bengali" },
    { value: "gu", label: "Gujarati" },
    { value: "pa", label: "Punjabi" },
    { value: "th", label: "Thai" },
    { value: "vi", label: "Vietnamese" },
    { value: "tr", label: "Turkish" },
    { value: "pl", label: "Polish" },
    { value: "nl", label: "Dutch" },
    { value: "sv", label: "Swedish" },
    { value: "no", label: "Norwegian" },
    { value: "da", label: "Danish" },
    { value: "fi", label: "Finnish" },
  ]

  const sortOptions: SelectOption[] = [
    { value: "SORT_BY_POPULARITY", label: "Popularity" },
    { value: "SORT_BY_RELEASE_DATE", label: "Release Date" },
    { value: "SORT_BY_RATING", label: "Rating" },
    { value: "SORT_BY_TITLE", label: "Title" },
  ]

  const genreOptions: SelectOption[] = [
    { value: "", label: "All Genres" },
    { value: "Action", label: "Action" },
    { value: "Adventure", label: "Adventure" },
    { value: "Animation", label: "Animation" },
    { value: "Biography", label: "Biography" },
    { value: "Comedy", label: "Comedy" },
    { value: "Crime", label: "Crime" },
    { value: "Documentary", label: "Documentary" },
    { value: "Drama", label: "Drama" },
    { value: "Family", label: "Family" },
    { value: "Fantasy", label: "Fantasy" },
    { value: "Film-Noir", label: "Film-Noir" },
    { value: "History", label: "History" },
    { value: "Horror", label: "Horror" },
    { value: "Music", label: "Music" },
    { value: "Musical", label: "Musical" },
    { value: "Mystery", label: "Mystery" },
    { value: "Romance", label: "Romance" },
    { value: "Sci-Fi", label: "Sci-Fi" },
    { value: "Sport", label: "Sport" },
    { value: "Thriller", label: "Thriller" },
    { value: "War", label: "War" },
    { value: "Western", label: "Western" },
  ]

  type PresetFilter = {
    id: string
    label: string
    countryCodes: string
    languageCodes: string
    genres: string
    minAggregateRating: string
    sortBy: string
  }

  const predefinedPresets: PresetFilter[] = [
    { id: "us-action", label: "Top US · English · Action · 7+", countryCodes: "US", languageCodes: "en", genres: "Action", minAggregateRating: "7", sortBy: "SORT_BY_POPULARITY" },
    { id: "us-comedy", label: "Top US · English · Comedy · 7+", countryCodes: "US", languageCodes: "en", genres: "Comedy", minAggregateRating: "7", sortBy: "SORT_BY_POPULARITY" },
    { id: "us-drama", label: "Top US · English · Drama · 7+", countryCodes: "US", languageCodes: "en", genres: "Drama", minAggregateRating: "7", sortBy: "SORT_BY_POPULARITY" },
    { id: "us-scifi", label: "Top US · English · Sci-Fi · 7+", countryCodes: "US", languageCodes: "en", genres: "Sci-Fi", minAggregateRating: "7", sortBy: "SORT_BY_POPULARITY" },
    { id: "gb-thriller", label: "Top UK · English · Thriller · 7+", countryCodes: "GB", languageCodes: "en", genres: "Thriller", minAggregateRating: "7", sortBy: "SORT_BY_POPULARITY" },
    { id: "in-hindi-drama", label: "Top India · Hindi · Drama · 7+", countryCodes: "IN", languageCodes: "hi", genres: "Drama", minAggregateRating: "7", sortBy: "SORT_BY_POPULARITY" },
    { id: "in-hindi-action", label: "Top India · Hindi · Action · 7+", countryCodes: "IN", languageCodes: "hi", genres: "Action", minAggregateRating: "7", sortBy: "SORT_BY_POPULARITY" },
    { id: "kr-korean-drama", label: "Top Korea · Korean · Drama · 7+", countryCodes: "KR", languageCodes: "ko", genres: "Drama", minAggregateRating: "7", sortBy: "SORT_BY_POPULARITY" },
    { id: "kr-korean-thriller", label: "Top Korea · Korean · Thriller · 7+", countryCodes: "KR", languageCodes: "ko", genres: "Thriller", minAggregateRating: "7", sortBy: "SORT_BY_POPULARITY" },
    { id: "jp-japanese-animation", label: "Top Japan · Japanese · Animation · 7+", countryCodes: "JP", languageCodes: "ja", genres: "Animation", minAggregateRating: "7", sortBy: "SORT_BY_POPULARITY" },
    { id: "fr-french-drama", label: "Top France · French · Drama · 7+", countryCodes: "FR", languageCodes: "fr", genres: "Drama", minAggregateRating: "7", sortBy: "SORT_BY_POPULARITY" },
    { id: "de-german-thriller", label: "Top Germany · German · Thriller · 7+", countryCodes: "DE", languageCodes: "de", genres: "Thriller", minAggregateRating: "7", sortBy: "SORT_BY_POPULARITY" },
    { id: "es-spanish-drama", label: "Top Spain · Spanish · Drama · 7+", countryCodes: "ES", languageCodes: "es", genres: "Drama", minAggregateRating: "7", sortBy: "SORT_BY_POPULARITY" },
    { id: "br-portuguese-drama", label: "Top Brazil · Portuguese · Drama · 7+", countryCodes: "BR", languageCodes: "pt", genres: "Drama", minAggregateRating: "7", sortBy: "SORT_BY_POPULARITY" },
    { id: "in-tamil-action", label: "Top India · Tamil · Action · 7+", countryCodes: "IN", languageCodes: "ta", genres: "Action", minAggregateRating: "7", sortBy: "SORT_BY_POPULARITY" },
    { id: "in-malayalam-drama", label: "Top India · Malayalam · Drama · 7+", countryCodes: "IN", languageCodes: "ml", genres: "Drama", minAggregateRating: "7", sortBy: "SORT_BY_POPULARITY" },
  ]

  const applyPreset = (preset: PresetFilter) => {
    const nextFilters = {
      ...filters,
      countryCodes: preset.countryCodes,
      languageCodes: preset.languageCodes,
      genres: preset.genres,
      minAggregateRating: preset.minAggregateRating,
      sortBy: preset.sortBy,
    }
    setFilters(nextFilters)
    setError(null)
    setLoading(true)
    const params = new URLSearchParams()
    params.set("types", nextFilters.types)
    if (nextFilters.countryCodes) params.set("countryCodes", nextFilters.countryCodes)
    if (nextFilters.languageCodes) params.set("languageCodes", nextFilters.languageCodes)
    if (nextFilters.genres) params.set("genres", nextFilters.genres)
    if (nextFilters.minAggregateRating) params.set("minAggregateRating", nextFilters.minAggregateRating)
    params.set("sortBy", nextFilters.sortBy)
    params.set("limit", nextFilters.limit)
    fetch(`https://api.imdbapi.dev/titles?${params.toString()}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Failed to fetch movies"))))
      .then((data) => setMovies(data.titles || []))
      .catch((err) => {
        setError(err instanceof Error ? err.message : "An error occurred")
        setMovies([])
      })
      .finally(() => setLoading(false))
  }

  const countryOptions: SelectOption[] = [
    { value: "US", label: "United States (US)" },
    { value: "GB", label: "United Kingdom (GB)" },
    { value: "IN", label: "India (IN)" },
    { value: "CA", label: "Canada (CA)" },
    { value: "AU", label: "Australia (AU)" },
    { value: "DE", label: "Germany (DE)" },
    { value: "FR", label: "France (FR)" },
    { value: "IT", label: "Italy (IT)" },
    { value: "ES", label: "Spain (ES)" },
    { value: "BR", label: "Brazil (BR)" },
    { value: "MX", label: "Mexico (MX)" },
    { value: "JP", label: "Japan (JP)" },
    { value: "KR", label: "South Korea (KR)" },
    { value: "CN", label: "China (CN)" },
    { value: "RU", label: "Russia (RU)" },
    { value: "NL", label: "Netherlands (NL)" },
    { value: "SE", label: "Sweden (SE)" },
    { value: "NO", label: "Norway (NO)" },
    { value: "DK", label: "Denmark (DK)" },
    { value: "FI", label: "Finland (FI)" },
    { value: "PL", label: "Poland (PL)" },
    { value: "TR", label: "Turkey (TR)" },
    { value: "AR", label: "Argentina (AR)" },
    { value: "ZA", label: "South Africa (ZA)" },
    { value: "NZ", label: "New Zealand (NZ)" },
    { value: "IE", label: "Ireland (IE)" },
    { value: "PT", label: "Portugal (PT)" },
    { value: "GR", label: "Greece (GR)" },
    { value: "BE", label: "Belgium (BE)" },
    { value: "CH", label: "Switzerland (CH)" },
    { value: "AT", label: "Austria (AT)" },
    { value: "TH", label: "Thailand (TH)" },
    { value: "VN", label: "Vietnam (VN)" },
    { value: "PH", label: "Philippines (PH)" },
    { value: "ID", label: "Indonesia (ID)" },
    { value: "MY", label: "Malaysia (MY)" },
    { value: "SG", label: "Singapore (SG)" },
    { value: "HK", label: "Hong Kong (HK)" },
    { value: "TW", label: "Taiwan (TW)" },
    { value: "AE", label: "United Arab Emirates (AE)" },
    { value: "SA", label: "Saudi Arabia (SA)" },
    { value: "EG", label: "Egypt (EG)" },
    { value: "NG", label: "Nigeria (NG)" },
    { value: "KE", label: "Kenya (KE)" },
    { value: "IL", label: "Israel (IL)" },
    { value: "PK", label: "Pakistan (PK)" },
    { value: "BD", label: "Bangladesh (BD)" },
    { value: "LK", label: "Sri Lanka (LK)" },
    { value: "NP", label: "Nepal (NP)" },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="container py-8 md:py-12 flex-1">
        <div className="max-w-7xl mx-auto">
          {/* Go Back Button */}
          <div className="mb-6">
            <Link href="/tools">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Tools
              </Button>
            </Link>
          </div>

          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Film className="h-10 w-10 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold font-montserrat">
                <span className="gradient-text bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Movie Finder
                </span>
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover movies from around the world. Filter by country, year, rating, and more.
            </p>
          </div>

          {/* Predefined Quick Filters */}
          <Card className="mb-6">
            <CardHeader
              className="cursor-pointer select-none hover:bg-muted/50 rounded-t-lg transition-colors"
              onClick={() => setQuickFiltersOpen((o) => !o)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Quick filters</CardTitle>
                  <CardDescription>
                    One-click presets: top [country] movies in [language], [genre], IMDB 7+
                  </CardDescription>
                </div>
                {quickFiltersOpen ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
                )}
              </div>
            </CardHeader>
            {quickFiltersOpen && (
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {predefinedPresets.map((preset) => (
                    <Button
                      key={preset.id}
                      variant="outline"
                      size="sm"
                      className="text-xs font-normal whitespace-nowrap"
                      onClick={() => applyPreset(preset)}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>

          {/* Search Filters */}
          <Card className="mb-8">
            <CardHeader
              className="cursor-pointer select-none hover:bg-muted/50 rounded-t-lg transition-colors"
              onClick={() => setFiltersOpen((o) => !o)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Search Filters</CardTitle>
                  <CardDescription>Customize your movie search with these filters</CardDescription>
                </div>
                {filtersOpen ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
                )}
              </div>
            </CardHeader>
            {filtersOpen && (
              <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Type */}
                <div className="space-y-2">
                  <Label htmlFor="types">Type</Label>
                  <ReactSelect
                    options={typeOptions}
                    value={filters.types}
                    onChange={(value) => setFilters({ ...filters, types: value })}
                    placeholder="Select type"
                  />
                </div>

                {/* Country Codes */}
                <div className="space-y-2">
                  <Label htmlFor="countryCodes">Country Code</Label>
                  <ReactSelect
                    options={countryOptions}
                    value={filters.countryCodes}
                    onChange={(value) => setFilters({ ...filters, countryCodes: value })}
                    placeholder="Select country code (e.g., IN, US, GB)"
                    isSearchable
                    isClearable
                  />
                </div>

                {/* Language Codes */}
                <div className="space-y-2">
                  <Label htmlFor="languageCodes">Language</Label>
                  <ReactSelect
                    options={languageOptions}
                    value={filters.languageCodes}
                    onChange={(value) => setFilters({ ...filters, languageCodes: value })}
                    placeholder="All Languages"
                    isSearchable
                    isClearable
                  />
                </div>

                {/* Genres */}
                <div className="space-y-2">
                  <Label htmlFor="genres">Genre</Label>
                  <ReactSelect
                    options={genreOptions}
                    value={filters.genres}
                    onChange={(value) => setFilters({ ...filters, genres: value })}
                    placeholder="All Genres"
                    isSearchable
                    isClearable
                  />
                </div>

                {/* Start Year */}
                <div className="space-y-2">
                  <Label htmlFor="startYear">Start Year</Label>
                  <Input
                    id="startYear"
                    type="number"
                    placeholder="2020"
                    value={filters.startYear}
                    onChange={(e) => setFilters({ ...filters, startYear: e.target.value })}
                  />
                </div>

                {/* End Year */}
                <div className="space-y-2">
                  <Label htmlFor="endYear">End Year</Label>
                  <Input
                    id="endYear"
                    type="number"
                    placeholder="2025"
                    value={filters.endYear}
                    onChange={(e) => setFilters({ ...filters, endYear: e.target.value })}
                  />
                </div>

                {/* Min Rating */}
                <div className="space-y-2">
                  <Label htmlFor="minAggregateRating">Min Rating (0-10)</Label>
                  <Input
                    id="minAggregateRating"
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    placeholder="6.5"
                    value={filters.minAggregateRating}
                    onChange={(e) => setFilters({ ...filters, minAggregateRating: e.target.value })}
                  />
                </div>

                {/* Max Rating */}
                <div className="space-y-2">
                  <Label htmlFor="maxAggregateRating">Max Rating (0-10)</Label>
                  <Input
                    id="maxAggregateRating"
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    placeholder="10"
                    value={filters.maxAggregateRating}
                    onChange={(e) => setFilters({ ...filters, maxAggregateRating: e.target.value })}
                  />
                </div>

                {/* Sort By */}
                <div className="space-y-2">
                  <Label htmlFor="sortBy">Sort By</Label>
                  <ReactSelect
                    options={sortOptions}
                    value={filters.sortBy}
                    onChange={(value) => setFilters({ ...filters, sortBy: value })}
                    placeholder="Select sort option"
                  />
                </div>

                {/* Limit */}
                <div className="space-y-2">
                  <Label htmlFor="limit">Results Limit</Label>
                  <Input
                    id="limit"
                    type="number"
                    min="1"
                    max="100"
                    placeholder="50"
                    value={filters.limit}
                    disabled
                    className="cursor-not-allowed opacity-60"
                  />
                </div>
              </div>

              <Button
                onClick={handleSearch}
                className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search Movies
                  </>
                )}
              </Button>
            </CardContent>
            )}
          </Card>

          {/* Error Message */}
          {error && (
            <Card className="mb-8 border-destructive">
              <CardContent className="pt-6">
                <p className="text-destructive">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {movies.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">
                Found {movies.length} {movies.length === 1 ? "Movie" : "Movies"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {movies.map((movie) => (
                  <Card
                    key={movie.id}
                    className="overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    {movie.primaryImage && (
                      <div className="relative h-64 overflow-hidden">
                        <Image
                          src={movie.primaryImage.url}
                          alt={movie.primaryTitle}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="line-clamp-2 text-lg">{movie.primaryTitle}</CardTitle>
                      {movie.originalTitle !== movie.primaryTitle && (
                        <CardDescription className="line-clamp-1">
                          {movie.originalTitle}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {movie.rating && (
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-semibold">{movie.rating.aggregateRating.toFixed(1)}</span>
                          <span className="text-sm text-muted-foreground">
                            ({movie.rating.voteCount.toLocaleString()} votes)
                          </span>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        {movie.startYear && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {movie.startYear}
                          </div>
                        )}
                        {movie.runtimeSeconds && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatRuntime(movie.runtimeSeconds)}
                          </div>
                        )}
                      </div>

                      {movie.genres && movie.genres.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {movie.genres.slice(0, 3).map((genre) => (
                            <Badge key={genre} variant="secondary" className="text-xs">
                              {genre}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {movie.plot && (
                        <p className="text-sm text-muted-foreground line-clamp-3">{movie.plot}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && movies.length === 0 && !error && (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <Film className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No movies found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search filters and click "Search Movies" to find results.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
