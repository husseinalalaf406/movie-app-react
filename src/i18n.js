import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      logo: "NetMovies",
      home: "Home",
      discover: "Discover",
      genres: "Genres",
      favorites: "Favorites",
      searchPlaceholder: "Search movies...",
      searchButton: "Search",
      clearSearch: "Clear search query",
      themeSwitchLight: "Switch to Light Mode",
      themeSwitchDark: "Switch to Dark Mode",
      
      // Discover subtitles
      trending: "Trending",
      trendingSub: "Most watched by fans worldwide.",
      nowPlaying: "Now Playing",
      nowPlayingSub: "Movies currently in theaters.",
      upcoming: "Upcoming",
      upcomingSub: "New releases coming soon.",
      topRated: "Top Rated",
      topRatedSub: "Highest rated movies of all time.",
      tvShows: "TV Shows",
      tvShowsSub: "What’s hot this week on TV.",
      
      // Genres subtitles
      comedy: "Comedy",
      comedySub: "Hilarious and funny movies.",
      action: "Action",
      actionSub: "Thrilling and fast-paced action.",
      kids: "Kids",
      kidsSub: "Fun animations for the family.",
      interests: "Interests",
      interestsSub: "Based on what you love.",
      
      // Movies page (Home.js sections)
      basedOnInterests: "Based on your interests",
      popularTvShows: "Popular TV Shows",
      kidsFamily: "Kids & Family",
      topRatedMovies: "Top Rated Movies",
      scrollNext: "Scroll forward",
      scrollPrev: "Scroll back",
      scrollLeft: "Scroll left",
      scrollRight: "Scroll right",
      
      // Details page
      releaseDate: "Release Date:",
      rating: "Rating:",
      duration: "Duration:",
      minutes: "min",
      overview: "Overview",
      movieStory: "Storyline",
      addFavorites: "🤍 Add to Favorites",
      removeFavorites: "❤️ Remove Favorite",
      watchTrailer: "▶ Watch Trailer",
      closeTrailer: "Close Trailer X",
      noPoster: "No Poster",
      cast: "Cast",
      trailer: "Official Trailer",
      trailerNotAvailable: "Trailer Not Available",
      similarMovies: "Similar Movies",
      movieFacts: "Movie Facts",
      runtimeLabel: "Runtime",
      originalLanguage: "Original Language",
      country: "Country",
      productionCompanies: "Production Companies",
      budget: "Budget",
      revenue: "Revenue",
      popularity: "Popularity",
      voteCount: "Vote Count",
      unknown: "Unknown",
      reviews: "Reviews",
      readMore: "Read More",
      readLess: "Read Less",
      noReviews: "No reviews available for this movie.",
      previous: "Previous",
      next: "Next",
      pageOf: "Page {{current}} of {{total}}",
      
      // Search page
      searchResults: "Search Results",
      noResults: "No results found for",
      
      // Favorites page
      myFavorites: "My Favorites",
      noFavoritesText: "You haven't added any movies to your favorites yet. Start exploring now!",
      exploreMovies: "Explore Movies",
      
      // AI Movie Assistant (Hero.js)
      aiAssistant: "AI Movie Assistant",
      aiSub: "Tell me your mood — I'll pick your perfect watch",
      aiWelcomeTitle: "What's your vibe tonight?",
      aiWelcomeText: "Describe your day or mood and I'll find the perfect film or show for your evening.",
      aiInputPlaceholder: "Describe your day or mood… (Ctrl+Enter to send)",
      aiErrorKey: "Error: OpenRouter API Key is missing.",
      aiErrorGeneric: "I couldn't process that request right now. Please try again.",
      aiErrorOccurred: "An error occurred:",
      aiChatVibe: "🎬 What's your vibe tonight?",
      
      // Suggestions
      sugStress: "🎬 Long stressful day",
      sugAction: "🤩 Hyped for action",
      sugCry: "😢 Need a good cry",
      sugThought: "🧠 Something thought-provoking",
    }
  },
  ar: {
    translation: {
      logo: "نت موفيز",
      home: "الرئيسية",
      discover: "اكتشف",
      genres: "التصنيفات",
      favorites: "المفضلة",
      searchPlaceholder: "ابحث عن أفلام...",
      searchButton: "بحث",
      clearSearch: "مسح نص البحث",
      themeSwitchLight: "التحويل للوضع المضيء",
      themeSwitchDark: "التحويل للوضع المظلم",
      
      // Discover subtitles
      trending: "الأكثر رواجاً",
      trendingSub: "الأفلام الأكثر مشاهدة من قبل المعجبين حول العالم.",
      nowPlaying: "يُعرض الآن",
      nowPlayingSub: "الأفلام المعروضة حالياً في دور السينما.",
      upcoming: "قريباً",
      upcomingSub: "الإصدارات الجديدة القادمة قريباً.",
      topRated: "الأعلى تقييماً",
      topRatedSub: "أعلى الأفلام تقييماً على الإطلاق.",
      tvShows: "المسلسلات",
      tvShowsSub: "أبرز المسلسلات التلفزيونية هذا الأسبوع.",
      
      // Genres subtitles
      comedy: "كوميدي",
      comedySub: "أفلام مضحكة ومسلية للغاية.",
      action: "حركة",
      actionSub: "أفلام حركة وإثارة سريعة الإيقاع.",
      kids: "أطفال",
      kidsSub: "رسوم متحركة ممتعة لجميع أفراد العائلة.",
      interests: "الاهتمامات",
      interestsSub: "بناءً على تفضيلاتك وما تحب.",
      
      // Movies page (Home.js sections)
      basedOnInterests: "بناءً على اهتماماتك",
      popularTvShows: "مسلسلات تلفزيونية شعبية",
      kidsFamily: "أطفال وعائلة",
      topRatedMovies: "الأفلام الأعلى تقييماً",
      scrollNext: "التمرير للأمام",
      scrollPrev: "التمرير للخلف",
      scrollLeft: "التمرير لليسار",
      scrollRight: "التمرير لليمين",
      
      // Details page
      releaseDate: "تاريخ الإصدار:",
      rating: "التقييم:",
      duration: "المدة:",
      minutes: "دقيقة",
      overview: "قصة الفيلم",
      movieStory: "قصة الفيلم",
      addFavorites: "🤍 أضف للمفضلة",
      removeFavorites: "❤️ إزالة من المفضلة",
      watchTrailer: "▶ شاهد العرض الدعائي",
      closeTrailer: "إغلاق العرض الدعائي X",
      noPoster: "لا يوجد ملصق",
      cast: "طاقم العمل",
      trailer: "العرض الدعائي الرسمي",
      trailerNotAvailable: "العرض الدعائي غير متوفر",
      similarMovies: "أفلام مشابهة",
      movieFacts: "حقائق عن الفيلم",
      runtimeLabel: "مدة العرض",
      originalLanguage: "اللغة الأصلية",
      country: "بلد الإنتاج",
      productionCompanies: "شركات الإنتاج",
      budget: "الميزانية",
      revenue: "الإيرادات",
      popularity: "الشعبية",
      voteCount: "عدد المصوتين",
      unknown: "غير معروف",
      reviews: "المراجعات والآراء",
      readMore: "اقرأ المزيد",
      readLess: "عرض أقل",
      noReviews: "لا توجد مراجعات متاحة لهذا الفيلم.",
      previous: "السابق",
      next: "التالي",
      pageOf: "صفحة {{current}} من {{total}}",
      
      // Search page
      searchResults: "نتائج البحث",
      noResults: "لم يتم العثور على نتائج لـ",
      
      // Favorites page
      myFavorites: "أفلامي المفضلة",
      noFavoritesText: "لم تقم بإضافة أي أفلام إلى المفضلة بعد. ابدأ الاستكشاف الآن!",
      exploreMovies: "استكشف الأفلام",
      
      // AI Movie Assistant (Hero.js)
      aiAssistant: "مساعد الأفلام الذكي",
      aiSub: "أخبرني عن مزاجك، وسأختار لك السهرة المثالية",
      aiWelcomeTitle: "كيف حال يومك؟ وما هو مزاجك الليلة؟",
      aiWelcomeText: "احكِ لي كيف كان يومك أو ما المزاج الذي أنت عليه، وسأرشح لك أفضل ما يناسبك.",
      aiInputPlaceholder: "احكِ لي عن يومك أو مزاجك... (Ctrl+Enter للإرسال)",
      aiErrorKey: "خطأ: لم يتم العثور على مفتاح الـ API الخاص بـ OpenRouter.",
      aiErrorGeneric: "لم أتمكن من معالجة الطلب حالياً. يرجى المحاولة مرة أخرى.",
      aiErrorOccurred: "حدث خطأ:",
      aiChatVibe: "🎬 ما مزاجك الليلة؟",
      
      // Suggestions
      sugStress: "🎬 يوم متعب ومرهق",
      sugAction: "🤩 أبحث عن أكشن",
      sugCry: "😢 أريد فيلماً مؤثراً",
      sugThought: "🧠 شيء يحرك التفكير",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem("app-language") || "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
