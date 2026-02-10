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
    slug: "the-last-guardian",
    title: "The Last Guardian",
    titleKh: "អ្នកការពារចុងក្រោយ",
    posterUrl: "https://picsum.photos/seed/movie1/400/600",
    backdropUrl: "https://picsum.photos/seed/movie1bg/1200/500",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: 135,
    genre: ["Action", "Drama"],
    rating: "15",
    subtitleLang: "ខ្មែរ",
    synopsis: "A former soldier must protect a young girl who holds the key to humanity's survival in a post-apocalyptic world. As they journey through dangerous territories, they discover that the greatest threat may come from within.",
    synopsisKh: "អតីតទាហានម្នាក់ត្រូវតែការពារក្មេងស្រីម្នាក់ដែលកាន់គន្លឹះនៃការរស់រានមានជីវិតរបស់មនុស្សជាតិក្នុងពិភពលោកក្រោយមហាវិនាស។",
    releaseDate: "2026-02-01",
    status: "now_showing",
  },
  {
    id: "2",
    slug: "midnight-in-phnom-penh",
    title: "Midnight in Phnom Penh",
    titleKh: "ពាក់កណ្ដាលអធ្រាត្រនៅភ្នំពេញ",
    posterUrl: "https://picsum.photos/seed/movie2/400/600",
    backdropUrl: "https://picsum.photos/seed/movie2bg/1200/500",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: 112,
    genre: ["Romance", "Drama"],
    rating: "PG",
    subtitleLang: "EN",
    synopsis: "Two strangers meet at a night market in Phnom Penh and share one magical evening that changes their lives forever. A beautiful love story set against the vibrant backdrop of Cambodia's capital.",
    synopsisKh: "មនុស្សចម្លែកពីរនាក់ជួបគ្នានៅផ្សារយប់ក្នុងរាជធានីភ្នំពេញ ហើយចែករំលែកពេលល្ងាចវេទមន្តមួយដែលផ្លាស់ប្តូរជីវិតរបស់ពួកគេជារៀងរហូត។",
    releaseDate: "2026-02-05",
    status: "now_showing",
  },
  {
    id: "3",
    slug: "shadow-warriors",
    title: "Shadow Warriors",
    titleKh: "អ្នកចម្បាំងស្រមោល",
    posterUrl: "https://picsum.photos/seed/movie3/400/600",
    backdropUrl: "https://picsum.photos/seed/movie3bg/1200/500",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: 148,
    genre: ["Action", "Sci-Fi"],
    rating: "18+",
    subtitleLang: "ខ្មែរ",
    synopsis: "In a near-future world, an elite team of genetically enhanced soldiers must infiltrate an enemy stronghold to prevent a global catastrophe. But when they discover the true nature of their mission, loyalties are tested.",
    synopsisKh: "ក្នុងពិភពលោកនាពេលអនាគតដ៏ខ្លី ក្រុមទាហានជ្រើសរើសដែលត្រូវបានពង្រឹងហ្សែន ត្រូវតែចូលទៅក្នុងប្រាសាទសត្រូវ ដើម្បីការពារមហន្តរាយសកល។",
    releaseDate: "2026-01-20",
    status: "now_showing",
  },
  {
    id: "4",
    slug: "the-golden-temple",
    title: "The Golden Temple",
    titleKh: "ប្រាសាទមាស",
    posterUrl: "https://picsum.photos/seed/movie4/400/600",
    backdropUrl: "https://picsum.photos/seed/movie4bg/1200/500",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: 125,
    genre: ["Adventure", "Mystery"],
    rating: "PG",
    subtitleLang: "ខ្មែរ",
    synopsis: "An archaeologist discovers a hidden map leading to a legendary golden temple deep in the Cambodian jungle. Racing against treasure hunters, she must solve ancient puzzles to reach the treasure first.",
    synopsisKh: "អ្នកបុរាណវិទ្យាម្នាក់រកឃើញផែនទីលាក់បាំងដែលនាំទៅប្រាសាទមាសប្រស្នាដ៏ជ្រៅក្នុងព្រៃកម្ពុជា។",
    releaseDate: "2026-02-08",
    status: "now_showing",
  },
  {
    id: "5",
    slug: "laugh-out-loud",
    title: "Laugh Out Loud",
    titleKh: "សើចពេញមាត់",
    posterUrl: "https://picsum.photos/seed/movie5/400/600",
    backdropUrl: "https://picsum.photos/seed/movie5bg/1200/500",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: 98,
    genre: ["Comedy"],
    rating: "PG",
    subtitleLang: "ខ្មែរ",
    synopsis: "A struggling comedian accidentally becomes a viral sensation when his worst performance is recorded and shared online. Now he must decide between authentic comedy and internet fame.",
    synopsisKh: "អ្នកកំប្លែងដែលកំពុងពិបាកមួយដោយមិនដឹងខ្លួនក្លាយជាអ្នកល្បីលើអ៊ីនធឺណិត នៅពេលដែលការសម្ដែងអាក្រក់បំផុតរបស់គេត្រូវបានថតចែកចាយ។",
    releaseDate: "2026-02-10",
    status: "now_showing",
  },
  {
    id: "6",
    slug: "echoes-of-angkor",
    title: "Echoes of Angkor",
    titleKh: "សំឡេងបន្ទរអង្គរ",
    posterUrl: "https://picsum.photos/seed/movie6/400/600",
    backdropUrl: "https://picsum.photos/seed/movie6bg/1200/500",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: 155,
    genre: ["Fantasy", "Adventure"],
    rating: "PG",
    subtitleLang: "ខ្មែរ",
    synopsis: "When a young woman touches an ancient stone at Angkor Wat, she is transported back to the Khmer Empire's golden age. She must navigate court intrigue and mystical forces to find her way home.",
    synopsisKh: "នៅពេលស្ត្រីវ័យក្មេងម្នាក់ប៉ះថ្មបុរាណមួយនៅអង្គរវត្ត នាងត្រូវបានបញ្ជូនទៅក្រោយយុគសម័យមាសនៃអាណាចក្រខ្មែរ។",
    releaseDate: "2026-02-20",
    status: "coming_soon",
  },
  {
    id: "7",
    slug: "steel-horizon",
    title: "Steel Horizon",
    titleKh: "ផ្តេកដែក",
    posterUrl: "https://picsum.photos/seed/movie7/400/600",
    backdropUrl: "https://picsum.photos/seed/movie7bg/1200/500",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: 140,
    genre: ["Sci-Fi", "Thriller"],
    rating: "15",
    subtitleLang: "EN",
    synopsis: "In 2089, a space engineer discovers a distress signal from a ship that vanished decades ago. As she investigates, she uncovers a conspiracy that threatens all of human civilization.",
    synopsisKh: "នៅឆ្នាំ ២០៨៩ វិស្វករអវកាសម្នាក់រកឃើញសញ្ញាសុំជំនួយពីនាវាមួយដែលបាត់ខ្លួនជាច្រើនទសវត្សមុន។",
    releaseDate: "2026-03-01",
    status: "coming_soon",
  },
  {
    id: "8",
    slug: "mekong-tales",
    title: "Mekong Tales",
    titleKh: "រឿងមេគង្គ",
    posterUrl: "https://picsum.photos/seed/movie8/400/600",
    backdropUrl: "https://picsum.photos/seed/movie8bg/1200/500",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: 105,
    genre: ["Drama", "Family"],
    rating: "PG",
    subtitleLang: "ខ្មែរ",
    synopsis: "A heartwarming anthology of three interconnected stories set along the Mekong River, exploring themes of family, tradition, and the bonds that connect generations.",
    synopsisKh: "រឿងអរិយធម៌បីដែលភ្ជាប់គ្នាកំពុងធ្វើឱ្យចិត្តកក់ក្តៅតាមបណ្តោយទន្លេមេគង្គ ស្វែងយល់ពីគ្រួសារ ទំនៀមទម្លាប់ និងចំណងជំនាន់។",
    releaseDate: "2026-03-15",
    status: "coming_soon",
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
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const seatsPerRow = [16, 16, 16, 16, 14, 14, 12, 10];
  const bookCount = Math.floor(Math.random() * 40) + 10;
  for (let i = 0; i < bookCount; i++) {
    const rowIdx = Math.floor(Math.random() * rows.length);
    const seatNum = Math.floor(Math.random() * seatsPerRow[rowIdx]) + 1;
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
    { id: "A", seats: 16, type: "standard" },
    { id: "B", seats: 16, type: "standard" },
    { id: "C", seats: 16, type: "standard" },
    { id: "D", seats: 16, type: "standard" },
    { id: "E", seats: 14, type: "standard", offset: 1 },
    { id: "F", seats: 14, type: "standard", offset: 1 },
    { id: "G", seats: 12, type: "standard", offset: 2 },
    { id: "H", seats: 10, type: "standard", offset: 3 },
  ],
  blocked: ["A1", "A16", "H1", "H10"],
  wheelchair: ["A2", "A15"],
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
    seats: ["C12"],
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
    seats: ["D10", "D11", "D12"],
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
