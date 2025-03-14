export const categoryPatterns = [
    { pattern: /coffee|wing machine|starbucks|paan|biryani|pasta|momo|tim hortons|Paandian Vilas|Biryani Nation|Thalassery|dunkin|mcdonalds|burger king|kfc|subway|chipotle|pizza hut|dominos|popeyes|wendys|taco bell|panera|arby's|chick-fil-a|pizz|SHAWARMA|/i, category: "Food" },
    { pattern: /uber|lyft|taxi|cab|hertz|avis|car|sonet|cooperators|enterprise|go train|budget|gas|shell|esso|bp|petro|go train|via rail|greyhound|amtrak|presto|air canada|westjet|delta|american airlines|parking|car insurance|united airlines/i, category: "Transport" },
    { pattern: /walmart|NOFRILLS|yal|eraa|costco|loblaws|sobeys|metro|no frills|whole foods|freshco|trader joe|aldi|food basics|wegmans|jian hing|FUSION|fusion market|batala/i, category: "Groceries" },
    { pattern: /amazon|best buy|walmart|DOLLARAMA|target|ikea|costco|home depot|lowes|sephora|macy|zara|h&m|nike|adidas/i, category: "Shopping" },
    { pattern: /netflix|spotify|disney|apple music|hotstar|jio|aha|zee|willow|prime video|youtube premium|hulu|hbo|crave|showtime|playstation|xbox/i, category: "Entertainment" },
    { pattern: /hydro|electric|enbridge|bell|rogers|telus|verizon|at&t|vodafone|internet|gas bill|koodo|virgin|water bill/i, category: "Utilities" },
    { pattern: /walgreens|cvs|shoppers drug mart|pharmacy|dental|clinic|hospital|blue cross|manulife|sun life/i, category: "Healthcare" },
    { pattern: /udemy|coursera|edx|udacity|skillshare|college|university|online course/i, category: "Education" },
    { pattern: /linkedin|zoom|google workspace|aws|stripe|paypal|square|godaddy|shopify|notion|slack/i, category: "Business" },
    { pattern: /rent|mortgage|property|realty|condo|apartment|remax|zillow|airbnb/i, category: "Housing" },
    { pattern: /LCBO|SAQ|BEER/i, category: "Drinks" },
  ];


 export  function categorizeExpense(merchant: string) {
    for (const { pattern, category } of categoryPatterns) {
      if (pattern.test(merchant)) {
        return category;
      }
    }
    return "Others";
  }
  