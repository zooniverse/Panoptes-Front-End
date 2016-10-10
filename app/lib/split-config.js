import {Client} from 'seven-ten';
import apiClient from 'panoptes-client/lib/api-client';

export default Client.config = {
  host: 'http://localhost:3000',
  headers: apiClient.headers
};
