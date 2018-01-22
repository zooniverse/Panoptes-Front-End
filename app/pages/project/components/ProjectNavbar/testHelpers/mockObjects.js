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

export const projectWithoutRedirect = {
  id: '2',
  slug: 'zooniverse/find-the-thing',
  title: 'Find the Thing',
  urls: [
    {
      label: '',
      path: 'findthething',
      site: 'facebook.com/',
      url: 'https://www.facebook.com/find-the-thing'
    }
  ]
};

export const projectWithRedirect = {
  id: '3',
  redirect: 'https://www.redirected-project.org',
  title: 'Find the Thing',
  urls: [
    {
      label: '',
      path: 'findthething',
      site: 'facebook.com/',
      url: 'https://www.facebook.com/find-the-thing'
    }
  ]
};

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
