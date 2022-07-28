import counterpart from 'counterpart';
import _ from 'lodash';

import isAdmin from '../is-admin';
import userHasLabAccess from './userHasLabAccess';
import { monorepoURL, usesMonorepo } from '../../monorepoUtils';

function getProjectLinks({ project, projectRoles, user }) {
  const { id, redirect, slug } = project;
  const searchParams = new URLSearchParams(window.location.search);
  const env = searchParams.get('env');
  const locale = counterpart.getLocale();
  const newSearchParams = new URLSearchParams();

  // For most projects, primary_language is en
  if (locale !== project.primary_language) {
    newSearchParams.set('language', locale);
  }

  if (env) {
    newSearchParams.set('env', env);
  }

  const query = `${newSearchParams}` ? `?${newSearchParams}` : '';

  const links = {
    about: {
      order: 0,
      url: `/projects/${slug}/about${query}`,
      translationPath: 'project.nav.about'
    },
    classify: {
      order: 1,
      url: `/projects/${slug}/classify${query}`,
      translationPath: 'project.nav.classify'
    },
    talk: {
      order: 2,
      url: `/projects/${slug}/talk${query}`,
      translationPath: 'project.nav.talk'
    },
    collections: {
      order: 3,
      url: `/projects/${slug}/collections${query}`,
      translationPath: 'project.nav.collections'
    },
    recents: {
      order: 4,
      url: `/projects/${slug}/recents${query}`,
      translationPath: 'project.nav.recents'
    },
    admin: {
      order: 5,
      url: `/admin/project_status/${slug}${query}`,
      translationPath: 'project.nav.adminPage'
    },
    lab: {
      order: 6,
      url: `/lab/${id}${query}`,
      translationPath: 'project.nav.lab'
    }
  };

  const canClassify = project.links.active_workflows && project.links.active_workflows.length > 0;

  if (usesMonorepo(slug)) {
    const i18nSlug = locale === 'en' ? slug : `${locale}/${slug}`;
    const envQuery = env === 'staging' ? '?env=staging' : '';
    links.about.url = `${monorepoURL(i18nSlug)}/about${envQuery}`;
    links.about.isMonorepoLink = true;
    links.classify.url = `${monorepoURL(i18nSlug)}/classify${envQuery}`;
    links.classify.isMonorepoLink = true;
  }

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
