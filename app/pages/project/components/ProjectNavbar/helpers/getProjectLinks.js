import _ from 'lodash';

import isAdmin from '../../../../../lib/is-admin';
import userHasLabAccess from './userHasLabAccess';

function getProjectLinks({ project, projectRoles, workflow, user }) {
  const { id, redirect, slug } = project;

  const links = {
    about: {
      order: 0,
      url: `/projects/${slug}/about`,
      translationPath: 'project.nav.about'
    },
    classify: {
      order: 1,
      url: `/projects/${slug}/classify`,
      translationPath: 'project.nav.classify'
    },
    talk: {
      order: 2,
      url: `/projects/${slug}/talk`,
      translationPath: 'project.nav.talk'
    },
    collections: {
      order: 3,
      url: `/projects/${slug}/collections`,
      translationPath: 'project.nav.collections'
    },
    recents: {
      order: 4,
      url: `/projects/${slug}/recents`,
      translationPath: 'project.nav.recents'
    },
    admin: {
      order: 5,
      url: `/admin/project_status/${slug}`,
      translationPath: 'project.nav.adminPage'
    },
    lab: {
      order: 6,
      url: `/lab/${id}`,
      translationPath: 'project.nav.lab'
    }
  };

  // For projects with external front ends
  if (redirect) {
    const newUrl = redirect.replace(/\/?#?\/+$/, '');
    links.classify.url = `${newUrl}/#/classify`;
    links.classify.isExternalLink = true;
    _.unset(links, 'about');
  }

  if (!redirect && !workflow) {
    _.unset(links, 'classify');
  }

  if (!user) {
    _.unset(links, 'recents');
  }

  if (!isAdmin) {
    _.unset(links, 'admin');
  }

  if (!user || !userHasLabAccess({ projectRoles, user })) {
    _.unset(links, 'lab');
  }

  return links;
}

export default getProjectLinks;
