import apiClient from 'panoptes-client/lib/api-client';
import talkClient from 'panoptes-client/lib/talk-client';
import Publications from './publications';

const BLOG_FEEDS = [
  // daily.zooniverse.org
  'https://public-api.wordpress.com/rest/v1.1/sites/57182749/posts',
  // blog.zooniverse.org
  'https://public-api.wordpress.com/rest/v1.1/sites/36711287/posts'
]

function removeEntities(htmlString) {
  const container = document.createElement('div');
  container.innerHTML = htmlString;
  return container.textContent;
}

function parseFeedPost(post) {
  return {
    id: post.ID,
    title: removeEntities(post.title),
    excerpt: removeEntities(post.excerpt),
    created_at: post.date,
    link: post.URL,
    image: post.featured_image
  };
}
async function fetchBlogFeed(url) {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const feed = await response.json();
      return feed.posts;
    }
    return [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

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
    const feeds = await Promise.all(BLOG_FEEDS.map(fetchBlogFeed));
    feeds.forEach(feed => {
      posts = posts.concat(feed.slice(0,3))
    });
    return posts.map(parseFeedPost);
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
