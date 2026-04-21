export const projectOwnerRole = {
  id: '52',
  links: {
    owner: { id: '4' }
  },
  roles: ['owner']
};

export const projectCollabRole = {
  id: '93',
  links: {
    owner: { id: '5' }
  },
  roles: ['collaborator']
};

export const projectRoles = [projectOwnerRole, projectCollabRole];

export const projectOwnerUser = { id: '4' };

export const projectCollabUser = { id: '5' };

export const randomUser = { id: '10' };

export const adminUser = { id: '36', admin: true };

export const socialMediaUrl = {
  label: '',
  path: 'findthething',
  site: 'facebook.com/',
  url: 'https://www.facebook.com/find-the-thing'
};

export const externalUrl = {
  label: 'My Blog',
  site: '',
  url: 'https://my-blog.com'
};

export const projectWithoutRedirect = {
  id: '2',
  slug: 'zooniverse/find-the-thing',
  title: 'Find the Thing',
  urls: [socialMediaUrl, externalUrl],
  links: {
    active_workflows: ['35']
  },
  workflow_description: ''
};

export const projectWithRedirect = {
  id: '3',
  redirect: 'https://www.redirected-project.org',
  title: 'Find the Thing',
  urls: [socialMediaUrl, externalUrl],
  links: {
    active_workflows: ['35']
  },
  workflow_description: ''
};

// As of 2026, any project that's not listed in the PFE_SLUGS exception list
// (see app/slugList.js) is counted as an FEM project. 
export const femProjectWithOneActiveWorkflow = {
  id: '101',
  slug: 'zooniverse/pet-the-cat',
  title: 'Pet the Cat',
  urls: [socialMediaUrl, externalUrl],
  links: {
    active_workflows: ['1011']
  },
  workflow_description: ''
}

export const femProjectWithThreeActiveWorkflows = {
  id: '102',
  slug: 'zooniverse/high-five-dogs',
  title: 'High Five Dogs',
  urls: [socialMediaUrl, externalUrl],
  links: {
    active_workflows: ['1021', '1022', '1023']
  },
  workflow_description: ''
}

export const femProjectWithNoActiveWorkflows = {
  id: '103',
  slug: 'zooniverse/stare-at-fish',
  title: 'Stare at Fish',
  urls: [socialMediaUrl, externalUrl],
  links: {
    active_workflows: []
  },
  workflow_description: ''
}

export const workflow = { id: '35' };

export const background = {
  src: 'background.jpg'
};

export const organization = {
  display_name: 'My Organization',
  slug: 'zooniverse/my-organization'
};

export const projectAvatar = {
  src: 'avatar.jpg'
};

export const translation = {
  display_name: 'translated display name'
};

export const externalLinks = [
  {
    isExternalLink: true,
    isSocialLink: true,
    ...socialMediaUrl
  },
  {
    isExternalLink: true,
    isSocialLink: true,
    ...externalUrl
  }
];
