import { Client } from 'seven-ten';
import apiClient from 'panoptes-client/lib/api-client';
import locationMatch from './location-match';

if (process.env.NODE_ENV === 'production' || locationMatch(/\W?env=(production)/)) {
  Client.config = {
    host: 'https://seven-ten.zooniverse.org',
    headers: apiClient.headers
  };
} else {
  Client.config = {
    host: 'https://seven-ten-staging.zooniverse.org',
    headers: apiClient.headers
  };
}

export default Client.config;
