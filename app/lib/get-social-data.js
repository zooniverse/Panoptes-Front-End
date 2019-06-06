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

function getBlogPosts(returnPosts) {
  const request = new XMLHttpRequest();
  request.open('GET', `${talkClient.root}/social`, true);
  request.onload = () => {
    const data = JSON.parse(request.responseText);
    returnPosts(data.posts);
  };
  request.send();
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

function getPublication() {
  const articles = [];
  Object.keys(Publications).forEach((category) => {
    Publications[category].map(project => articles.push(...project.publications));
  });
  const newestPublication = articles.sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  }).shift();
  return newestPublication;
}

export { getPublication, getRecentProjects, getBlogPosts, getNewestProject };
