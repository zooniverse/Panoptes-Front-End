import apiClient from 'panoptes-client/lib/api-client';

// Tune this value to determine when a search term is long enough to use Panoptes full-text search.
const MIN_SEARCH_LENGTH = 3;

function panoptesCollectionsSearch(text) {
  const query = {
    page_size: 100,
    favorite: false,
    current_user_roles: 'owner,collaborator,contributor'
  };
  if (text) {
    query.search = text;
  }
  return apiClient.type('collections').get(query);
}

export async function collectionsSearch(text = '') {
  const search = text.trim().toLowerCase();
  // Search terms of more than MIN_SEARCH_LENGTH characters can use Panoptes full-text search.
  if (search.length > MIN_SEARCH_LENGTH) {
    return panoptesCollectionsSearch(search);
  }
  // Otherwise, filter all your collection names by the search term.
  const allCollections = await panoptesCollectionsSearch();
  return allCollections.filter(
    collection => collection.display_name.toLowerCase().includes(search)
  );
}
