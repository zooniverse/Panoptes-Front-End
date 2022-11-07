import { cloneElement, useEffect, useState } from 'react'
import PropTypes from 'prop-types';

import { Link, IndexLink } from 'react-router';
import LoadingIndicator from '../../components/loading-indicator.jsx';
import { Helmet } from 'react-helmet';
import apiClient from 'panoptes-client/lib/api-client';
import counterpart from 'counterpart';
import isAdmin from '../../lib/is-admin.coffee';
import LabStatus from '../../partials/lab-status.jsx';
import { isThisProjectUsingFEMLab, FEM_LAB_PREVIEW_HOST } from '../lab-fem/fem-lab-utilities.js';

const DEFAULT_SUBJECT_SET_NAME = 'Untitled subject set'
const DELETE_CONFIRMATION_PHRASE = 'I AM DELETING THIS PROJECT'

counterpart.registerTranslations('en', {
  projectLab: {
    edit: 'Edit'
  }
});

function RenderError({
  error,
  info
}) {
  return (
    <div>
      <h1><code>{error.message}</code></h1>
      <p>{info?.componentStack && <pre>{info.componentStack}</pre>}</p>
    </div>
  )
}

function EditProjectPage({
  children,
  location,
  project,
  router,
  user
}) {
  const [deleteState, setDeleteState] = useState({
    deletionError: null,
    deletionInProgress: false
  });

  function labPath(pathname = '') {
    return `/lab/${project.id}${pathname}`;
  }

  function deleteProject() {
    setDeleteState(oldState => ({ ...oldState, deletionError: null }));
    const confirmPrompt = `You are about to delete this project and all its data!
    Enter ${DELETE_CONFIRMATION_PHRASE} to confirm.`;
    const confirmed = prompt(confirmPrompt) === DELETE_CONFIRMATION_PHRASE;

    if (confirmed) {
      setDeleteState(oldState => ({ ...oldState, deletionInProgress: true }));
      project.delete()
        .then(() => {
          router.push('/lab')
        })
        .catch(error => {
          setDeleteState(oldState => ({ ...oldState, deletionError: error }))
        })
        .then(() => {
          setDeleteState(oldState => ({ ...oldState, deletionInProgress: false }))
        });
    }
  }

  try {
    const thisProjectUsesFEM = isThisProjectUsingFEMLab(project, location);
    let projectLink = `/projects/${project.slug}`;
    if (thisProjectUsesFEM) {
      const env = process.env.NODE_ENV;
      if (env === 'production') {
        projectLink = `${FEM_LAB_PREVIEW_HOST}${projectLink}`;
      } else {
        projectLink = `${FEM_LAB_PREVIEW_HOST}${projectLink}?env=${env}`;
      }
    }

    const { pathname } = location
    return (
      <div className="columns-container content-container">
        <Helmet title={`${counterpart('projectLab.edit')} » ${project.display_name}`} />
        <nav aria-label="Lab navigation">
          <h2 className="nav-list-header">Project #{project.id}</h2>
          <ul className="nav-list">
            <li>
              <Link
                to={projectLink}
                className="standard-button view-project-button"
                target="_blank"
                title="Open the current project in a new tab."
              >
                View project
              </Link>
            </li>
            <li>
              <IndexLink
                aria-current={pathname === labPath() ? 'page' : undefined}
                to={labPath()}
                className="nav-list-item"
                title="Input the basic information about your project, and set up its home page."
              >
                Project details
              </IndexLink>
            </li>
            <li>
              <Link
                aria-current={pathname === labPath('/about/research') ? 'page' : undefined}
                to={labPath('/about/research')}
                className="nav-list-item"
                title="Enter content for Research, Results, FAQ and Education."
              >
                About
              </Link>
            </li>
            <li>
              <Link
                aria-current={pathname === labPath('/collaborators') ? 'page' : undefined}
                to={labPath('/collaborators')}
                className="nav-list-item"
                title="Add people to your team and specify what their roles are so that they have the right access to the tools they need (including access to the project while it’s private)."
              >
                Collaborators
              </Link>
            </li>
            <li>
              <Link
                aria-current={pathname === labPath('/guide') ? 'page' : undefined}
                to={labPath('/guide')}
                className="nav-list-item"
                title="Create a persistent guide that can be viewed within your project"
              >
                Field guide
              </Link>
            </li>
            <li>
              <Link
                aria-current={pathname === labPath('/tutorial') ? 'page' : undefined}
                to={labPath('/tutorial')}
                className="nav-list-item"
                title="Create a pop-up tutorial for your project’s classification interface"
              >
                Tutorial
              </Link>
            </li>
            {(project.experimental_tools.includes('mini-course')) &&
              <li>
                <Link
                  aria-current={pathname === labPath('/mini-course') ? 'page' : undefined}
                  to={labPath('/mini-course')}
                  className="nav-list-item"
                  title="Create a pop-up mini-course for your project’s classification interface"
                >
                  Mini-course
                </Link>
              </li>
            }
            <li>
              <Link
                aria-current={pathname === labPath('/media') ? 'page' : undefined}
                to={labPath('/media')}
                className="nav-list-item"
                title="Add any images you’d like to use in this project’s introduction, science case, results, FAQ, or education content pages."
              >
                Media
              </Link>
            </li>
            <li>
              <Link
                aria-current={pathname === labPath('/visibility') ? 'page' : undefined}
                to={labPath('/visibility')}
                className="nav-list-item"
                title="Decide whether your project is public and whether it's ready to go live."
              >
                Visibility
              </Link>
            </li>
            <li>
              <Link
                aria-current={pathname === labPath('/talk') ? 'page' : undefined}
                to={labPath('/talk')}
                className="nav-list-item"
                title="Setup project specific discussion boards"
              >
                Talk
              </Link>
            </li>
            <li>
              <Link
                aria-current={pathname === labPath('/data-exports') ? 'page' : undefined}
                to={labPath('/data-exports')}
                className="nav-list-item"
                title="Get your project's data exports"
              >
                Data Exports
              </Link>
            </li>
            <li>
              <Link
                aria-current={pathname === labPath('/workflows') ? 'page' : undefined}
                to={labPath('/workflows')}
                className="nav-list-item"
                title="View your project's workflows"
              >
                Workflows
              </Link>
            </li>
            <li>
              <Link
                aria-current={pathname === labPath('/subject-sets') ? 'page' : undefined}
                to={labPath('/subject-sets')}
                className="nav-list-item"
                title="View your project's subject sets"
              >
                Subject Sets
              </Link>
            </li>
            {(project.experimental_tools?.includes('translator-role') || isAdmin()) ?
              <li>
                <Link
                  aria-current={pathname === labPath('/translations') ? 'page' : undefined}
                  to={labPath('/translations')}
                  className="nav-list-item"
                  title="Preview your project's translations"
                >
                  Translations
                </Link>
              </li>
            : null}
            <li>
              <h2 className="nav-list-header">Need some help?</h2>
              <ul className="nav-list">
                <li>
                  <a className="nav-list-item" href="https://help.zooniverse.org" target="_blank" rel="noopener nofollow">Read a tutorial</a>
                </li>
                <li>
                  <Link to="/talk/18" className="nav-list-item">Ask for help on talk</Link>
                </li>
                <li>
                  <a href="https://help.zooniverse.org/getting-started/glossary" target="_blank" rel="noopener nofollow" className="nav-list-item">Glossary</a>
                </li>
              </ul>
            </li>
          </ul>

          <h2 className="nav-list-header">Other actions</h2>
          <p>
            <button
              type="button"
              className="minor-button"
              disabled={deleteState.deletionInProgress}
              onClick={deleteProject}
            >
              <small>Delete this project</small>
              <LoadingIndicator off={!deleteState.deletionInProgress} />
            </button>
          </p>
          {deleteState.deletionError &&
            <p className="form-help error">{deleteState.deletionError.message}</p>
          }
        </nav>

        <hr />

        <main className="column">
          <LabStatus />
          {cloneElement(children, { project, user })}
        </main>
      </div>
    );
  } catch (error) {
    return <RenderError error={error} />;
  }
}

export default function EditProjectPageWrapper({
  children,
  params,
  router,
  user,
  ...props
}) {
  const [loading, setLoading] = useState(false)
  const [owners, setOwners] = useState([]);
  const [project, setProject] = useState(null);
  const [payload, setPayload] = useState([])

  // this replaces the old ChangeHandler component
  useEffect(function watchProject() {
    function onProjectChange(...payload) {
      setPayload(payload);
    }
    project?.listen('change', onProjectChange);
    return () => {
      project?.stopListening('change', onProjectChange);
    }
  }, [project]);

  useEffect(function fetchProject() {
    if (user) {
      setLoading(true)
      apiClient.type('projects')
        .get(params.projectID)
        .catch(() => null)
        .then(setProject)
        .then(() => {
          setLoading(false)
        });
    }
  }, [params.projectID, user]);

  useEffect(function fetchOwners() {
    if (project && user) {
      setLoading(true)
      project?.get('project_roles', { user_id: user.id })
        .catch(() => [])
        .then(projectRoles => {
          const ownerRoles = projectRoles.filter(({ roles }) => roles.includes('owner') || roles.includes('collaborator'));
          const awaitOwners = ownerRoles.map(ownerRole => ownerRole.get('owner'));
          return Promise.all(awaitOwners)
        })
        .then(setOwners)
        .then(() => {
          setLoading(false)
        });
    }
  }, [project, user]);

  try {
    // Not logged in
    if (!user) {
      return (
        <div className="content-container">
          <p>You need to be signed in to use the lab.</p>
        </div>
      );
    }

    // still loading
    if (loading) {
      return (
        <div className="content-container">
          <p className="form-help">Loading project</p>
        </div>
      );
    }

    // project owner
    if (owners.includes(user) || isAdmin()) {
      return (
        <EditProjectPage {...props} project={project} router={router} user={user}>
          {children}
        </EditProjectPage>
      );
    }

    // logged in but not the owner
    return (
      <div className="content-container">
        <p>You don’t have permission to edit this project.</p>
      </div>
    );
  } catch (error) {
    return(
      <div className="content-container">
        <p className="form-help error">{error.toString()}</p>
      </div>
    );
  }
}
