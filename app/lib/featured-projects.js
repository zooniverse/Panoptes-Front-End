const FEATURED_PROJECTS = {
  production: {
    60: {
      image: '/assets/featured-projects/60.jpg',
      title: 'Chimp & See'
    },
    21: {
      image: '/assets/featured-projects/21.jpg',
      title: 'Galaxy Zoo'
    },
    376: {
      image: '/assets/featured-projects/376.jpg',
      title: 'Shakespeare\'s World'
    },
    3098: {
      image: '/assets/featured-projects/26.jpg',
      title: 'Muon Hunter'
    }
  },
  other: {
    1731: {
      image: '/assets/featured-projects/60.jpg',
      title: 'Chimp & See'
    },
    1732: {
      image: '/assets/featured-projects/21.jpg',
      title: 'Galaxy Zoo'
    },
    1733: {
      image: '/assets/featured-projects/376.jpg',
      title: 'Shakespeare\'s World'
    },
    1734: {
      image: '/assets/featured-projects/3098.jpg',
      title: 'Muon Hunter'
    }
  }
};

const env = process.env.NODE_ENV === 'production' ? 'production' : 'other';

export default FEATURED_PROJECTS[env];
