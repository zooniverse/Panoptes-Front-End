import apiClient from 'panoptes-client/lib/api-client';

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
  // Search terms of more than 4 characters can use Panoptes full-text search.
  if (search.length > 3) {
    return panoptesCollectionsSearch(search);
  }
  // Otherwise, filter your collection names by the search term.
  const allCollections = await panoptesCollectionsSearch();
  return allCollections.filter(
    collection => collection.display_name.toLowerCase().includes(search)
  );
}
