import locationMatch from './location-match';

const PROMOTED_PROJECTS = {
  production: {
    1104: {
      image: '/assets/featured-projects/1104.jpg',
      title: 'Gravity Spy'
    },
    3063: {
      image: '/assets/featured-projects/3063.jpg',
      title: 'Bash the Bug'
    },
    4973: {
      image: '/assets/featured-projects/4973.jpg',
      title: 'Antislavery Manuscripts'
    },
    6263: {
      image: '/assets/featured-projects/6263.jpg',
      title: 'Penguin Watch'
    }
  },
  other: {
    1731: {
      image: '/assets/featured-projects/1104.jpg',
      title: 'Gravity Spy'
    },
    1732: {
      image: '/assets/featured-projects/3063.jpg',
      title: 'Bash the Bug'
    },
    1733: {
      image: '/assets/featured-projects/4973.jpg',
      title: 'Antislavery Manuscripts'
    },
    1734: {
      image: '/assets/featured-projects/6263.jpg',
      title: 'Penguin Watch'
    }
  }
};

const envFromBrowser = locationMatch(/\W?env=(\w+)/);
const envFromShell = process.env.NODE_ENV;
const env = envFromBrowser || envFromShell === 'production' ? 'production' : 'other';

export default PROMOTED_PROJECTS[env];
