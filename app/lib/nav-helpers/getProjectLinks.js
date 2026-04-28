import counterpart from 'counterpart';
import _ from 'lodash';

import isAdmin from '../is-admin';
import userHasLabAccess from './userHasLabAccess';
import { monorepoURL, usesPFEClassifier } from '../../monorepoUtils';

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

  /*
    Unless a project is whitelisted to stay on PFE's classifier, the link to a project's homepage
    about pages, or classify page should go to FEM which expects locale to formatted as
    /projects/locale/owner/projectName
  */
  if (!usesPFEClassifier(slug)) {
    const i18nSlug = locale === 'en' ? slug : `${locale}/${slug}`;
    const envQuery = env === 'staging' ? '?env=staging' : '';

    // About Link
    links.about.url = `${monorepoURL(i18nSlug)}/about${envQuery}`;
    links.about.isMonorepoLink = true;

    // Classify Link
    // - If a Project has exactly 1 active workflow, link to that workflow. 
    // - Otherwise, link to the root /classify path.
    // (2026.04.21) For more info, look in FEM for...
    // - ...how the Classify link in the project nav changes if there's a "default workflow": https://github.com/zooniverse/front-end-monorepo/blob/045dd3c/packages/app-project/src/components/ProjectHeader/hooks/useProjectNavigation.js#L9
    // - ...how a "default workflow" in FEM just means "only one active workflow": https://github.com/zooniverse/front-end-monorepo/blob/045dd3c/packages/app-project/stores/Project.js#L41
    const projectHasExactlyOneWorkflow = project?.links?.active_workflows?.length === 1;
    const classifyLinkUrl = (projectHasExactlyOneWorkflow)
      ? `${monorepoURL(i18nSlug)}/classify/workflow/${project.links.active_workflows[0]}${envQuery}`
      : `${monorepoURL(i18nSlug)}/classify${envQuery}`;
    links.classify.url = classifyLinkUrl;
    links.classify.isMonorepoLink = true;
  }

  // For projects with external front ends (excluding FEM)
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
