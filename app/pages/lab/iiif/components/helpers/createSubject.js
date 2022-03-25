import apiClient from 'panoptes-client/lib/api-client';

export default async function createSubject(snapshot) {
  return apiClient.type('subjects')
    .create(snapshot)
    .save();
}
