import apiClient from 'panoptes-client/lib/api-client';

export default async function createSubjectSet(snapshot) {
  return apiClient.type('subject_sets')
    .create(snapshot)
    .save();
}
