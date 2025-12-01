export const categoryPatterns = [
    { pattern: /coffee|TASTE|AMAYA|WOK & FORTUNE|wing machine|TEA|INDRAPRASTHA|starbucks|paan|biryani|pasta|momo|VADAPAV|tim hortons|DAIRY|THARAVADU|a&w|KARAIKUDI|MANCHUWOK|CARIBBEAN|VINDALOO|JERK|CUISINE|SAMOSA|SARAVANAA|Gus|tacos|BREWHOUSE|Sweets|brew|CHATIME|Paandian Vilas|SECOND WIFE|DELIGHTS|SQUEEZED|NANGLO|KITCHEN|eater|SURABI|CURRY|BURGER|BOURBON|TROPICAL|Biryani Nation|JUICERY|Thalassery|dunkin|mcdonald|burger king|kfc|subway|chipotle|pizza hut|ORUMA|dominos|popeyes|wendys|taco bell|panera|chick-fil-a|pizz|SHAWARMA/i, category: "Food" },
    { pattern: /walgreens|cvs|shoppers drug mart|pharmacy|dental|clinic|hospital|blue cross|manulife|sun life|PHARMACY|phar/i, category: "Healthcare" },
    { pattern: /uber|lyft|taxi|cab|hertz|avis|sonet|cooperators|enterprise|go train|budget|gas|SHRINE|CRUISE|shell|esso|bp|petro|go train|via rail|greyhound|amtrak|presto|air canada|PARKS|westjet|delta|MOBILITE|american airlines|FEVER|ONTPARK|parking|car insurance|united airlines|HOPP|BASILIQUE|TRAVEL|AIR-SERV|TOYOTA|AIRFLIGHT|ETR/i, category: "Transport" },
    { pattern: /walmart|PANCHVATI|NOFRILLS|yal|eraa|costco|loblaws|LOBLAW|sobeys|metro|RCSS|no frills|nofrills|whole foods|freshco|trader joe|aldi|food basics|wegmans|GOURMET|jian hing|FUSION|fusion market|batala/i, category: "Groceries" },
    { pattern: /amazon|walmart|DOLLARAMA|target|ikea|costco|home depot|lowes|sephora|macy|zara|h&m|nike|URBAN BEHAVIOR|Lovisa|UNDER ARMOUR|CANADIAN TIRE|adidas|BlueNotes|SVP|tommy|Hilfiger|OUTLET|OUTFITTERS|URBAN PLANET|OLD NAVY|GAP|MACYS|PUMA/i, category: "Shopping" },
    { pattern: /netflix|Amazon.ca Prime Member|spotify|disney|apple music|hotstar|jio|aha|zee|KENNEDY BOWL|willow|prime video|youtube premium|hulu|hbo|crave|showtime|Microsoft|Google One|playstation|xbox|ip tv/i, category: "Entertainment" },
    { pattern: /hydro|electric|enbridge|bell|rogers|telus|verizon|at&t|vodafone|internet|gas bill|koodo|virgin|water bill|phone bill|mobile bill/i, category: "Utilities" },
    { pattern: /udemy|coursera|GOOGLE|edx|udacity|skillshare|college|university|online course|cursor|openai|STARKCAMP|github copilot|GREATFRONTEND|LIBRARY/i, category: "Education" },
    { pattern: /linkedin|zoom|google workspace|aws|stripe|paypal|square|godaddy|shopify|notion|slack|NAME-CHEAP/i, category: "Business" },
    { pattern: /rent|mortgage|property|realty|condo|apartment|remax|zillow|airbnb/i, category: "Housing" },
    { pattern: /BEST BUY|BESTBUY|Staples|the Source|Ebay/i, category: "Electronics" },
    { pattern: /lcbo|saq|beer/i, category: "Drinks" },
  ];


 export  function categorizeExpense(merchant: string) {
    for (const { pattern, category } of categoryPatterns) {
      if (new RegExp(pattern).test(merchant)) {
        return category;
      }
    }
    return "Others";
  }
