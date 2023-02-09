import apiClient from 'panoptes-client/lib/api-client';
import talkClient from 'panoptes-client/lib/talk-client';
import Publications from './publications';

function getNewestProject() {
  return apiClient.type('projects').get({
    cards: true,
    launch_approved: true,
    page_size: 1,
    sort: '-launch_date',
    state: 'live'
  })
    .then(([newestProject]) => {
      return newestProject;
    });
}

async function getBlogPosts() {
  let posts = []
  try {
    const response = await fetch(`${talkClient.root}/social`);
    if (response.ok) {
      const data = await response.json();
      posts = data.posts;
    }
  } catch (error) {
    console.error(error);
  }
  return posts;
}

function getRecentProjects() {
  const query = {
    cards: true,
    launch_approved: true,
    page_size: 3,
    sort: '-updated_at',
    state: 'live'
  };
  return apiClient.type('projects').get(query)
    .then(recentProjects => recentProjects);
}

export { getRecentProjects, getBlogPosts, getNewestProject };
