import { Book, Review, ReadingStats, ReadingChallenge } from './types';

export const mockBooks: Book[] = [
  {
    id: '1',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    coverImage: 'https://m.media-amazon.com/images/I/81tCtHFtOgL._AC_UF1000,1000_QL80_.jpg',
    description: 'Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived. To see how things would be if you had made other choices... Would you have done anything different, if you had the chance to undo your regrets?',
    genre: 'Fiction, Fantasy',
    pageCount: 304,
    progress: {
      currentPage: 156,
      percentage: 51
    },
    status: 'currently-reading',
    isFavorite: false,
    dateAdded: '2023-05-15',
    lastUpdated: '2023-06-02T14:35:00Z'
  },
  {
    id: '2',
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    coverImage: 'https://m.media-amazon.com/images/I/91vS2L5YfEL._SX342_.jpg',
    description: "Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the Earth itself will perish. Except that right now, he doesn't know that. He can't even remember his own name, let alone the nature of his assignment or how to complete it. All he knows is that he's been asleep for a very, very long time. And he's just been awakened to find himself millions of miles from home, with nothing but two corpses for company.",
    genre: 'Science Fiction',
    pageCount: 496,
    progress: {
      currentPage: 89,
      percentage: 18
    },
    status: 'currently-reading',
    isFavorite: true,
    dateAdded: '2023-04-21',
    lastUpdated: '2023-05-28T09:12:00Z'
  },
  {
    id: '3',
    title: 'Atomic Habits',
    author: 'James Clear',
    coverImage: 'https://m.media-amazon.com/images/I/81wgcld4wxL._AC_UF1000,1000_QL80_.jpg',
    description: "No matter your goals, Atomic Habits offers a proven framework for improving--every day. James Clear, one of the world's leading experts on habit formation, reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.",
    genre: 'Self-Help',
    pageCount: 320,
    progress: {
      currentPage: 215,
      percentage: 67
    },
    status: 'currently-reading',
    isFavorite: false,
    dateAdded: '2023-05-01',
    lastUpdated: '2023-06-01T18:45:00Z'
  },
  {
    id: '4',
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    coverImage: 'https://m.media-amazon.com/images/I/51Z0nLAfLmL.jpg',
    description: 'Paulo Coelho\'s enchanting novel has inspired a devoted following around the world. This story, dazzling in its powerful simplicity and soul-stirring wisdom, is about an Andalusian shepherd boy named Santiago, who travels from his homeland in Spain to the Egyptian desert in search of a treasure buried near the Pyramids.',
    genre: 'Fiction',
    pageCount: 208,
    status: 'completed',
    rating: 5,
    isFavorite: false,
    dateAdded: '2023-03-10',
    startedReading: '2023-05-20',
    finishedReading: '2023-05-31',
    lastUpdated: '2023-05-31T20:15:00Z'
  },
  {
    id: '5',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    coverImage: 'https://m.media-amazon.com/images/I/81tPEe0egBL._SL1500_.jpg',
    description: '100,000 years ago, at least six human species inhabited the earth. Today there is just one. Us. Homo sapiens. How did our species succeed in the battle for dominance? Why did our foraging ancestors come together to create cities and kingdoms?',
    genre: 'Non-Fiction',
    pageCount: 464,
    status: 'completed',
    rating: 5,
    isFavorite: false,
    dateAdded: '2023-02-15',
    startedReading: '2023-03-01',
    finishedReading: '2023-04-10',
    lastUpdated: '2023-04-10T13:25:00Z'
  },
  {
    id: '6',
    title: 'Educated',
    author: 'Tara Westover',
    coverImage: 'https://m.media-amazon.com/images/I/81NwOj14S6L._AC_UF1000,1000_QL80_.jpg',
    description: 'Born to survivalists in the mountains of Idaho, Tara Westover was seventeen the first time she set foot in a classroom. Her family was so isolated from mainstream society that there was no one to ensure the children received an education, and no one to intervene when one of Tara\'s older brothers became violent.',
    genre: 'Memoir',
    pageCount: 334,
    status: 'want-to-read',
    isFavorite: false,
    dateAdded: '2023-05-25',
    lastUpdated: '2023-05-25T10:40:00Z'
  },
  {
    id: '7',
    title: 'Tomorrow, and Tomorrow, and Tomorrow',
    author: 'Gabrielle Zevin',
    coverImage: 'https://m.media-amazon.com/images/I/91Lu2eTVdWL._SX342_.jpg',
    description: 'On a bitter-cold day, in the December of his junior year at Harvard, Sam Masur exits a subway car and sees, amid the hordes of people waiting on the platform, Sadie Green. He calls her name. For the next two decades, their lives will be braided together by ambition, love, betrayal, and the kind of creativity that only comes from two people pushing each other to care more, be more, do more.',
    genre: 'Fiction',
    pageCount: 416,
    status: 'want-to-read',
    isFavorite: false,
    dateAdded: '2023-05-30',
    lastUpdated: '2023-05-30T15:20:00Z'
  },
  {
    id: '8',
    title: 'The Lincoln Highway',
    author: 'Amor Towles',
    coverImage: 'https://m.media-amazon.com/images/I/81CtC8UNeIL._SX342_.jpg',
    description: 'In June, 1954, eighteen-year-old Emmett Watson is driven home to Nebraska by the warden of the juvenile work farm where he has just served fifteen months for involuntary manslaughter. His mother long gone, his father recently deceased, and the family farm foreclosed upon by the bank, Emmett\'s intention is to pick up his eight-year-old brother, Billy, and head to California where they can start their lives anew.',
    genre: 'Historical Fiction',
    pageCount: 592,
    status: 'want-to-read',
    isFavorite: false,
    dateAdded: '2023-05-23',
    lastUpdated: '2023-05-23T11:50:00Z'
  },
  {
    id: '9',
    title: 'Cloud Cuckoo Land',
    author: 'Anthony Doerr',
    coverImage: 'https://m.media-amazon.com/images/I/91IV2caBbpL._SX342_.jpg',
    description: 'The heroes of Cloud Cuckoo Land are trying to figure out the world around them: Anna and Omeir, on opposite sides of the formidable city walls during the 1453 siege of Constantinople; teenage idealist Seymour in an attack on a public library in present day Idaho; and Konstance, on an interstellar ship bound for an exoplanet, decades from now.',
    genre: 'Literary Fiction',
    pageCount: 656,
    status: 'want-to-read',
    isFavorite: false,
    dateAdded: '2023-05-16',
    lastUpdated: '2023-05-16T09:10:00Z'
  },
  {
    id: '10',
    title: 'Sea of Tranquility',
    author: 'Emily St. John Mandel',
    coverImage: 'https://m.media-amazon.com/images/I/51-aB6gtJZL._SY445_SX342_.jpg',
    description: 'Edwin St. Andrew is eighteen years old when he crosses the Atlantic by steamship, exiled from polite society following an ill-conceived diatribe at a dinner party. He enters the forest, spellbound by the beauty of the Canadian wilderness, and suddenly hears the notes of a violin echoing in an airship terminal—an experience that shocks him to his core.',
    genre: 'Science Fiction',
    pageCount: 272,
    status: 'want-to-read',
    isFavorite: false,
    dateAdded: '2023-05-09',
    lastUpdated: '2023-05-09T14:30:00Z'
  },
  {
    id: '11',
    title: 'Klara and the Sun',
    author: 'Kazuo Ishiguro',
    coverImage: 'https://m.media-amazon.com/images/I/71jAx4kY9BL._SL1500_.jpg',
    description: 'From her place in the store, Klara, an Artificial Friend with outstanding observational qualities, watches carefully the behavior of those who come in to browse, and of those who pass on the street outside. She remains hopeful that a customer will soon choose her, but when the possibility emerges that her circumstances may change forever, Klara is warned not to invest too much in the promises of humans.',
    genre: 'Science Fiction',
    pageCount: 303,
    progress: {
      currentPage: 45,
      percentage: 15
    },
    status: 'currently-reading',
    isFavorite: false,
    dateAdded: '2023-04-05',
    lastUpdated: '2023-05-27T16:40:00Z'
  },
];

export const mockReviews: Review[] = [
  {
    id: '1',
    bookId: '4',
    title: 'Thought-provoking and inspiring',
    content: 'This book blew me away. The perfect blend of philosophy and storytelling. I couldn\'t put it down and finished it in just two days.',
    rating: 5,
    dateStarted: '2023-05-20',
    dateFinished: '2023-05-31',
    isPublic: true,
    isFavorite: true,
    createdAt: '2023-05-31T20:30:00Z'
  },
  {
    id: '2',
    bookId: '5',
    title: 'Mind-expanding history of humankind',
    content: 'A brilliant overview of human history that challenges many assumptions. Harari has a gift for making complex concepts accessible and thought-provoking.',
    rating: 5,
    dateStarted: '2023-03-01',
    dateFinished: '2023-04-10',
    isPublic: true,
    isFavorite: false,
    createdAt: '2023-04-10T14:15:00Z'
  },
  {
    id: '3',
    bookId: '2',
    title: 'Brilliant sci-fi with heart',
    content: 'This book completely blew me away. The perfect blend of hard science and emotional storytelling. The protagonist is incredibly likable, and the way the story unfolds through present action and recovered memories is masterfully done. I couldn\'t put it down and finished it in just two days. Easily one of the best sci-fi novels I\'ve read in years.',
    rating: 5,
    dateStarted: '2023-04-27',
    dateFinished: '2023-05-04',
    isPublic: true,
    isFavorite: true,
    createdAt: '2023-05-04T19:45:00Z'
  }
];

export const mockReadingStats: ReadingStats = {
  booksRead: 12,
  totalPages: 3756,
  readingTime: 186,
  currentStreak: 3,
  averageRating: 4.2
};

export const mockReadingChallenge: ReadingChallenge = {
  id: '1',
  name: '2023 Reading Challenge',
  target: 30,
  current: 14,
  percentage: 47
};

export const getDiscoverBooks = () => {
  return [
    {
      id: '101',
      title: 'The Invisible Life of Addie LaRue',
      author: 'V.E. Schwab',
      coverImage: 'https://m.media-amazon.com/images/I/71ffkGYJyrL._SL1417_.jpg',
      genre: 'Fantasy'
    },
    {
      id: '102',
      title: 'The Four Winds',
      author: 'Kristin Hannah',
      coverImage: 'https://m.media-amazon.com/images/I/91JhiXPlJiL._SL1500_.jpg',
      genre: 'Historical Fiction'
    },
    {
      id: '103',
      title: 'The Martian',
      author: 'Andy Weir',
      coverImage: 'https://m.media-amazon.com/images/I/81wFMY9OAFL._AC_UF1000,1000_QL80_.jpg',
      genre: 'Science Fiction'
    },
    {
      id: '104',
      title: 'Dune',
      author: 'Frank Herbert',
      coverImage: 'https://m.media-amazon.com/images/I/71-1WBgjGoL._SL1500_.jpg',
      genre: 'Science Fiction'
    },
    {
      id: '105',
      title: 'The Three-Body Problem',
      author: 'Liu Cixin',
      coverImage: 'https://m.media-amazon.com/images/I/910ap6L7TXL._SL1500_.jpg',
      genre: 'Science Fiction'
    }
  ];
};

export const getPopularGenres = () => {
  return [
    { name: 'Fiction', count: 1245 },
    { name: 'Science Fiction', count: 876 },
    { name: 'Self-Help', count: 654 },
    { name: 'History', count: 932 },
    { name: 'Romance', count: 1087 }
  ];
};

export const getRecentActivity = () => {
  return [
    { id: '1', type: 'finished', book: 'The Alchemist', date: 'Yesterday at 8:45 PM' },
    { id: '2', type: 'started', book: 'Project Hail Mary', date: '2 days ago' },
    { id: '3', type: 'added', book: 'Educated', shelf: 'Want to Read', date: '3 days ago' },
    { id: '4', type: 'rated', book: 'Sapiens', rating: 5, date: 'Last week' }
  ];
};
