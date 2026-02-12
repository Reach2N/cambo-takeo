-- Seed data for Movies and Showtimes

TRUNCATE TABLE showtimes, movies CASCADE;

-- Movies
INSERT INTO movies (id, tmdb_id, slug, title, title_kh, poster_url, backdrop_url, trailer_url, duration, genre, rating, subtitle_lang, synopsis, synopsis_kh, release_date, status, vote_average, vote_count, source) VALUES (
    '1',
    822119,
    'captain-america-brave-new-world',
    'Captain America: Brave New World',
    'កាប់ទីន អាមេរិក៖ ពិភពលោកថ្មីក្លាហាន',
    'https://image.tmdb.org/t/p/w500/pzIddUEMWhbRfaHNiO07BNE4qx0.jpg',
    'https://image.tmdb.org/t/p/w1280/gsQJOfeW45rLFEEQaGc2fB7GFtx.jpg',
    'https://www.youtube.com/embed/cL4EjEPEfhg',
    119,
    '{"Action","Sci-Fi"}',
    'PG',
    'ខ្មែរ',
    'Sam Wilson, the new Captain America, finds himself in the middle of an international incident when he must discover the motives behind a nefarious global plot.',
    'សែម វីលសុន ក្លាយជាកាប់ទីន អាមេរិកថ្មី ដែលរកឃើញខ្លួនឯងស្ថិតនៅកណ្តាលអន្តរជាតិមួយ។',
    '2025-02-14',
    'now_showing',
    6.2,
    1850,
    'manual'
  );
INSERT INTO movies (id, tmdb_id, slug, title, title_kh, poster_url, backdrop_url, trailer_url, duration, genre, rating, subtitle_lang, synopsis, synopsis_kh, release_date, status, vote_average, vote_count, source) VALUES (
    '2',
    986056,
    'thunderbolts',
    'Thunderbolts*',
    'ផ្គរលាន់*',
    'https://image.tmdb.org/t/p/w500/m0do9wWBhKzKRBhdFuxSvqaH3Bx.jpg',
    'https://image.tmdb.org/t/p/w1280/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg',
    'https://www.youtube.com/embed/dh5Mqnmp9iM',
    127,
    '{"Action","Adventure"}',
    '15',
    'ខ្មែរ',
    'A group of antiheroes are recruited by Valentina Allegra de Fontaine to take on missions deemed too dangerous for regular heroes.',
    'ក្រុមអង្គរក្សអាក្រក់ត្រូវបានជ្រើសរើសដោយ វ៉ាឡង់ទីណា ដើម្បីធ្វើបេសកកម្មគ្រោះថ្នាក់។',
    '2025-05-02',
    'now_showing',
    7.1,
    920,
    'manual'
  );
INSERT INTO movies (id, tmdb_id, slug, title, title_kh, poster_url, backdrop_url, trailer_url, duration, genre, rating, subtitle_lang, synopsis, synopsis_kh, release_date, status, vote_average, vote_count, source) VALUES (
    '3',
    209867,
    'superman',
    'Superman',
    'មនុស្សដែក',
    'https://image.tmdb.org/t/p/w500/rXkJmMHrFaTGKMxESnBCuO0sJaZ.jpg',
    'https://image.tmdb.org/t/p/w1280/rlNGDMVQMnJ1cLfoBbD08ncFPrU.jpg',
    'https://www.youtube.com/embed/vS3_72Bpf_s',
    143,
    '{"Action","Sci-Fi"}',
    'PG',
    'EN',
    'Superman, a cub reporter in Metropolis, must come to terms with his Kryptonian heritage while facing off against Lex Luthor in James Gunn''s new vision.',
    'មនុស្សដែក អ្នកយកព័ត៌មានថ្មីនៅ Metropolis ត្រូវតែប្រឈមនឹងកេរ្តិ៍មរតកខ្មែរ Kryptonian។',
    '2025-07-11',
    'now_showing',
    7.8,
    450,
    'manual'
  );
INSERT INTO movies (id, tmdb_id, slug, title, title_kh, poster_url, backdrop_url, trailer_url, duration, genre, rating, subtitle_lang, synopsis, synopsis_kh, release_date, status, vote_average, vote_count, source) VALUES (
    '4',
    575264,
    'mission-impossible-the-final-reckoning',
    'Mission: Impossible – The Final Reckoning',
    'បេសកកម្មដែលមិនអាចទៅរួច - ការគិតចុងក្រោយ',
    'https://image.tmdb.org/t/p/w500/z5cHUjb9raJCf9AEVfyRSvQJhJH.jpg',
    'https://image.tmdb.org/t/p/w1280/iKnkklCiBfKFEjZg4ibTO0MCGFK.jpg',
    'https://www.youtube.com/embed/ZfZ3OmrJWpk',
    169,
    '{"Action","Thriller"}',
    '15',
    'ខ្មែរ',
    'In the final chapter, Ethan Hunt and his IMF team face their most dangerous mission yet as they confront a terrifying new threat to humanity''s future.',
    'ក្នុងជំពូកចុងក្រោយ Ethan Hunt និងក្រុមរបស់គាត់ប្រឈមបេសកកម្មគ្រោះថ្នាក់បំផុត។',
    '2025-05-23',
    'now_showing',
    8.1,
    2100,
    'manual'
  );
INSERT INTO movies (id, tmdb_id, slug, title, title_kh, poster_url, backdrop_url, trailer_url, duration, genre, rating, subtitle_lang, synopsis, synopsis_kh, release_date, status, vote_average, vote_count, source) VALUES (
    '5',
    762509,
    'lilo-and-stitch',
    'Lilo & Stitch',
    'លីឡូ និង ស្ទីច',
    'https://image.tmdb.org/t/p/w500/2mtQwJKVKQrZgTz49Mfb0GE0GP5.jpg',
    'https://image.tmdb.org/t/p/w1280/q3jHCb4TkBZXgqIGwDNEfUhHiho.jpg',
    'https://www.youtube.com/embed/WDkOXqDMbpw',
    108,
    '{"Family","Comedy"}',
    'PG',
    'ខ្មែរ',
    'A lonely Hawaiian girl adopts an unusual pet who is actually a dangerous alien experiment on the run from his creators across the galaxy.',
    'ក្មេងស្រីហាវ៉ៃម្នាក់ស្រាក់ទុកសត្វចិញ្ចឹមមិនធម្មតា ដែលពិតជាការពិសោធន៍ក្រៅភព។',
    '2025-05-23',
    'now_showing',
    7.4,
    1200,
    'manual'
  );
INSERT INTO movies (id, tmdb_id, slug, title, title_kh, poster_url, backdrop_url, trailer_url, duration, genre, rating, subtitle_lang, synopsis, synopsis_kh, release_date, status, vote_average, vote_count, source) VALUES (
    '6',
    950396,
    'a-minecraft-movie',
    'A Minecraft Movie',
    'ភាពយន្ត Minecraft',
    'https://image.tmdb.org/t/p/w500/yFHHfHcUgGAxziP1C3lLt0q2T4s.jpg',
    'https://image.tmdb.org/t/p/w1280/2Nti3gYAX513wvhwZBqMxvN50gV.jpg',
    'https://www.youtube.com/embed/PE80kEG0ENA',
    101,
    '{"Adventure","Comedy"}',
    'PG',
    'ខ្មែរ',
    'Four misfits are pulled through a mysterious portal into a cubic wonderland that thrives on imagination, where they must master the world to find their way home.',
    'មនុស្សបួននាក់ត្រូវបានទាញចូលទៅក្នុងពិភពលោក cubic ដ៏អស្ចារ្យមួយ។',
    '2025-04-04',
    'now_showing',
    6.8,
    3200,
    'manual'
  );
INSERT INTO movies (id, tmdb_id, slug, title, title_kh, poster_url, backdrop_url, trailer_url, duration, genre, rating, subtitle_lang, synopsis, synopsis_kh, release_date, status, vote_average, vote_count, source) VALUES (
    '7',
    1064486,
    'sinners',
    'Sinners',
    'អ្នកបាបម្នាក់',
    'https://image.tmdb.org/t/p/w500/lkTilETsdS3BHYgMLlfjO7xMBgI.jpg',
    'https://image.tmdb.org/t/p/w1280/tCwixVIWGlJ3nOKee3iyqgGoKHU.jpg',
    'https://www.youtube.com/embed/x5jxnP1CaSg',
    137,
    '{"Horror","Drama"}',
    '18+',
    'EN',
    'Trying to leave their troubled lives behind, twin brothers return to their hometown to start again, only to discover that an even greater evil is waiting to welcome them back.',
    'ក្មេងប្អូនជាភ្លោះត្រលប់ទៅស្រុកកំណើត ដើម្បីចាប់ផ្តើមសាជាថ្មី។',
    '2025-04-18',
    'now_showing',
    7.9,
    1850,
    'manual'
  );
INSERT INTO movies (id, tmdb_id, slug, title, title_kh, poster_url, backdrop_url, trailer_url, duration, genre, rating, subtitle_lang, synopsis, synopsis_kh, release_date, status, vote_average, vote_count, source) VALUES (
    '8',
    617126,
    'the-fantastic-four-first-steps',
    'The Fantastic Four: First Steps',
    'វីរបុរសបួនអស្ចារ្យ៖ ជំហានដំបូង',
    'https://image.tmdb.org/t/p/w500/1gg3BXCM1Q88iSQE6HyMlFbamZw.jpg',
    'https://image.tmdb.org/t/p/w1280/bDHoh3bGBwDNny0foXjkqUxAPeP.jpg',
    'https://www.youtube.com/embed/8XhepvKb_Xg',
    0,
    '{"Action","Sci-Fi"}',
    'PG',
    'ខ្មែរ',
    'Marvel''s First Family gets their powers in the 1960s and must save their retro-futuristic world from the devourer of worlds, Galactus.',
    'គ្រួសារដំបូងរបស់ Marvel ទទួលបានអំណាចរបស់ពួកគេក្នុងទសវត្សរ៍ឆ្នាំ ១៩៦០។',
    '2025-07-25',
    'coming_soon',
    0,
    0,
    'manual'
  );
INSERT INTO movies (id, tmdb_id, slug, title, title_kh, poster_url, backdrop_url, trailer_url, duration, genre, rating, subtitle_lang, synopsis, synopsis_kh, release_date, status, vote_average, vote_count, source) VALUES (
    '9',
    933260,
    '28-years-later',
    '28 Years Later',
    '២៨ ឆ្នាំក្រោយ',
    'https://image.tmdb.org/t/p/w500/dT3BOXenTkVk79bEPthofxiMFbR.jpg',
    'https://image.tmdb.org/t/p/w1280/1GVMcfSZdZIl0gGwQTaQGT6rFma.jpg',
    'https://www.youtube.com/embed/aGcX34OIlEk',
    0,
    '{"Horror","Thriller"}',
    '18+',
    'EN',
    'Almost three decades after the rage virus escaped a lab, a group of survivors live on an island connected to the mainland by a heavily guarded causeway.',
    'ស្ទើរតែបីទសវត្សក្រោយពេលមេរោគកំហឹងគេចចេញពីមន្ទីរពិសោធន៍។',
    '2025-06-20',
    'coming_soon',
    0,
    0,
    'manual'
  );
INSERT INTO movies (id, tmdb_id, slug, title, title_kh, poster_url, backdrop_url, trailer_url, duration, genre, rating, subtitle_lang, synopsis, synopsis_kh, release_date, status, vote_average, vote_count, source) VALUES (
    '10',
    1105407,
    'jurassic-world-rebirth',
    'Jurassic World Rebirth',
    'ពិភពសត្វយុគសម័យ កើតជាថ្មី',
    'https://image.tmdb.org/t/p/w500/dJewSWDiEihJH1bQ13nh56gCR0R.jpg',
    'https://image.tmdb.org/t/p/w1280/68whRClVaqHfhYnUOiLCJjc3kGA.jpg',
    'https://www.youtube.com/embed/dh5Mqnmp9iM',
    0,
    '{"Action","Adventure","Sci-Fi"}',
    '15',
    'ខ្មែរ',
    'Five years after the events of Jurassic World Dominion, the world''s ecology has changed, and dinosaurs face extinction. A covert team races to secure DNA from the three biggest dinosaurs.',
    'ប្រាំឆ្នាំក្រោយព្រឹត្តិការណ៍ Jurassic World Dominion បរិស្ថានពិភពលោកបានផ្លាស់ប្តូរ។',
    '2025-07-02',
    'coming_soon',
    0,
    0,
    'manual'
  );

-- Showtimes
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '1-2026-02-12-0',
    '1',
    '2026-02-12',
    '14:00',
    4,
    120,
    '{"C9","F7","H8","H10","A5","A16","E2","F3","B5","F13","G5","C2","D6","D14"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '1-2026-02-12-1',
    '1',
    '2026-02-12',
    '16:30',
    4,
    120,
    '{"A14","F2","E10","G10","B2","A2","H3","E3","G9","D10","C6","F11","E14","H7","C13","C2","D2","C16","D1","E8","A3","B3"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '1-2026-02-12-2',
    '1',
    '2026-02-12',
    '18:00',
    4,
    120,
    '{"G8","C13","G4","F7","B1","F4","B5","A14","E11","E3","D14","B9","B6","G10","H5","B12","A1","E8","B13","B10","D2","E9","G12","C8","E7","H4","H10","H9","A12","E14","G9","A11","H2","F1","G3","A4","D12","C14","D16"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '1-2026-02-12-3',
    '1',
    '2026-02-12',
    '21:00',
    4,
    120,
    '{"A10","E4","A16","H4","D2","H2","H3","F3","B4","G3","C10","C8","B15","F7","F8","A14","G9","F2"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '1-2026-02-13-0',
    '1',
    '2026-02-13',
    '14:00',
    4,
    120,
    '{"G10","B11","E11","F8","H7","D2","D13","B9","D5","C4","B16","E14","A8","D16","D9","H4","A11","H5","B1","E7","H9","A9"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '1-2026-02-13-1',
    '1',
    '2026-02-13',
    '16:30',
    4,
    120,
    '{"H3","G4","D5","F14","G3","D14","B5","F9","E1","H5","H2","E5","D11","F13","D7","E8","C10"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '1-2026-02-13-2',
    '1',
    '2026-02-13',
    '18:00',
    4,
    120,
    '{"F3","A6","D5","G2","E14","A14","D4","E4","A5","D7","G10","C2","E10","B16","D6","E2","F11","B5","D12"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '1-2026-02-13-3',
    '1',
    '2026-02-13',
    '21:00',
    4,
    120,
    '{"E6","D7","B9","B16","H2","C7","D6","H5","D9","D13","H7","B3","C8","A15"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '1-2026-02-14-0',
    '1',
    '2026-02-14',
    '14:00',
    4,
    120,
    '{"G4","B10","E10","D7","G10","C5","H7","F4","E8","H5","A6","F7","C1","C7","A12","B9","A7","H9","F2","A2","H1","F11","E9","G1","F13","D16","C15","E11","F10","B6","G7","B1","A10","B15","C6","A8","D8","A9","C9"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '1-2026-02-14-1',
    '1',
    '2026-02-14',
    '16:30',
    4,
    120,
    '{"H9","B3","H5","F4","G1","E3","E10","F6","E11","C1","C12","B2","E14","C14","E4","A7","C6","G4","E13","C11","D7","A5","B12"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '1-2026-02-14-2',
    '1',
    '2026-02-14',
    '18:00',
    4,
    120,
    '{"D14","F11","G9","E1","C12","H2","B8","H5","A3","H8","A16","F12","A13","C5","E6","F1","H4","B10"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '1-2026-02-14-3',
    '1',
    '2026-02-14',
    '21:00',
    4,
    120,
    '{"E1","F6","B13","A5","G11","C15","A11","A9","B5","A10","C10","G5","F7","C2","E9","D14","D3","G9","A1","B12","D11","D15","D2","D12","C11","B1","D6","G8","C1","G7","D16","C12","H10","G1","H8","D4","G10","B3"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '1-2026-02-15-0',
    '1',
    '2026-02-15',
    '14:00',
    4,
    120,
    '{"A12","A11","D10","C12","G11","B13","G10","B10","E6","G7","B5","D7","A6","H9","F12","H7","H2","A2"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '1-2026-02-15-1',
    '1',
    '2026-02-15',
    '16:30',
    4,
    120,
    '{"A14","F13","G8","G12","E2","C15","G6","F9","A12","C14"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '1-2026-02-15-2',
    '1',
    '2026-02-15',
    '18:00',
    4,
    120,
    '{"F13","B14","B1","F8","F2","A5","E6","D8","C1","C15","F10","A16","A9","H3","E4","D5","E3","E2","A7","E1","A1","C12","C2","G9","D13"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '1-2026-02-15-3',
    '1',
    '2026-02-15',
    '21:00',
    4,
    120,
    '{"F1","D5","G2","A6","F9","A4","C14","B2","H9","D11","H4"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '1-2026-02-16-0',
    '1',
    '2026-02-16',
    '14:00',
    4,
    120,
    '{"H6","F14","G6","B15","D9","D13","C11","E11","A8","A16","H4","C7","H9","B1","D14","H1","B8","G12","F1","A9","C5","A2","D8","B12","D12","C14","H10","A12","G3","H8"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '1-2026-02-16-1',
    '1',
    '2026-02-16',
    '16:30',
    4,
    120,
    '{"E1","H2","C13","B8","G9","G12","C2","D2","G4","D15","G5","B6"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '1-2026-02-16-2',
    '1',
    '2026-02-16',
    '18:00',
    4,
    120,
    '{"C6","F8","B12","F7","B4","C11","C4","C1","D8","D2","H3","G2","G6","H10","G1","H4","A6","A3","D3","D13","D16","A11","B10","C10","C13","G12","A5","C7","A14","E12","C3","H6","F3","E6"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '1-2026-02-16-3',
    '1',
    '2026-02-16',
    '21:00',
    4,
    120,
    '{"C2","F3","A8","G7","B6","E14","A13","G2","E4","B5","H3","D16","G10","H2","E8","C15","F6","C5","D2","D5","H4","A9","B1","H9","C1","H7","E7","F2","D4"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '1-2026-02-17-0',
    '1',
    '2026-02-17',
    '14:00',
    4,
    120,
    '{"C10","H5","B7","H1","B14","E3","B2","D13","B6","G12","D2","F12","A3","E12","A16","E10","B3","F9","E5","F1","B13","A1","H6","H4","A7","D8","D14","D3","E8","H9","F2","C8"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '1-2026-02-17-1',
    '1',
    '2026-02-17',
    '16:30',
    4,
    120,
    '{"B5","C1","A7","F8","G3","F13","A3","C15","D8","F6","B12","A12","A15","A11","E10","C13","H4","G12","H3","A5","F12","D16","C3"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '1-2026-02-17-2',
    '1',
    '2026-02-17',
    '18:00',
    4,
    120,
    '{"C8","B2","B13","D7","F11","G8","C14","B11","D12","C15","H3","G4","F13","D11","E7","H9","F8","G5","C10","A16","B5","A10","B14","C11","F5","D4","F2","H4","F1","F3","E5","D13","E4","D2","G11","F4","C7","A8"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '1-2026-02-17-3',
    '1',
    '2026-02-17',
    '21:00',
    4,
    120,
    '{"A1","G12","E7","B5","B15","B2","C8","F6","E13","H4","C7","A15","G4","D1","C16","F3","D5","D8","D12"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '1-2026-02-18-0',
    '1',
    '2026-02-18',
    '14:00',
    4,
    120,
    '{"G3","D15","G1","G9","F7","A15","H6","A11","F4","B6","B7","D8","F10","D13","H5","A16","E7","F3","E1","D6","D14"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '1-2026-02-18-1',
    '1',
    '2026-02-18',
    '16:30',
    4,
    120,
    '{"D14","G4","E10","D16","C2","E5","A7","G2","A5","A15","F8","E13","E3","F9","A8","D10","E6","G7","B14","B11","B7","D3","F4","C1","D6","E12","C12","B9","H1","C16","G6"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '1-2026-02-18-2',
    '1',
    '2026-02-18',
    '18:00',
    4,
    120,
    '{"D14","C14","E6","C15","B15","B6","H10","D4","D1","D9","A10","H5","E10","C16","A1","C3","D7"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '1-2026-02-18-3',
    '1',
    '2026-02-18',
    '21:00',
    4,
    120,
    '{"F3","F8","A2","A5","D5","G7","E14","C5","A4","E5","D2","C3","F6","B2","H1","A11","A15","C11","E9","E12","E10","G3","D15","A8","F12","F14","G10","F11","D8","H2","H5","A1","A12","H4","F13","C1","B6"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '2-2026-02-12-0',
    '2',
    '2026-02-12',
    '14:00',
    4,
    120,
    '{"D2","F7","F14","A8","A15","A16","C13","G11","C16","F11","B5","A1","E2","E8","B3","D4","A3","H1","D12","E11","G1","H8","E9","H5"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '2-2026-02-12-1',
    '2',
    '2026-02-12',
    '16:30',
    4,
    120,
    '{"A9","B4","C15","B6","A8","C12","C10","D2","G1","H1","G5","A4","H7","E6","B15","F5","D13","F2","F4"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '2-2026-02-12-2',
    '2',
    '2026-02-12',
    '18:00',
    4,
    120,
    '{"D7","A6","A12","F9","D16","C4","F10","C16","G5","C13","G2","C7","F13","C12","C6","H2","H9","C9","F4","E6","E11","D13","G3","E3","A10","F5","B6"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '2-2026-02-12-3',
    '2',
    '2026-02-12',
    '21:00',
    4,
    120,
    '{"D7","E10","G10","D10","D16","D15","E8","H7","B1","D12","A15","B11","G9","E12","E6","A8","D14","C12","B6","F1","G3","E14","G4","H3","D2"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '2-2026-02-13-0',
    '2',
    '2026-02-13',
    '14:00',
    4,
    120,
    '{"C7","E2","A12","G2","E1","A4","A13","D3","D16","H4","B14","F5","F9","C3","B8","F2","G3","H10","A6","E9","B5","B10","A11","C15","D6","G4","G1","G11","D10","B15","D9"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '2-2026-02-13-1',
    '2',
    '2026-02-13',
    '16:30',
    4,
    120,
    '{"B6","H5","E11","H9","B7","B12","C11","D9","H7","E4","A3","C12","C7","F4","B14","D13","F13","F9","C9","E10","C6","E2","A8","G1","B11","B4","C2","G10","E12","G2","H4","F12","F11","H10","G9"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '2-2026-02-13-2',
    '2',
    '2026-02-13',
    '18:00',
    4,
    120,
    '{"F7","H5","A6","H1","A13","B15","H8","F14","D14","E7","B11","E5","C2","C5","D6","E13","E11","E12","G1","A3","D13","E14","D9","F8","A7","B6","C4","H9","C1","H10","F10","G10","C8","E1","F9","G8"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '2-2026-02-13-3',
    '2',
    '2026-02-13',
    '21:00',
    4,
    120,
    '{"E3","B6","G8","C6","B8","G3","H4","F8","A2","D7","A3","D3","G11","D11","E5","E13","A7","C15","H10","H8","G12","F10","D10","F13","D15","D12","G2","D8","E12","D5","D13","A14","A5","B11","D4","E11","A8","F3","E4","H3","C12"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '2-2026-02-14-0',
    '2',
    '2026-02-14',
    '14:00',
    4,
    120,
    '{"F7","G10","A8","E7","H1","A5","H5","G4","E1","G6","F14","C10","D1","F10","D3","A6","E13","D15","A15","G3","B8","A2","F5","F8","B14","H4","B2","H9","C1"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '2-2026-02-14-1',
    '2',
    '2026-02-14',
    '16:30',
    4,
    120,
    '{"E3","D10","E8","A5","G11","H8","E1","G1","C14","F9","E4","G3","G7","A3","E10","E5","D7","H10","F14","B15","H5","D8","A11","E12","F1","C6","G9","H1","D16","D5","E14","C1","G12","G10","C8","E9","H6","H7"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '2-2026-02-14-2',
    '2',
    '2026-02-14',
    '18:00',
    4,
    120,
    '{"F12","A15","E12","H4","B15","A2","G1","H5","H6","E5","B7","C4","A11","C14","B11","H7","D14","B2","F9","C13","A13","C8","G2","E3","G6","E7","A16","C15","A10","F11","H10","C6"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '2-2026-02-14-3',
    '2',
    '2026-02-14',
    '21:00',
    4,
    120,
    '{"G3","C5","A7","H9","G7","C11","H5","D13","A16","H8","F11","E13","C13","C2","B12","B2","E6","G9","A8","A12","C9","H10","B9","E9","G6","H3"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '2-2026-02-15-0',
    '2',
    '2026-02-15',
    '14:00',
    4,
    120,
    '{"G2","D3","A10","D8","F10","H7","G3","E14","G10","F12","G5","E4","B1"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '2-2026-02-15-1',
    '2',
    '2026-02-15',
    '16:30',
    4,
    120,
    '{"G3","C5","F8","H2","G4","D16","C8","E9","G8","B15","B1","F1"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '2-2026-02-15-2',
    '2',
    '2026-02-15',
    '18:00',
    4,
    120,
    '{"F8","D11","E2","E9","D8","C4","G10","C3","A4","H2","B8","C2","D4","E1","B2","F9","A2","D1","G3","C12","B15","B11","G12","F4","F7","A10","A1","E12","H10","G6","D3","F12","F1"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '2-2026-02-15-3',
    '2',
    '2026-02-15',
    '21:00',
    4,
    120,
    '{"C7","B7","D8","G2","D2","G3","H9","E1","H3","E11","H8","F2","G10","A13","H6","E12","B5","E3","E4","F12","G4","F6","A7","E14","H1","A4","A16","E8","B1","F7","A12","F9","D16"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '2-2026-02-16-0',
    '2',
    '2026-02-16',
    '14:00',
    4,
    120,
    '{"G6","F1","D1","G5","A10","H2","G7","G11","D14","F5","A5"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '2-2026-02-16-1',
    '2',
    '2026-02-16',
    '16:30',
    4,
    120,
    '{"F2","C6","F13","H10","E8","G11","B12","E7","D14","B5","G8","E4","C11","C15","H2","E6","B2","C2","A9","A8","E1","F7","A6","H1","E11","E14","B14","F6","H5","G5","A4","G3"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '2-2026-02-16-2',
    '2',
    '2026-02-16',
    '18:00',
    4,
    120,
    '{"A12","D16","E9","D14","A13","D1","G1","A8","A6","D8","C12","D12","H5","G6","D15","E14","F7","A15","C1","E6","E10","F14","C9","H4","C14","C10","F12","B2","F9","G8","E13","F10","F5"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '2-2026-02-16-3',
    '2',
    '2026-02-16',
    '21:00',
    4,
    120,
    '{"B1","E11","E2","D7","D5","D12","B14","H5","D11","H4","G8","A13","E5","A11","C1","G4","F10","G11","H6","A6","B15","C7","F12","A2","G3","B11","C13","A10","E12","C15","B13","B6","C3"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '2-2026-02-17-0',
    '2',
    '2026-02-17',
    '14:00',
    4,
    120,
    '{"H6","A12","D4","G10","H1","G8","A13","E7","H7","G7","C16","A15","G12","D14","F2","B15","F5","E8","D11","G5","C5","F10","B6","F14","H8","A10","H10","C7","G4","D1","D8","F6","C1","G9","F12","D12","C13","D16","B3"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '2-2026-02-17-1',
    '2',
    '2026-02-17',
    '16:30',
    4,
    120,
    '{"A14","C11","H8","E7","F12","B3","F5","G4","E6","G7","D3","F1","C10","C16","C5","D16","H6","B10","C1","D1","E9","B5","A1","E10","D4","B8","D10","B14","G1","B7","C6","E14","A6"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '2-2026-02-17-2',
    '2',
    '2026-02-17',
    '18:00',
    4,
    120,
    '{"C7","D9","C2","F3","D14","F11","A8","E2","A9"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '2-2026-02-17-3',
    '2',
    '2026-02-17',
    '21:00',
    4,
    120,
    '{"D8","C14","E9","F11","G3","C11","C12","G8","E6","D6","H5","F5","G12","A14","A8","E2","D15","E4","G7","G6","H2","H3","D11","F12","D3","D5","C15","E7","E1","B15","A1","A9","G4","H6","E12","B12","A12","C2","A3","D7","F10"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '2-2026-02-18-0',
    '2',
    '2026-02-18',
    '14:00',
    4,
    120,
    '{"H7","B14","H4","E14","B1","H1","A5","E2","G7","D8","B11","G5","C4","A4","D4"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '2-2026-02-18-1',
    '2',
    '2026-02-18',
    '16:30',
    4,
    120,
    '{"H10","H8","D15","G3","B16","F2","A9","C8","B8","D7","E3","B15","B14","F10","G2","A16","F3","H3","F9","B11","D13","G12","C11","G7","H1","A11","E6","E8","C5","G8"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '2-2026-02-18-2',
    '2',
    '2026-02-18',
    '18:00',
    4,
    120,
    '{"B1","H8","G10","F14","D7","B14","C1","G7","A7","D8","G9","B6","C2","F6","B9","F10","B3","A5","F4"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '2-2026-02-18-3',
    '2',
    '2026-02-18',
    '21:00',
    4,
    120,
    '{"A1","H10","C3","E14","H9","G9","B4","D14","D12","D16","C8","A10","B1","B10","A14","F4","E1","D2","H4","E4","C16","H5","H1","A3","E7","F3","C1","F5"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '3-2026-02-12-0',
    '3',
    '2026-02-12',
    '14:00',
    4,
    120,
    '{"D13","C10","G10","D16","H7","B14","A16","B13","H5","H3","D10","D2","B8","F6","A7","E6","G12","A9","C14","H6","C12","G4","G6","E4","D9","E11"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '3-2026-02-12-1',
    '3',
    '2026-02-12',
    '16:30',
    4,
    120,
    '{"B14","E13","B7","D6","A11","A10","G5","C6","A16","C10","D3","A12","H10","E6","F13","F14","A6","C1","H1","E9","A9","G8","F6","B15","B3","D14","E11","G2","E5","D9"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '3-2026-02-12-2',
    '3',
    '2026-02-12',
    '18:00',
    4,
    120,
    '{"G1","A5","C13","D5","G5","G11","B1","D16","A7","B11","C14"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '3-2026-02-12-3',
    '3',
    '2026-02-12',
    '21:00',
    4,
    120,
    '{"D10","D1","A13","D9","C11","D7","E9","E3","C3","G1","H2","F9","D2","H5","H9","F7","E1","F3","A12","G6","D14","G12","F12","F1","D15","B1","A11","B12","H6","F4","E4","E14"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '3-2026-02-13-0',
    '3',
    '2026-02-13',
    '14:00',
    4,
    120,
    '{"C7","H7","A6","G2","E7","G1","G6","C9","F11","F3","F8","A16","H3","E6","B5","D5","A9","B9","H2","B13","A1","A5","H8","D6","C15"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '3-2026-02-13-1',
    '3',
    '2026-02-13',
    '16:30',
    4,
    120,
    '{"E14","F10","F12","F7","G12","F14","G6","F3","G11","G4","B10","E12","D9","B15","B13","C9","H8","G2","E7","D12","C7","B11"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '3-2026-02-13-2',
    '3',
    '2026-02-13',
    '18:00',
    4,
    120,
    '{"B3","H4","A11","H1","D7","A5","E9","E12","H10","E5","H6","E10","F5","G1","G9","B7","D12","D4","E6","A15","G3","G5","C8","G12","D5","E7","F13","G8","C16","B15"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '3-2026-02-13-3',
    '3',
    '2026-02-13',
    '21:00',
    4,
    120,
    '{"H9","B8","A1","D10","F9","F10","A9","B6","G3","C15"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '3-2026-02-14-0',
    '3',
    '2026-02-14',
    '14:00',
    4,
    120,
    '{"C8","B10","E1","D6","B12","E12","E11","F6","B8","G12","H1","G4","D4","F11","H6","B6","F13","G5","H9","B7","B3","D14","G6","F7","C3","B2"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '3-2026-02-14-1',
    '3',
    '2026-02-14',
    '16:30',
    4,
    120,
    '{"H7","H5","A9","C10","E9","D4","D15","E7","B5","F7","D11","A1","C3","D8","D7","H9","F1","B13","G8","C6","H3","C4","E1","G7","F13","D12","E4","C15","H6","A5","D2","A12","C16","H2","G1","H10","G2","C13","D9","G11","F12","F5"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '3-2026-02-14-2',
    '3',
    '2026-02-14',
    '18:00',
    4,
    120,
    '{"H4","B4","E14","D1","B6","A9","E3","G4","G5","A8","E8","F2","H2","C6","A3","G10","G3","A10","F5","E7","D13","A6","G12","B5","H6","B14"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '3-2026-02-14-3',
    '3',
    '2026-02-14',
    '21:00',
    4,
    120,
    '{"D12","D2","H8","H7","E1","D9","E13","G6","C1","F13","F10","B9","H6","H4","B4","A1","E11","B14","E14","A5","F12","D1","E5"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '3-2026-02-15-0',
    '3',
    '2026-02-15',
    '14:00',
    4,
    120,
    '{"H4","A15","B8","G3","A5","C2","F10","C14","H5","F7","B14","B4","B13","E5","F5","E2","E8","G9","C12","H2","H10","E10","B5","G12","F6","G4","C8","F4"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '3-2026-02-15-1',
    '3',
    '2026-02-15',
    '16:30',
    4,
    120,
    '{"B15","D10","D15","B7","A5","B5","D16","C12","A16","D9","E6","H4","G11","C8","E12","C9","B16","H6","E14","B2","C10","D7","F9","E7","G1","B3","D3","A12","G3","C15","A8","H2","E1","D12","F11","C11","A4","A3","D14","B8"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '3-2026-02-15-2',
    '3',
    '2026-02-15',
    '18:00',
    4,
    120,
    '{"H1","E5","H4","C13","G7","F13","D6","H10","E8","G6","F10","B14","E4","F12","D8","A7","A3","E14","D12","G3","A5","D3","E10","A2","D11","H9","G11","H7","C1","G12","F9","A8","B16","B13","E6"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '3-2026-02-15-3',
    '3',
    '2026-02-15',
    '21:00',
    4,
    120,
    '{"D8","G9","E3","B14","G3","A1","C8","F13","E11","A11","H7","B12","B4","G6","C3","H2","E1","C5","G12","F11","H4","C10"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '3-2026-02-16-0',
    '3',
    '2026-02-16',
    '14:00',
    4,
    120,
    '{"A16","C7","G11","G4","A7","F7","G9","G2","H10","F8","B14","B3","D15","G12","A11","E13","G8","F12","C13","A15","A10","C1","C8","H6","G6","F10","C10","C16","G1","B16","F3","A9","E5","B7","C11","A3","D9","B4","A14","A13"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '3-2026-02-16-1',
    '3',
    '2026-02-16',
    '16:30',
    4,
    120,
    '{"G8","C16","H3","H7","G12","D15","B8","A8","A5","G4","H1","C2","A2","C10","F12","E14","D8","F6","C6","E1","F1","E4","F5","A9","F2","E7","G5","D1"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '3-2026-02-16-2',
    '3',
    '2026-02-16',
    '18:00',
    4,
    120,
    '{"A16","H10","D3","C5","C2","B9","E12","A3","A13","H1","D16","C11","A15","C14","B4","E1","A9","C12","D6","D12","B7","F7","G5","G11","F3","F9","G3","F14","F8","B1","H6","A8","H3","C7","F5"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '3-2026-02-16-3',
    '3',
    '2026-02-16',
    '21:00',
    4,
    120,
    '{"G3","E14","B14","G10","G9","B11","H6","H8","C16","B7","H4","C11","C4","D10","D3","G8","F6","F8","C5","C2","B3","C6","H10","G6","A12","D1","A2","E4","B13","F3","C3"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '3-2026-02-17-0',
    '3',
    '2026-02-17',
    '14:00',
    4,
    120,
    '{"D7","G5","G2","B14","C5","B13","B10","C1","D14","B15","H7","E8","H1","H5","F13","A14"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '3-2026-02-17-1',
    '3',
    '2026-02-17',
    '16:30',
    4,
    120,
    '{"E7","B3","F13","G12","H5","G10","E11","H4","F1","A4","D8","B11","C5","D4","H10","A5","B10","D1","B9","A13","B2","A14","B14","H7","E9","A1","B16","E1","G3","D13","B13","C4","F11"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '3-2026-02-17-2',
    '3',
    '2026-02-17',
    '18:00',
    4,
    120,
    '{"A11","H10","E4","B7","C13","C8","C15","E7","C7","D10","D15","H3","A15","G9","C5","D2","F4","H6","E6","C4","C3","F8","H2","F7","D9","H4","G5","G7","F6","E1","E8","G10","D11","C14","H1","D6"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '3-2026-02-17-3',
    '3',
    '2026-02-17',
    '21:00',
    4,
    120,
    '{"E12","H8","D11","D3","B12","A4","B10","A8","E1","H2","F5","D12"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '3-2026-02-18-0',
    '3',
    '2026-02-18',
    '14:00',
    4,
    120,
    '{"D6","B11","D16","A15","A7","F3","H1","H7","B7","C13","F1","F11","B4","E11","D9","F5","C4","A4","B14","F8","G5","A14","C10","E5"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '3-2026-02-18-1',
    '3',
    '2026-02-18',
    '16:30',
    4,
    120,
    '{"G4","A13","E1","C10","E9","G12","A12","D5","D8","G8","G9","A4","H8","G3","G6","H5","F14","H4","G2","F9","F3","A3","C9","D6","G11","C6","A15","D9","A6","C4","D14","B3","B5","A7","C3","B2","B6","B8","C16","E3","H3","E4","H10","E7"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '3-2026-02-18-2',
    '3',
    '2026-02-18',
    '18:00',
    4,
    120,
    '{"F2","D3","H1","A11","G4","E2","G3","D2","F10","A13","E14","B10","B11","H3","F1","F9","A6","C11","E9","C7","C16","C9","G8","A5","B7","A8","H10","E1","G6","G11"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '3-2026-02-18-3',
    '3',
    '2026-02-18',
    '21:00',
    4,
    120,
    '{"A3","C13","H5","A8","D10","F9","G5","G4","G7","D1","G11","F5","C6","F6","B13","A4"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '4-2026-02-12-0',
    '4',
    '2026-02-12',
    '14:00',
    4,
    120,
    '{"D9","H7","F9","G6","A11","E4","G4","G9","E8","G2","D5","A10","G8","D16","B8","D14","E7","F5","A5","H3","C11","C1","F14","H2","G12","B14","D2","D1","B5","A4","F1","F8","E3","F12","D15","B16","E9","H9"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '4-2026-02-12-1',
    '4',
    '2026-02-12',
    '16:30',
    4,
    120,
    '{"D3","C7","G4","B8","A8","F14","B11","D10","B14","C3","A13","C9","H1","H8","A14","E10","D13","C11"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '4-2026-02-12-2',
    '4',
    '2026-02-12',
    '18:00',
    4,
    120,
    '{"F10","E5","F6","F5","G4","B13","F12","A3","G9","E8","F13","A11"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '4-2026-02-12-3',
    '4',
    '2026-02-12',
    '21:00',
    4,
    120,
    '{"H6","G4","F6","A12","E14","F11","F2","B6","A7","E13","F14","D7","D12","A6","A16","D6","B9","H5","C10","G5","C13"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '4-2026-02-13-0',
    '4',
    '2026-02-13',
    '14:00',
    4,
    120,
    '{"G11","D7","G12","G3","D1","E7","G2","G9","A11","B11","G8","E11","F1","B1","D13","A2","C10","H8","A15","A1","D3"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '4-2026-02-13-1',
    '4',
    '2026-02-13',
    '16:30',
    4,
    120,
    '{"H6","F3","A2","C13","F8","A9","E2","A14","F11","C9","C3","H7","C8"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '4-2026-02-13-2',
    '4',
    '2026-02-13',
    '18:00',
    4,
    120,
    '{"F8","G4","C15","C9","A11","F3","A9","G2","H9","A12","H2","E2","B13","H10","A1","F4","A4"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '4-2026-02-13-3',
    '4',
    '2026-02-13',
    '21:00',
    4,
    120,
    '{"B4","F7","E2","F5","E10","A7","H9","F12","C11","D13","H5","E11","B15","F14","F8","C7","E6","F1","F11","H4","H7","E8","F9","B7","H2","G7","C13","D6","E3","B5","B13","E7"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '4-2026-02-14-0',
    '4',
    '2026-02-14',
    '14:00',
    4,
    120,
    '{"D15","D11","H7","E13","A4","H8","D3","B8","D14","C5","B5","G4","G5","C10","G6","E14","A2","H6","F9","A15","D16","B16","F1","G10","E5","D7","B1","G1","B13","C6","D9","H9","A8","E3","B14"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '4-2026-02-14-1',
    '4',
    '2026-02-14',
    '16:30',
    4,
    120,
    '{"G11","A8","G9","F3","E14","F5","D3","G10","C15","E7","H2","D11","D5","F1","A11","F13","G2","D8","E5","F9","A2","E3"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '4-2026-02-14-2',
    '4',
    '2026-02-14',
    '18:00',
    4,
    120,
    '{"G3","E1","C5","H7","D3","D14","F1","A13","B16","E13","G7","G4","C11","B7","G6","A14","A12","D7"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '4-2026-02-14-3',
    '4',
    '2026-02-14',
    '21:00',
    4,
    120,
    '{"A10","F8","E12","E9","G8","D16","D5","E6","H10","A16","E8","A15","F12","F2","B12","C2","E11","H5","C5","H7","E13","C8","E5","F1","B13","A5","B6","C12","G4","G3","B2","H9","B9","F9","B10","D9","B15","G6","H3"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '4-2026-02-15-0',
    '4',
    '2026-02-15',
    '14:00',
    4,
    120,
    '{"F14","A8","B12","B10","F2","H7","D16","D12","B1","G1","C15","A15","A4"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '4-2026-02-15-1',
    '4',
    '2026-02-15',
    '16:30',
    4,
    120,
    '{"A3","D11","C5","D1","F12","C10","A13","G10","B15","B6","D8","G11","E3","D9","F6","B2","D2","A14","D3","B8","H2","A11","F13","C14","H5"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '4-2026-02-15-2',
    '4',
    '2026-02-15',
    '18:00',
    4,
    120,
    '{"D7","B10","G6","C9","E6","C5","G3","C7","E8","F2","D10","D9","F3","E9","C16"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '4-2026-02-15-3',
    '4',
    '2026-02-15',
    '21:00',
    4,
    120,
    '{"A1","H3","G2","B14","H9","F8","A14","B12","B5","B9","E5","F6","C5","G12","G8","E10","D3","H8","E1","E2","F5","F10","A3","B7","D11","A8","F1","B13","C4","H6","E14","C1","B1","A15","D12"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '4-2026-02-16-0',
    '4',
    '2026-02-16',
    '14:00',
    4,
    120,
    '{"C15","E10","F6","B11","B6","B5","C8","A11","A4","E13","D4","F5","F10","F2","B2","A13","B9","B15","F7","E7","A5","D3","E6","G5"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '4-2026-02-16-1',
    '4',
    '2026-02-16',
    '16:30',
    4,
    120,
    '{"C1","E12","E1","G6","H6","H9","E5","H10","C6","G8","A12","C9","D12","A6","D1","D2","C10","G10","C8","B15","C2","B3","G12","A3","B11","B2","A8","G9","H3","H1","F1","B7","H7","A13","C16","A4","B9"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '4-2026-02-16-2',
    '4',
    '2026-02-16',
    '18:00',
    4,
    120,
    '{"D13","C1","B11","G10","H3","G6","E7","E6","G8","E8","E3","E4","F14","E11","E9","G1","F9","C6","F13","H2","F2","C9","C12","C10","H1","D3","D14","E12","C8","F5"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '4-2026-02-16-3',
    '4',
    '2026-02-16',
    '21:00',
    4,
    120,
    '{"D16","C12","A14","D11","F12","D5","H7","F1","B1","D14","C11","C1","F10","B16","F14","F3","B14","G4","B7","D8","D9","B2","B13","B15","D6","D12","H8","E6","G3","G11","H6","C10"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '4-2026-02-17-0',
    '4',
    '2026-02-17',
    '14:00',
    4,
    120,
    '{"C9","B15","B9","E2","B16","G2","G6","F2","E3","F6","H3","F1","B3","A16","G8","A10","E1","H4","A11","A6","E6","G1","H9","B13","E7","F7","G12","C4","D10","H8"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '4-2026-02-17-1',
    '4',
    '2026-02-17',
    '16:30',
    4,
    120,
    '{"E10","C7","D2","A4","G11","A2","A10","E8","G8","G3","B6","B16","H3","H6","H7","D5"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '4-2026-02-17-2',
    '4',
    '2026-02-17',
    '18:00',
    4,
    120,
    '{"H2","E1","D9","B6","D15","A10","E13","H9","B15","B10","F4","C11","F9","F6","E8","H6","A1","A13","D8","C12","H7","D13","C16","A7","A6","C6","E5","B2","E11","D1"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '4-2026-02-17-3',
    '4',
    '2026-02-17',
    '21:00',
    4,
    120,
    '{"D16","A11","C10","F5","E3","H2","D14","E9","C9","G7","A1","B13","H10","B8","B6","E14","H1","F13","H4","A6","G9","B10"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '4-2026-02-18-0',
    '4',
    '2026-02-18',
    '14:00',
    4,
    120,
    '{"A8","G3","F5","C8","G6","D16","H6","G1","B16","B1","B15","H10","B3","E7","D14","D13","D10","H3","F3","A4","E11"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '4-2026-02-18-1',
    '4',
    '2026-02-18',
    '16:30',
    4,
    120,
    '{"H3","F10","B5","E6","E7","B14","G10","C2","F1","E10","A16","F3","F9","B7","E9","G3","A9","D8","B6","F7","B3","C14","G4","B8","G2","F2","C11","B12","C16","E1","A5","H7","H5"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '4-2026-02-18-2',
    '4',
    '2026-02-18',
    '18:00',
    4,
    120,
    '{"G5","C3","E3","G2","G10","A1","E13","A6","A10","C15","E9","H1","G1","F10","B5","A15","H2","A4","E2","F5","D9","B7","C6","D4","E14","G11","H7","C5","H3"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '4-2026-02-18-3',
    '4',
    '2026-02-18',
    '21:00',
    4,
    120,
    '{"D16","A5","B14","G9","B16","G11","E10","B10","A4","G2","C16","A2","A3","C7","G10"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '5-2026-02-12-0',
    '5',
    '2026-02-12',
    '14:00',
    4,
    120,
    '{"G9","G5","A4","D13","F2","E4","G2","F11","H3","B13","E5","B9","A2","C5","C6","E2","A16","A5","A11","G1","E3","H8","G7","B4","A8","B12","H5","H10","H2","E7","H9","H7","A3","B8"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '5-2026-02-12-1',
    '5',
    '2026-02-12',
    '16:30',
    4,
    120,
    '{"G7","B2","G6","F7","F1","B5","F5","D5","D15","G8","G3","E4","H2","H3","F6","E3"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '5-2026-02-12-2',
    '5',
    '2026-02-12',
    '18:00',
    4,
    120,
    '{"G12","G6","E1","G7","D13","B1","E13","B7","D15","C3","G5","H2","F7","B9","F2","E6","E8","E4","C4","B3","E10","C6","B10","C10","E2","A1","C16","H9","D10","E14","C13","H1","H7","G10","H8","C8","F5","A4"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '5-2026-02-12-3',
    '5',
    '2026-02-12',
    '21:00',
    4,
    120,
    '{"E10","D14","G11","B12","A5","H6","A11","A6","G7","A13","G10","F6","A1","B1","D16","C15","E13","A16","G12","E8","H5"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '5-2026-02-13-0',
    '5',
    '2026-02-13',
    '14:00',
    4,
    120,
    '{"A3","B2","C2","F2","A13","F12","F10","C3","G12","A16","H5","E12","A2","F7","G11","C12","F9","E1","B7","B6","H4","F8","E10","C10","G4","G2","C4","G7","E5","G6","G1","G9"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '5-2026-02-13-1',
    '5',
    '2026-02-13',
    '16:30',
    4,
    120,
    '{"F14","A12","H3","H5","A3","G6","G5","D2","D8","A7","A2","D13","F4","G4","A13","A10","A15"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '5-2026-02-13-2',
    '5',
    '2026-02-13',
    '18:00',
    4,
    120,
    '{"F8","E9","D8","E8","F9","C6","D14","F3","H3","D13","E6","E13","H7","E7","C2","F10","H9","C15","A5","G6","H6","E1","D4"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '5-2026-02-13-3',
    '5',
    '2026-02-13',
    '21:00',
    4,
    120,
    '{"E3","F6","A16","H9","E5","H4","C9","H2","D5","B2","H10","D4"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '5-2026-02-14-0',
    '5',
    '2026-02-14',
    '14:00',
    4,
    120,
    '{"A12","B1","F7","D12","C4","E2","G5","E9","H1","H9","C13","G1","C2","B7","C8","F2","C6","D13","F5","F6","F14","D6","E11","E13","A9"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '5-2026-02-14-1',
    '5',
    '2026-02-14',
    '16:30',
    4,
    120,
    '{"C7","A6","C11","H8","H3","H1","C2","H10","E12","E14","C13","D14","B9","E13","A16","H9","E1","H2","F3","A2","E5","B15","F2","A7"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '5-2026-02-14-2',
    '5',
    '2026-02-14',
    '18:00',
    4,
    120,
    '{"E1","A3","D10","B14","F10","A12","C5","E4","G11","G4","D7","G5","C13","F9","D1","C8","B13","E9","A1","E10","A7","D6","A11","C16","B2","G10","A16","F8","E2","E6","A6","E13"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '5-2026-02-14-3',
    '5',
    '2026-02-14',
    '21:00',
    4,
    120,
    '{"A16","E12","F2","E1","D14","G5","H4","D13","F8","G7","C3","C11","C14","F14","H6","D10","A9","B14","D11","C4","G9","E2","A8"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '5-2026-02-15-0',
    '5',
    '2026-02-15',
    '14:00',
    4,
    120,
    '{"C1","E10","D15","B16","G11","B12","G2","F7","D9","G6","E3","D1","B13","A16"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '5-2026-02-15-1',
    '5',
    '2026-02-15',
    '16:30',
    4,
    120,
    '{"A7","H6","B8","H1","B4","B7","B15","C10","E3","A10","A6","E4","F13","H5","G12","F6","E9","E13","E14","E1","H7","F8","D5","G5","G1","D16","A3","C2","F12","H3","D11","E5","B9","H2"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '5-2026-02-15-2',
    '5',
    '2026-02-15',
    '18:00',
    4,
    120,
    '{"F12","G4","A15","A1","G3","D14","A8","F2","G10","B10","A16","D9","D15","H9","B8","C6","E7","G12","A9","B2","D7","E10","F5","D4"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '5-2026-02-15-3',
    '5',
    '2026-02-15',
    '21:00',
    4,
    120,
    '{"E13","H10","E4","B4","H7","B5","C11","C15","A12","A7","A3","G9","D9","C16","A4","C2","H8","F13","C14","F9","C12","B7","F8","C7","E9","A10","H2","E1","H1","B16"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '5-2026-02-16-0',
    '5',
    '2026-02-16',
    '14:00',
    4,
    120,
    '{"G1","A7","B15","F1","H3","E13","A15","B9","G5","F7","D4","F11","A16","G10","H4","C10","E5","C7","D6","B6","E9","H8","G4","F13","D5","B5"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '5-2026-02-16-1',
    '5',
    '2026-02-16',
    '16:30',
    4,
    120,
    '{"H5","E8","H1","E13","E14","A12","H3","A10","A14","G11","D1","D7","G8"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '5-2026-02-16-2',
    '5',
    '2026-02-16',
    '18:00',
    4,
    120,
    '{"D4","A2","D14","F3","E8","H3","A15","B13","G7","B16"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '5-2026-02-16-3',
    '5',
    '2026-02-16',
    '21:00',
    4,
    120,
    '{"F8","A1","E6","B10","G10","F3","D3","F4","D10","C16","A10","C6","H5"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '5-2026-02-17-0',
    '5',
    '2026-02-17',
    '14:00',
    4,
    120,
    '{"A4","A11","C10","G4","C13","C12","D4","F5","E9","G10","G9","D11","C8","C5","H2","D1","F4","D7"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '5-2026-02-17-1',
    '5',
    '2026-02-17',
    '16:30',
    4,
    120,
    '{"B10","E11","F1","H3","B6","B15","H9","H8","F12","E3","H1","H10","G2","B14","E9","A9"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '5-2026-02-17-2',
    '5',
    '2026-02-17',
    '18:00',
    4,
    120,
    '{"B12","F12","G8","H5","D3","A2","E3","F3","A8","G5","C5","B15","D7","C2","F9","H9","H10","G11"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '5-2026-02-17-3',
    '5',
    '2026-02-17',
    '21:00',
    4,
    120,
    '{"D8","A4","A14","B6","A12","F10","B11","C3","H9","C2","F13","H5","E8","C5","H7","G7","B12","B2","A11","G10","B3","E14","E12","A13","F2","B9","G11","E5","D5","D15","B13","A3","C14","D11","C16"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '5-2026-02-18-0',
    '5',
    '2026-02-18',
    '14:00',
    4,
    120,
    '{"G7","G1","E3","E11","F13","F8","C6","D12","C16","F7","A14","G2","H6","E14","D2","B15","E1"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '5-2026-02-18-1',
    '5',
    '2026-02-18',
    '16:30',
    4,
    120,
    '{"A2","H7","E11","F10","G7","A15","G5","A1","D2","F4","C15","E1","C3","G4","C1","C13","C14","F14","D10","G11","E10","A6"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '5-2026-02-18-2',
    '5',
    '2026-02-18',
    '18:00',
    4,
    120,
    '{"B16","E7","H7","G11","E12","A7","F12","F2","H2","F14","C5","E9","G2","B1","E13","E8","C2","C12","D7","E2","H6","F1","A8","H4","D11","C11","F3","A15","B7","D1","D15","A2","B3","A16","F7","H9","E14"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '5-2026-02-18-3',
    '5',
    '2026-02-18',
    '21:00',
    4,
    120,
    '{"A2","H1","C5","H7","H2","C12","F9","B5","B1","F10","A11","D10","H4","H5","F11","F12","E9","G3","B12","G10","F8","A1","E13","A8","B8","D7","G4","A10","B16","C15","A3","B14","H6","H3","E12","G1","G6","G8","E11","H8"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '6-2026-02-12-0',
    '6',
    '2026-02-12',
    '14:00',
    4,
    120,
    '{"C10","E6","D3","G12","F11","F6","G1","G5","D7","B11","G4","D8","D2","E12","H4","H7","E10","G8","F1","B10","E13","F7","B1","A3","H10","H8"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '6-2026-02-12-1',
    '6',
    '2026-02-12',
    '16:30',
    4,
    120,
    '{"A1","B16","E14","C2","E3","H5","E8","H1","C15","D16","F12","E5","C8","C16","G5","D14","C10","C7","C3","D8","G6","B4","H2","F7","G7","B13","E6","E13","E2","B15","C4","H3"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '6-2026-02-12-2',
    '6',
    '2026-02-12',
    '18:00',
    4,
    120,
    '{"G6","E7","B15","E14","A14","A11","G1","D1","A5","H1","C8","F9","H2","D14","F3","C16","A10","B4","E10","A7","F1","C4","F5","A8","B3","F13","E8","B11","E4","B14","H4","A4","B16","F10","G11","H5"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '6-2026-02-12-3',
    '6',
    '2026-02-12',
    '21:00',
    4,
    120,
    '{"G3","A11","F12","C14","A13","C12","A5","F13","H6","F5","A16","A10","G12","D2","C5","C16","E8","A6","H2","F7","F3","A3","D16","E13","F6","E11","B6","B2","D15","A2","B9","F4","D4"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '6-2026-02-13-0',
    '6',
    '2026-02-13',
    '14:00',
    4,
    120,
    '{"G8","E3","D16","H5","F9","C10","E6","B4","H2","G11","G10","F4","C11","D4","D14","B1","C14","B8","C2","A10","E4","F3","G2","H1","B15","H10","E1","E7","A4","A14","B3","E12"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '6-2026-02-13-1',
    '6',
    '2026-02-13',
    '16:30',
    4,
    120,
    '{"C15","F14","F10","D2","E1","C4","G4","C13","H7","G5","H9","A11","B4","A16","C10","C3"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '6-2026-02-13-2',
    '6',
    '2026-02-13',
    '18:00',
    4,
    120,
    '{"D12","H7","E13","C12","D7","C3","A4","F3","C11","F4","F9","B11","C10","D1","E7","H10","E2","B3","A8","G11","G8","H4","E4","F12","B1","D14","A14","G4","H5","A7","D4","A3","B6","H1","D5","G5"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '6-2026-02-13-3',
    '6',
    '2026-02-13',
    '21:00',
    4,
    120,
    '{"E4","E11","A1","H10","C7","F2","G6","D10","F8","G2","F5","A13","D14","C6","A7","B8","B7","B3","F3","B15","E1","C4"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '6-2026-02-14-0',
    '6',
    '2026-02-14',
    '14:00',
    4,
    120,
    '{"A7","A11","C6","C9","D10","B7","B12","B16","D1","E7","A1","D15","C1","H9","D5","B3","H1","E5","E3","D4","H7","A8","F5","A4","G2","B10","D16","D11","C12","H6"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '6-2026-02-14-1',
    '6',
    '2026-02-14',
    '16:30',
    4,
    120,
    '{"A16","B5","B9","A2","H2","E5","A1","D11","D13","B1","B2","C6","B3","G9","C2","F1","E6","C8","C15","G7","B16","D3","G4","A6","A3","A11","A7","F9","A13","D12"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '6-2026-02-14-2',
    '6',
    '2026-02-14',
    '18:00',
    4,
    120,
    '{"H8","F13","H5","F3","F5","D1","G8","D12","D13","B4","F2","B8","B6","A3","F6","B12","C16","D5","E6","A15","D3","F9","H1","H10","E9","H9","H7","H4","G12","A9","D2","D14","F7","A13","B16","A14","E11"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '6-2026-02-14-3',
    '6',
    '2026-02-14',
    '21:00',
    4,
    120,
    '{"D10","G9","G1","F3","G3","H1","E13","H2","E3","C11","D5","F11","E7","B1","B9","E12","F2","C9","A12","H4","A5","G11","H5","D3","G7","E14","E6","F4","D14","F13","C6","H3","F5"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '6-2026-02-15-0',
    '6',
    '2026-02-15',
    '14:00',
    4,
    120,
    '{"F3","A5","A11","F6","D4","G7","A14","B5","F7","E12","B12","B2","E6","A15","G6","D2","C7","B11","D15","A9","C3","D6","C11","C15","F13","G10","E11","B8","B1","H2","B7","C2","E1","G4","D1"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '6-2026-02-15-1',
    '6',
    '2026-02-15',
    '16:30',
    4,
    120,
    '{"E8","H4","D9","D16","F6","C14","C12","A12","D7","A2","A3","C3","C2","E1","A13","F11","H1","E3","G4","G12","G5","A4","E14","B11","F3","G3","H2"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '6-2026-02-15-2',
    '6',
    '2026-02-15',
    '18:00',
    4,
    120,
    '{"B3","C9","F12","E6","B9","G6","B11","E14","B7","G7","B4","A6","D2","G12","A3","G9","G1","H10","D11","B10","F6","D14","H5","G10","G11","B14","A14","G2","F14"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '6-2026-02-15-3',
    '6',
    '2026-02-15',
    '21:00',
    4,
    120,
    '{"A4","H10","H1","F12","C16","A11","A2","D10","G5","D8","C9","E5","F5","A5","H4","B11","A3","D7","F11","A14","A12","A15","G7"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '6-2026-02-16-0',
    '6',
    '2026-02-16',
    '14:00',
    4,
    120,
    '{"D14","E9","C16","F12","E3","H8","C3","A11","B14","C15"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '6-2026-02-16-1',
    '6',
    '2026-02-16',
    '16:30',
    4,
    120,
    '{"H4","C2","H10","H8","D11","F11","E10","G7","D4","D10","H1","D15","G3"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '6-2026-02-16-2',
    '6',
    '2026-02-16',
    '18:00',
    4,
    120,
    '{"D11","C10","C15","A16","D13","A14","E3","A9","A13","E11","B9"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '6-2026-02-16-3',
    '6',
    '2026-02-16',
    '21:00',
    4,
    120,
    '{"D12","H10","H4","C2","H7","C14","F5","D5","F10","A10","D2","A15","B6","G12","D1","F3","A2","H3","C11"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '6-2026-02-17-0',
    '6',
    '2026-02-17',
    '14:00',
    4,
    120,
    '{"D3","C16","A6","F8","C9","C4","D11","G5","G11","D13","H4","G4","F14","G3","C8","F9","F2","H10","A10","E7","C15","E9"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '6-2026-02-17-1',
    '6',
    '2026-02-17',
    '16:30',
    4,
    120,
    '{"A15","G5","A13","G7","B5","H7","A12","G1","H1","E6","A1","C10","F3","B1","B6","C1","C2","G6","A6","E1","C14","E14","F6","E9","G3","H9","B8","D5","F2","F4","D1","A10"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '6-2026-02-17-2',
    '6',
    '2026-02-17',
    '18:00',
    4,
    120,
    '{"F5","F6","G8","C6","D2","G2","B9","F14","F11","B3","G5","G9","A8","D4","E12","B13","G4","D3","G12","D15","E13","C1","B15","F3","G3","F13"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '6-2026-02-17-3',
    '6',
    '2026-02-17',
    '21:00',
    4,
    120,
    '{"F5","C15","H3","C2","F3","C10","D10","B3","E14","H5","C1","A5","B10","A10","H4","A16","F10","F6","G3","B12","E7","E4","H9","B5","A4","C3","D9","A12","G7","C4","E8","B9","C13","F2","H10","B6","A13","H2"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '6-2026-02-18-0',
    '6',
    '2026-02-18',
    '14:00',
    4,
    120,
    '{"E13","A10","H1","C13","C2","C7","F14","F8","D9","B11","D10","C9","B3","D12","B16","C10","B15","D2","G12","D14","A14","E6","G8","A5","H4","C16","F5","C6","H3","F4","B8","D1","H9","H7","H6","D7","D5","C3","G7","B10","D16"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '6-2026-02-18-1',
    '6',
    '2026-02-18',
    '16:30',
    4,
    120,
    '{"A13","E2","H5","B4","D11","E7","F7","B12","A14","A11","F5","H7","B13","H4","A2","F2","B14","B1","D14","C3","B16","B15","C15","G12","A8","E13","G9","C11","G2","A1","G3","A6","F13","H3","F6","D13","E5"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '6-2026-02-18-2',
    '6',
    '2026-02-18',
    '18:00',
    4,
    120,
    '{"C16","A11","F1","F7","E1","A9","D3","C8","F2","A15","F13","B9","H3","B8","E3","H10","F12","A10","G3","H7","E12","F10","H6","E13","B12","H2"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '6-2026-02-18-3',
    '6',
    '2026-02-18',
    '21:00',
    4,
    120,
    '{"E14","B2","G9","C2","A4","G1","E4","H4","E12","H9","F1","C11","G6","E6","G3","A13","B14","A9","E3","E5","B15","A3"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '7-2026-02-12-0',
    '7',
    '2026-02-12',
    '14:00',
    4,
    120,
    '{"A1","C8","B3","G8","C13","H3","H9","D12","B1","D9","G10","C11","F5","B10","A10","F12","G7","E5","C16","A9","B5","F2","F14","H8","D13","B13","E12","B8","C5","B11","F6","H1","G2","G9","A2","A7","F7","D1"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '7-2026-02-12-1',
    '7',
    '2026-02-12',
    '16:30',
    4,
    120,
    '{"E12","G9","A16","C6","F14","G11","C13","B16","E9","C4","A8","H1","D5","A9","C3","F8","G4","D10","B3","E13","B7","C12","E2","G6","B9","B14","D9","D8","E14","A2","B12","C15","F9","D6","F12","A10","C14"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '7-2026-02-12-2',
    '7',
    '2026-02-12',
    '18:00',
    4,
    120,
    '{"B5","E1","F13","D13","E14","A7","D16","E6","B1","H9","D8","D9","H6","A10","B3","H8","B16","C10","D3","D2","G6","F5","E3","G10","A9","A15","C16","H1","C9","F6","B2","G9","G1","E12","C12"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '7-2026-02-12-3',
    '7',
    '2026-02-12',
    '21:00',
    4,
    120,
    '{"F9","C3","D14","H6","C10","B10","D16","F6","E7","B9","E8","G8"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '7-2026-02-13-0',
    '7',
    '2026-02-13',
    '14:00',
    4,
    120,
    '{"A5","B3","G12","D8","G11","A9","E6","D13","F8","E11","C8","C1","D11","D7","A14"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '7-2026-02-13-1',
    '7',
    '2026-02-13',
    '16:30',
    4,
    120,
    '{"D3","H4","C8","D9","F3","G4","D7","D1","A5","E6","F7","C1","E7","E4","G6","D5","B13","H7","H8","G12","C2","F1","C13","H10","F2","C4","B9","H3","H6","G5","C11","H5","B14","G3","E10","A9","A3","F6","A16","B5","A7"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '7-2026-02-13-2',
    '7',
    '2026-02-13',
    '18:00',
    4,
    120,
    '{"H7","G7","B9","E7","A7","E10","F3","G5","D1","G4","F1","B13","D3","B1","G10","B7"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '7-2026-02-13-3',
    '7',
    '2026-02-13',
    '21:00',
    4,
    120,
    '{"D12","F11","F8","H2","G7","B3","B6","F1","D14","A8","H5","F3","A7","E10","A9","C15","G8","G12","A2","D16","F7","C11","B5","G11","F10","B10","C4","B14","D13","A3","E14","D9","C10","C8","E12","B9","H4","D1","D7"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '7-2026-02-14-0',
    '7',
    '2026-02-14',
    '14:00',
    4,
    120,
    '{"F10","C8","C1","D6","C14","A5","A1","A12","C12","D10"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '7-2026-02-14-1',
    '7',
    '2026-02-14',
    '16:30',
    4,
    120,
    '{"A3","H6","F12","F1","B5","G6","B1","E12","B14","C12","G2","G1","E5","H5","A15","G10","E6","A5"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '7-2026-02-14-2',
    '7',
    '2026-02-14',
    '18:00',
    4,
    120,
    '{"G6","A6","B9","B8","D13","B13","F1","H1","E4","E8","A11","A5","G5","C8","F6","H4","H8","E6","H5","A3","B5","G12","B4","C7","G1","D11"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '7-2026-02-14-3',
    '7',
    '2026-02-14',
    '21:00',
    4,
    120,
    '{"E4","H5","F13","C5","F12","B2","A4","D9","G5","B7","F5","D12","C12","C11","A5","C7","E13","H2","C2"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '7-2026-02-15-0',
    '7',
    '2026-02-15',
    '14:00',
    4,
    120,
    '{"H7","H5","G9","B1","H10","F8","B3","A2","C15","D13","F6","E1","C8","C14","G1","D1","E5","H1","H2","D6","F4","D7","B8","A11","E14","H4","G11","A12","B9","G5"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '7-2026-02-15-1',
    '7',
    '2026-02-15',
    '16:30',
    4,
    120,
    '{"H1","F12","D12","E2","B7","F8","F7","G3","D13","D11","B5","F4","H5","C16","C4","A3","A7","B9","H4","D14","H3","D1"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '7-2026-02-15-2',
    '7',
    '2026-02-15',
    '18:00',
    4,
    120,
    '{"H9","G3","F11","D12","D7","A15","A16","D15","G7","F6","H2","F8","A2","G5","B7","H3","G4","F5","C12","E10","B14","C5","B13","E7","F2","A12","E1","A13"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '7-2026-02-15-3',
    '7',
    '2026-02-15',
    '21:00',
    4,
    120,
    '{"A10","E7","C7","C10","F11","C3","E14","D15","A7","F4","H3","B7","D11","F5","E8","H8","C9","F8","B5","B3","B16","G9","G8","A14","D5","D12","H10","A16","E11","D7","G6","C14","B6","G2","A13","F6","A12","G10","C12","C2","E4"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '7-2026-02-16-0',
    '7',
    '2026-02-16',
    '14:00',
    4,
    120,
    '{"C1","D15","E13","E7","D10","C4","A12","H1","D16","A11","H7","D2"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '7-2026-02-16-1',
    '7',
    '2026-02-16',
    '16:30',
    4,
    120,
    '{"D12","A15","H4","E12","G5","G10","F1","B15","B7","B10","G7","A10","C13","G11","E5","E3","A11","H2","E11","G8","A4","E14","C11","B6","H5","D3","C16","H3","C2","G1","C1","B4"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '7-2026-02-16-2',
    '7',
    '2026-02-16',
    '18:00',
    4,
    120,
    '{"D6","G7","A3","F2","F8","H2","C11","B1","H9","C9","G5","H4","D5","C15","G2","C3","B14","E5","E1","C10","B11","A7","G3","E13"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '7-2026-02-16-3',
    '7',
    '2026-02-16',
    '21:00',
    4,
    120,
    '{"C8","F3","D13","B9","B15","D15","A12","A3","D6","E11","D10","F12","E4","C9","H6","B12","G6","H2","G10","E7","C5","H10","D12","A7","C13","E10"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '7-2026-02-17-0',
    '7',
    '2026-02-17',
    '14:00',
    4,
    120,
    '{"H8","D10","F1","H9","C11","F3","F10","E1","E10","B11","B13","C3","H6","D13","D4","B7","H7","G3","A13","A12","D11","F12","B9","B10"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '7-2026-02-17-1',
    '7',
    '2026-02-17',
    '16:30',
    4,
    120,
    '{"E2","F3","E13","F1","B16","D9","C15","C9","H7","D13","A5","H5","C11","F14","H2","G3","F2","G9","B13","G11","D6","B2","A16","H10","C3"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '7-2026-02-17-2',
    '7',
    '2026-02-17',
    '18:00',
    4,
    120,
    '{"B10","E7","H5","D3","B3","A12","D8","H8","H6","H4","F9","F5","H3","F8","C2","B11","C4","D13","A11","B13","A1","D1","D11"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '7-2026-02-17-3',
    '7',
    '2026-02-17',
    '21:00',
    4,
    120,
    '{"E13","B16","D1","D11","D14","G1","H5","G12","B8","D15","C13","D5","H1","G11","G9","H7","F12","F3","G5","E1","F1","E8","G4","C14","A12","G3","C1","F6","C2","A4","D6","H6","H3","A13","F13","C6"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '7-2026-02-18-0',
    '7',
    '2026-02-18',
    '14:00',
    4,
    120,
    '{"F13","G2","D16","C1","D3","A13","C11","H8","G11","G3","B15","H6","H4","A4","F4","F12","C8","H1","A11","C15","B3","H7","B7","G4","G10","F8","E9","H9","E6","B6"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '7-2026-02-18-1',
    '7',
    '2026-02-18',
    '16:30',
    4,
    120,
    '{"A12","C13","G8","B15","E3","F7","B12","C4","H2","D6","E13","G6","F14","H10","G1","D7","E6","F6","D10","E4","A9","E8","F8","B10","B4","C14","D11","E10","B16","F4","F12","A5","G4"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '7-2026-02-18-2',
    '7',
    '2026-02-18',
    '18:00',
    4,
    120,
    '{"D13","D7","G4","G5","B10","D16","C2","F11","B13","F3","E10","H8","F5","C14","G3","C5","G6","H3","F7","A3","A6","C15"}'
  );
INSERT INTO showtimes (id, movie_id, date, time, price, total_seats, booked_seats) VALUES (
    '7-2026-02-18-3',
    '7',
    '2026-02-18',
    '21:00',
    4,
    120,
    '{"D14","F12","C11","D11","G12","E5","G4","G5","E2","A16","D3","H1","E3","A12","G2","F9","A8"}'
  );
