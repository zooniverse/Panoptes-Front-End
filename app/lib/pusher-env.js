import locationMatch from './location-match';

const pusherID = {
  // production: '79e8e05ea522377ba6db',
  staging: '95781402b5854a712a03',
  development: '95781402b5854a712a03',
};

const envFromBrowser = locationMatch(/\W?env=(\w+)/);
const envFromShell = process.env.NODE_ENV;
const DEFAULT_ENV = 'staging';
const env = envFromBrowser || envFromShell || DEFAULT_ENV;

export default pusherID[env];
