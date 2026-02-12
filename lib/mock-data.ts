export interface Movie {
  id: string;
  tmdbId?: number;
  slug: string;
  title: string;
  titleKh: string;
  posterUrl: string;
  backdropUrl: string;
  trailerUrl: string;
  duration: number;
  genre: string[];
  rating: string;
  subtitleLang: string;
  synopsis: string;
  synopsisKh: string;
  releaseDate: string;
  status: "now_showing" | "coming_soon" | "hidden";
  voteAverage?: number;
  voteCount?: number;
  source?: "mock" | "legend" | "tmdb" | "manual";
}

export interface Showtime {
  id: string;
  movieId: string;
  date: string;
  time: string;
  price: number;
  totalSeats: number;
  bookedSeats: string[];
}

export interface Booking {
  id: string;
  invoiceNumber: string;
  movieId: string;
  showtimeId: string;
  seats: string[];
  customerPhone: string;
  customerEmail: string;
  totalPrice: number;
  discount: number;
  paymentMethod: "bakong" | "visa" | "wallet" | "cash";
  status: "confirmed" | "pending" | "cancelled";
  createdAt: string;
  checkedIn: boolean;
}

export interface SeatLayout {
  rows: { id: string; seats: number; type: string; offset?: number }[];
  blocked: string[];
  wheelchair: string[];
}

export interface RevenueData {
  date: string;
  revenue: number;
  tickets: number;
}

export interface PromoCode {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  maxUses: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
}

export const movies: Movie[] = [
  {
    id: "1",
    tmdbId: 822119,
    slug: "captain-america-brave-new-world",
    title: "Captain America: Brave New World",
    titleKh: "កាប់ទីន អាមេរិក៖ ពិភពលោកថ្មីក្លាហាន",
    posterUrl: "https://image.tmdb.org/t/p/w500/pzIddUEMWhbRfaHNiO07BNE4qx0.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/gsQJOfeW45rLFEEQaGc2fB7GFtx.jpg",
    trailerUrl: "https://www.youtube.com/embed/cL4EjEPEfhg",
    duration: 119,
    genre: ["Action", "Sci-Fi"],
    rating: "PG",
    subtitleLang: "ខ្មែរ",
    synopsis: "Sam Wilson, the new Captain America, finds himself in the middle of an international incident when he must discover the motives behind a nefarious global plot.",
    synopsisKh: "សែម វីលសុន ក្លាយជាកាប់ទីន អាមេរិកថ្មី ដែលរកឃើញខ្លួនឯងស្ថិតនៅកណ្តាលអន្តរជាតិមួយ។",
    releaseDate: "2025-02-14",
    status: "now_showing",
    voteAverage: 6.2,
    voteCount: 1850,
  },
  {
    id: "2",
    tmdbId: 986056,
    slug: "thunderbolts",
    title: "Thunderbolts*",
    titleKh: "ផ្គរលាន់*",
    posterUrl: "https://image.tmdb.org/t/p/w500/m0do9wWBhKzKRBhdFuxSvqaH3Bx.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg",
    trailerUrl: "https://www.youtube.com/embed/dh5Mqnmp9iM",
    duration: 127,
    genre: ["Action", "Adventure"],
    rating: "15",
    subtitleLang: "ខ្មែរ",
    synopsis: "A group of antiheroes are recruited by Valentina Allegra de Fontaine to take on missions deemed too dangerous for regular heroes.",
    synopsisKh: "ក្រុមអង្គរក្សអាក្រក់ត្រូវបានជ្រើសរើសដោយ វ៉ាឡង់ទីណា ដើម្បីធ្វើបេសកកម្មគ្រោះថ្នាក់។",
    releaseDate: "2025-05-02",
    status: "now_showing",
    voteAverage: 7.1,
    voteCount: 920,
  },
  {
    id: "3",
    tmdbId: 209867,
    slug: "superman",
    title: "Superman",
    titleKh: "មនុស្សដែក",
    posterUrl: "https://image.tmdb.org/t/p/w500/rXkJmMHrFaTGKMxESnBCuO0sJaZ.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/rlNGDMVQMnJ1cLfoBbD08ncFPrU.jpg",
    trailerUrl: "https://www.youtube.com/embed/vS3_72Bpf_s",
    duration: 143,
    genre: ["Action", "Sci-Fi"],
    rating: "PG",
    subtitleLang: "EN",
    synopsis: "Superman, a cub reporter in Metropolis, must come to terms with his Kryptonian heritage while facing off against Lex Luthor in James Gunn's new vision.",
    synopsisKh: "មនុស្សដែក អ្នកយកព័ត៌មានថ្មីនៅ Metropolis ត្រូវតែប្រឈមនឹងកេរ្តិ៍មរតកខ្មែរ Kryptonian។",
    releaseDate: "2025-07-11",
    status: "now_showing",
    voteAverage: 7.8,
    voteCount: 450,
  },
  {
    id: "4",
    tmdbId: 575264,
    slug: "mission-impossible-the-final-reckoning",
    title: "Mission: Impossible – The Final Reckoning",
    titleKh: "បេសកកម្មដែលមិនអាចទៅរួច - ការគិតចុងក្រោយ",
    posterUrl: "https://image.tmdb.org/t/p/w500/z5cHUjb9raJCf9AEVfyRSvQJhJH.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/iKnkklCiBfKFEjZg4ibTO0MCGFK.jpg",
    trailerUrl: "https://www.youtube.com/embed/ZfZ3OmrJWpk",
    duration: 169,
    genre: ["Action", "Thriller"],
    rating: "15",
    subtitleLang: "ខ្មែរ",
    synopsis: "In the final chapter, Ethan Hunt and his IMF team face their most dangerous mission yet as they confront a terrifying new threat to humanity's future.",
    synopsisKh: "ក្នុងជំពូកចុងក្រោយ Ethan Hunt និងក្រុមរបស់គាត់ប្រឈមបេសកកម្មគ្រោះថ្នាក់បំផុត។",
    releaseDate: "2025-05-23",
    status: "now_showing",
    voteAverage: 8.1,
    voteCount: 2100,
  },
  {
    id: "5",
    tmdbId: 762509,
    slug: "lilo-and-stitch",
    title: "Lilo & Stitch",
    titleKh: "លីឡូ និង ស្ទីច",
    posterUrl: "https://image.tmdb.org/t/p/w500/2mtQwJKVKQrZgTz49Mfb0GE0GP5.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/q3jHCb4TkBZXgqIGwDNEfUhHiho.jpg",
    trailerUrl: "https://www.youtube.com/embed/WDkOXqDMbpw",
    duration: 108,
    genre: ["Family", "Comedy"],
    rating: "PG",
    subtitleLang: "ខ្មែរ",
    synopsis: "A lonely Hawaiian girl adopts an unusual pet who is actually a dangerous alien experiment on the run from his creators across the galaxy.",
    synopsisKh: "ក្មេងស្រីហាវ៉ៃម្នាក់ស្រាក់ទុកសត្វចិញ្ចឹមមិនធម្មតា ដែលពិតជាការពិសោធន៍ក្រៅភព។",
    releaseDate: "2025-05-23",
    status: "now_showing",
    voteAverage: 7.4,
    voteCount: 1200,
  },
  {
    id: "6",
    tmdbId: 950396,
    slug: "a-minecraft-movie",
    title: "A Minecraft Movie",
    titleKh: "ភាពយន្ត Minecraft",
    posterUrl: "https://image.tmdb.org/t/p/w500/yFHHfHcUgGAxziP1C3lLt0q2T4s.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/2Nti3gYAX513wvhwZBqMxvN50gV.jpg",
    trailerUrl: "https://www.youtube.com/embed/PE80kEG0ENA",
    duration: 101,
    genre: ["Adventure", "Comedy"],
    rating: "PG",
    subtitleLang: "ខ្មែរ",
    synopsis: "Four misfits are pulled through a mysterious portal into a cubic wonderland that thrives on imagination, where they must master the world to find their way home.",
    synopsisKh: "មនុស្សបួននាក់ត្រូវបានទាញចូលទៅក្នុងពិភពលោក cubic ដ៏អស្ចារ្យមួយ។",
    releaseDate: "2025-04-04",
    status: "now_showing",
    voteAverage: 6.8,
    voteCount: 3200,
  },
  {
    id: "7",
    tmdbId: 1064486,
    slug: "sinners",
    title: "Sinners",
    titleKh: "អ្នកបាបម្នាក់",
    posterUrl: "https://image.tmdb.org/t/p/w500/lkTilETsdS3BHYgMLlfjO7xMBgI.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/tCwixVIWGlJ3nOKee3iyqgGoKHU.jpg",
    trailerUrl: "https://www.youtube.com/embed/x5jxnP1CaSg",
    duration: 137,
    genre: ["Horror", "Drama"],
    rating: "18+",
    subtitleLang: "EN",
    synopsis: "Trying to leave their troubled lives behind, twin brothers return to their hometown to start again, only to discover that an even greater evil is waiting to welcome them back.",
    synopsisKh: "ក្មេងប្អូនជាភ្លោះត្រលប់ទៅស្រុកកំណើត ដើម្បីចាប់ផ្តើមសាជាថ្មី។",
    releaseDate: "2025-04-18",
    status: "now_showing",
    voteAverage: 7.9,
    voteCount: 1850,
  },
  {
    id: "8",
    tmdbId: 617126,
    slug: "the-fantastic-four-first-steps",
    title: "The Fantastic Four: First Steps",
    titleKh: "វីរបុរសបួនអស្ចារ្យ៖ ជំហានដំបូង",
    posterUrl: "https://image.tmdb.org/t/p/w500/1gg3BXCM1Q88iSQE6HyMlFbamZw.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/bDHoh3bGBwDNny0foXjkqUxAPeP.jpg",
    trailerUrl: "https://www.youtube.com/embed/8XhepvKb_Xg",
    duration: 0,
    genre: ["Action", "Sci-Fi"],
    rating: "PG",
    subtitleLang: "ខ្មែរ",
    synopsis: "Marvel's First Family gets their powers in the 1960s and must save their retro-futuristic world from the devourer of worlds, Galactus.",
    synopsisKh: "គ្រួសារដំបូងរបស់ Marvel ទទួលបានអំណាចរបស់ពួកគេក្នុងទសវត្សរ៍ឆ្នាំ ១៩៦០។",
    releaseDate: "2025-07-25",
    status: "coming_soon",
    voteAverage: 0,
    voteCount: 0,
  },
  {
    id: "9",
    tmdbId: 933260,
    slug: "28-years-later",
    title: "28 Years Later",
    titleKh: "២៨ ឆ្នាំក្រោយ",
    posterUrl: "https://image.tmdb.org/t/p/w500/dT3BOXenTkVk79bEPthofxiMFbR.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/1GVMcfSZdZIl0gGwQTaQGT6rFma.jpg",
    trailerUrl: "https://www.youtube.com/embed/aGcX34OIlEk",
    duration: 0,
    genre: ["Horror", "Thriller"],
    rating: "18+",
    subtitleLang: "EN",
    synopsis: "Almost three decades after the rage virus escaped a lab, a group of survivors live on an island connected to the mainland by a heavily guarded causeway.",
    synopsisKh: "ស្ទើរតែបីទសវត្សក្រោយពេលមេរោគកំហឹងគេចចេញពីមន្ទីរពិសោធន៍។",
    releaseDate: "2025-06-20",
    status: "coming_soon",
    voteAverage: 0,
    voteCount: 0,
  },
  {
    id: "10",
    tmdbId: 1105407,
    slug: "jurassic-world-rebirth",
    title: "Jurassic World Rebirth",
    titleKh: "ពិភពសត្វយុគសម័យ កើតជាថ្មី",
    posterUrl: "https://image.tmdb.org/t/p/w500/dJewSWDiEihJH1bQ13nh56gCR0R.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/68whRClVaqHfhYnUOiLCJjc3kGA.jpg",
    trailerUrl: "https://www.youtube.com/embed/dh5Mqnmp9iM",
    duration: 0,
    genre: ["Action", "Adventure", "Sci-Fi"],
    rating: "15",
    subtitleLang: "ខ្មែរ",
    synopsis: "Five years after the events of Jurassic World Dominion, the world's ecology has changed, and dinosaurs face extinction. A covert team races to secure DNA from the three biggest dinosaurs.",
    synopsisKh: "ប្រាំឆ្នាំក្រោយព្រឹត្តិការណ៍ Jurassic World Dominion បរិស្ថានពិភពលោកបានផ្លាស់ប្តូរ។",
    releaseDate: "2025-07-02",
    status: "coming_soon",
    voteAverage: 0,
    voteCount: 0,
  },
];

function generateDates(count: number): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
}

const dates = generateDates(7);
const times = ["14:00", "16:30", "18:00", "21:00"];

function generateRandomBookedSeats(): string[] {
  const seats: string[] = [];
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N"];
  const bookCount = Math.floor(Math.random() * 40) + 10;
  for (let i = 0; i < bookCount; i++) {
    const rowIdx = Math.floor(Math.random() * rows.length);
    const seatNum = Math.floor(Math.random() * 10) + 1;
    const seatId = `${rows[rowIdx]}${seatNum}`;
    if (!seats.includes(seatId)) seats.push(seatId);
  }
  return seats;
}

export const showtimes: Showtime[] = movies
  .filter((m) => m.status === "now_showing")
  .flatMap((movie) =>
    dates.flatMap((date) =>
      times.map((time, idx) => ({
        id: `${movie.id}-${date}-${idx}`,
        movieId: movie.id,
        date,
        time,
        price: 4.0,
        totalSeats: 120,
        bookedSeats: generateRandomBookedSeats(),
      }))
    )
  );

export const seatLayout: SeatLayout = {
  rows: [
    { id: "A", seats: 10, type: "standard" },
    { id: "B", seats: 10, type: "standard" },
    { id: "C", seats: 10, type: "standard" },
    { id: "D", seats: 10, type: "standard" },
    { id: "E", seats: 10, type: "standard" },
    { id: "F", seats: 10, type: "standard" },
    { id: "G", seats: 10, type: "standard" },
    { id: "H", seats: 10, type: "standard" },
    { id: "I", seats: 10, type: "standard" },
    { id: "J", seats: 10, type: "standard" },
    { id: "K", seats: 10, type: "standard" },
    { id: "L", seats: 10, type: "standard" },
    { id: "M", seats: 10, type: "standard" },

  ],
  blocked: [],
  wheelchair: [],
};

export const bookings: Booking[] = [
  {
    id: "b1",
    invoiceNumber: "INV-20260210-0042",
    movieId: "1",
    showtimeId: `1-${dates[0]}-2`,
    seats: ["E8", "E9"],
    customerPhone: "012 345 678",
    customerEmail: "dara@email.com",
    totalPrice: 8.0,
    discount: 0,
    paymentMethod: "bakong",
    status: "confirmed",
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
    checkedIn: false,
  },
  {
    id: "b2",
    invoiceNumber: "INV-20260210-0041",
    movieId: "1",
    showtimeId: `1-${dates[0]}-1`,
    seats: ["C8"],
    customerPhone: "098 765 432",
    customerEmail: "",
    totalPrice: 4.0,
    discount: 0,
    paymentMethod: "cash",
    status: "confirmed",
    createdAt: new Date(Date.now() - 12 * 60000).toISOString(),
    checkedIn: true,
  },
  {
    id: "b3",
    invoiceNumber: "INV-20260210-0040",
    movieId: "2",
    showtimeId: `2-${dates[0]}-0`,
    seats: ["A1", "A2", "A3", "A4"],
    customerPhone: "077 111 222",
    customerEmail: "sok@email.com",
    totalPrice: 16.0,
    discount: 1.6,
    paymentMethod: "visa",
    status: "confirmed",
    createdAt: new Date(Date.now() - 18 * 60000).toISOString(),
    checkedIn: false,
  },
  {
    id: "b4",
    invoiceNumber: "INV-20260210-0039",
    movieId: "3",
    showtimeId: `3-${dates[0]}-3`,
    seats: ["F5", "F6"],
    customerPhone: "085 999 888",
    customerEmail: "",
    totalPrice: 8.0,
    discount: 0,
    paymentMethod: "bakong",
    status: "pending",
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
    checkedIn: false,
  },
  {
    id: "b5",
    invoiceNumber: "INV-20260209-0038",
    movieId: "4",
    showtimeId: `4-${dates[0]}-1`,
    seats: ["D8", "D9", "D10"],
    customerPhone: "012 555 666",
    customerEmail: "vanna@email.com",
    totalPrice: 12.0,
    discount: 0,
    paymentMethod: "wallet",
    status: "confirmed",
    createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
    checkedIn: true,
  },
  {
    id: "b6",
    invoiceNumber: "INV-20260209-0037",
    movieId: "2",
    showtimeId: `2-${dates[0]}-2`,
    seats: ["B7"],
    customerPhone: "069 333 444",
    customerEmail: "",
    totalPrice: 4.0,
    discount: 0,
    paymentMethod: "cash",
    status: "cancelled",
    createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
    checkedIn: false,
  },
];

export const revenueData: RevenueData[] = [
  { date: "Mon", revenue: 320, tickets: 80 },
  { date: "Tue", revenue: 280, tickets: 70 },
  { date: "Wed", revenue: 450, tickets: 112 },
  { date: "Thu", revenue: 380, tickets: 95 },
  { date: "Fri", revenue: 620, tickets: 155 },
  { date: "Sat", revenue: 780, tickets: 195 },
  { date: "Sun", revenue: 540, tickets: 135 },
];

export const promoCodes: PromoCode[] = [
  {
    id: "p1",
    code: "SAVE10",
    discountType: "percentage",
    discountValue: 10,
    maxUses: 100,
    usedCount: 42,
    validFrom: "2026-02-01",
    validUntil: "2026-02-28",
  },
  {
    id: "p2",
    code: "OPENING",
    discountType: "fixed",
    discountValue: 1,
    maxUses: 50,
    usedCount: 50,
    validFrom: "2026-01-15",
    validUntil: "2026-02-15",
  },
  {
    id: "p3",
    code: "VIP2026",
    discountType: "percentage",
    discountValue: 20,
    maxUses: 20,
    usedCount: 8,
    validFrom: "2026-02-01",
    validUntil: "2026-12-31",
  },
];

export function getMovieById(id: string): Movie | undefined {
  return movies.find((m) => m.id === id);
}

export function getMovieBySlug(slug: string): Movie | undefined {
  return movies.find((m) => m.slug === slug);
}

export function getShowtimesForMovie(movieId: string): Showtime[] {
  return showtimes.filter((s) => s.movieId === movieId);
}

export function getShowtimeById(id: string): Showtime | undefined {
  return showtimes.find((s) => s.id === id);
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (d.getTime() === today.getTime()) return "Today";
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
