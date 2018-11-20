import _ from 'lodash';

import isAdmin from '../is-admin';
import userHasLabAccess from './userHasLabAccess';

function getProjectLinks({ project, projectRoles, user }) {
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

  const canClassify = project.links.active_workflows && project.links.active_workflows.length > 0;

  // For projects with external front ends
  if (redirect) {
    const redirectUrl = `${redirect.replace(/\/+$/, '')}/classify`;
    links.classify.url = redirectUrl;
    links.classify.isExternalLink = true;
    _.unset(links, 'about');
  }

  if (!canClassify) {
    links.classify.disabled = true;
  }

  if (!user) {
    _.unset(links, 'recents');
  }

  if (!isAdmin() || !user) {
    _.unset(links, 'admin');
  }

  if (!user || !userHasLabAccess({ projectRoles, user })) {
    _.unset(links, 'lab');
  }

  return links;
}

export default getProjectLinks;
