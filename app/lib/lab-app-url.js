const LAB_APP_URL = {
  production: 'https://lab.zooniverse.org',
  other: 'https://master.lab-preview.zooniverse.org'
};

const env = process.env.NODE_ENV === 'production' ? 'production' : 'other';

export default LAB_APP_URL[env];
