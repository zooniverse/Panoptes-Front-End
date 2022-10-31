import { useEffect, useRef, useState } from 'react'
import apiClient from 'panoptes-client/lib/api-client'
import talkClient from 'panoptes-client/lib/talk-client'

import UserSearch from '../../components/user-search.cjsx'
import projectSection from '../../talk/lib/project-section.coffee'
import isAdmin from '../../lib/is-admin.coffee'
import getAllLinked from '../../lib/get-all-linked.js'

const ID_PREFIX = 'LAB_COLLABORATORS_PAGE_';

const POSSIBLE_ROLES = {
  collaborator: 'admin',
  expert: 'team',
  scientist: 'scientist',
  moderator: 'moderator',
  tester: 'team'
};

/*
NOTE: Panoptes API and Talk API keep track of user roles separately; Panoptes can accept arbitrary role values, but Talk API can't.
The key-value pairs of POSSIBLE_ROLES maps the roles on Panoptes API (key) to the 'comparable' roles on Talk API.
*/

const ROLES_INFO = {
  collaborator: {
    label: 'Collaborator',
    description: 'Collaborators have full access to edit workflows and project content, including deleting some or all of the project.'
  },
  expert: {
    label: 'Expert',
    description: 'Experts can enter "gold mode" to make authoritative gold standard classifications that will be used to validate data quality.'
  },
  scientist: {
    label: 'Researcher',
    description: 'Members of the research team will be marked as researchers on "Talk"'
  },
  moderator: {
    label: 'Moderator',
    description: 'Moderators have extra privileges in the community discussion area to moderate discussions. They will also be marked as moderators on "Talk".'
  },
  tester: {
    label: 'Tester',
    description: 'Testers can view and classify on your project to give feedback while it’s still private. If given the direct url, they can also view and classify on inactive workflows; this is useful for already launched projects that are planning on building a new workflow and woud like volunteer feedback. Testers cannot access the project builder.'
  },
  translator: {
    label: 'Translator',
    description: 'Translators will have access to the translation site.'
  },
  museum: {
    label: 'Museum',
    description: 'Enables a custom interface for the project on the Zooniverse iPad app, specifically designed to be used in a museum or exhibit space.'
  }
};
  
    
const ROLES_NOT_IN_TALK_API = [
  'museum'
];


function CollaboratorCreator({
  onAdd,
  possibleRoles = POSSIBLE_ROLES,
  project = null
}) {
  const rolesTable = useRef();
  const userSearch = useRef();
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);
  let style;

  if (creating) {
    style = {
      opacity: 0.5,
      pointerEvents: 'none'
    };
  }

  function handleSubmit(event) {
    event.preventDefault();
    const checkboxes = rolesTable.current?.querySelectorAll('[name="role"]');
    const users = userSearch.current?.value().map(option => parseInt(option.value));
    let roles = [];
    checkboxes.forEach(checkbox => {
      if (checkbox.checked) {
        roles.push(checkbox.value);
      }
    });
    let talkRoles = [];
    Object.entries(possibleRoles).forEach(([role, talkRole]) => {
      if (roles.includes(role) && !ROLES_NOT_IN_TALK_API.includes(role)) {
        talkRoles.push(talkRole);
      }
    });
    talkRoles = talkRoles.reduce((memo, role) => {
      if (!memo.includes(role)) {
        memo.push(role);
      }
      return memo;
    }, []);

    setError(null);
    setCreating(true);

    const newRoles = users.reduce((memo, id) => {
      const newRoleSet = apiClient.type('project_roles').create({
        roles,
        links: {
          project: project.id,
          user: id
        }
      });
      const newTalkRoleSets = talkRoles.map(role => talkClient.type('roles').create({
        name: role,
        section: projectSection(project),
        user_id: id
      }));
      return memo.concat([newRoleSet]).concat(newTalkRoleSets);
    }, []);

    Promise.all(newRoles.map(roleSet => roleSet.save()))
      .then((savedRoles) => {
        userSearch.current?.clear();
        checkboxes.forEach(checkbox => checkbox.checked = false);
        onAdd();
      })
      .catch(error => {
        if (error.message.match(/not allowed to create this role/i)) {
          error.message = 'Your account status on this project is still being setup. Please try again later.';
        }
        setError(error)
      })
      .then(() => {
        setCreating(false)
      });
  }

  return(
    <div>
      {error &&
        <p className="form-help error">{error.toString()}</p>
      }
      <form style={style}>
        <div>
          <UserSearch ref={userSearch} />
        </div>

        <table ref={rolesTable} className="standard-table">
          <tbody>
            {Object.entries(possibleRoles).map(([role, label]) => (
              <tr key={role + '-' + label}>
                <td><input id={ID_PREFIX + role} type="checkbox" name="role" value={role} disabled={role === 'owner'}/></td>
                <td><strong><label htmlFor={ID_PREFIX + role}>{ROLES_INFO[role].label}</label></strong></td>
                <td>{ROLES_INFO[role].description}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p>
          <button type="submit" className="major-button" onClick={handleSubmit}>Add user role</button>
        </p>
      </form>
    </div>
  );
}

function UserRow({
  disabled = false,
  onDelete,
  onToggle,
  possibleRoles = POSSIBLE_ROLES,
  projectRoleSet
}) {
  const [user, setUser] = useState(null);
  useEffect(function loadOwner() {
    projectRoleSet.get('owner')
    .then(owner => setUser(owner));
  }, [projectRoleSet])

  return (
    <p>
      <strong>{user?.display_name}</strong>{' '}
      <button type="button" className="secret-button" onClick={onDelete}>&times;</button>
      <br />

      <span className="columns-container inline">
        {Object.keys(possibleRoles).map(role => {
          const toggleThisRole = () => onToggle(role);
          return (
            <label key={role}>
              <input
              type="checkbox"
              name={role}
              checked={projectRoleSet.roles.includes(role)}
              disabled={role === 'owner' || disabled}
              onChange={toggleThisRole}
            />{' '}
              {ROLES_INFO[role].label}
            </label>
          )
        })}
      </span>
    </p>
  );
}

export default function EditProjectCollaborators({
  possibleRoles = POSSIBLE_ROLES,
  project = null,
  user
}) {
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState([]);
  const [projectOwner, setProjectOwner] = useState(null);
  const [projectRoleSets, setProjectRoleSets] = useState([]);

  if (project?.experimental_tools.includes('translator-role') || isAdmin()) {
    possibleRoles = {
      ...possibleRoles,
      translator: 'translator'
    };
  }
  if (project?.experimental_tools.includes('museum-role') || isAdmin()) {
    possibleRoles = {
      ...possibleRoles,
      museum: 'museum'
    };
  }

  function fetchProjectRoles() {
    const section = projectSection(project);
    Promise.all([
      getAllLinked(project, 'project_roles'),
      talkClient.type('roles').get({ section, page_size: 100 })
    ])
    .then(([panoptesRoles, talkRoles]) => {
      return panoptesRoles.map(roleSet => {
        if (roleSet.links.owner.type === 'users') {
          roleSet['talk_roles'] = talkRoles.filter((role) => role.links.user === roleSet.links.owner.id);
        }
        return roleSet;
      });
    })
    .then(roleSets => setProjectRoleSets(roleSets));
  }

  useEffect(function fetchOwner() {
    project.get('owner')
      .then(owner => {
        setProjectOwner(owner);
      })
  }, [project]);

  useEffect(function onProjectChange() {
    fetchProjectRoles();
  }, [project]);

  function toggleRole(projectRoleSet, role) {
    const index = projectRoleSet.roles.indexOf(role);
    setSaving(saving => [...saving, projectRoleSet.id]);
    setError(null);

    let talkRoleAction;
    if (index === -1) {
      projectRoleSet.roles.push(role);
      if (!ROLES_NOT_IN_TALK_API.includes(role)) {
        talkRoleAction = talkClient.type('roles')
        .create({
          user_id: parseInt(projectRoleSet.links.owner.id),
          section: projectSection(project),
          name: possibleRoles[role]
        })
        .save();
      }
    } else {
      projectRoleSet.roles.splice(index, 1);
      const filteredRoles = projectRoleSet.talk_roles.filter(talkRole => talkRole === possibleRoles[role]);
      filteredRoles[0]?.delete()
    }

    Promise.all([projectRoleSet.update('roles').save(), talkRoleAction])
      .catch(error => setError(error))
      .then(() => {
        const savingIndex = saving.indexOf(projectRoleSet.id);
        setSaving(saving.splice(savingIndex, 1));
      });
  }

  function removeRoleSet(projectRoleSet) {
    setSaving([...saving, projectRoleSet.id]);
    setError(null);

    Promise.all([
      projectRoleSet.delete(),
      ...projectRoleSet.talk_roles.map(talkRole => talkRole.delete())
    ])
    .catch(setError)
    .then(() => {
      project.uncacheLink('project_roles');
      const savingIndex = saving.indexOf(projectRoleSet.id);
      setSaving(saving.splice(savingIndex, 1));
      setProjectRoleSets(projectRoleSets.filter(roleSet => roleSet.id !== projectRoleSet.id));
    });
  }

  function addCollaborator() {
    project.uncacheLink('project_roles');
    fetchProjectRoles();
  }

  return (
    <div>
      <div className="form-label">Project Owner</div>
        <p>
      {user.id === projectOwner?.id ? 'You are the project owner.' : projectOwner?.display_name + ' is the project owner.'}
        </p>

      <br />

      <div className="form-label">Collaborators</div>

      <hr />

      {error &&
        <p className="form-help error">{error.toString()}</p>
      }

      <div>
        {projectRoleSets.length > 1 ?
          projectRoleSets.map(projectRoleSet => {
            if (!projectRoleSet.roles.includes('owner')) {
              const onToggle = (role) => toggleRole(projectRoleSet, role);
              const onDelete = () => removeRoleSet(projectRoleSet);
              return (
                <UserRow
                  key={projectRoleSet.id}
                  disabled={saving.includes(projectRoleSet.id)}
                  possibleRoles={possibleRoles}
                  projectRoleSet={projectRoleSet}
                  onDelete={onDelete}
                  onToggle={onToggle}
                />
              )
            }
            return null
          }) :
          <em className="form-help">None yet</em>
        }
      </div>

      <hr />

      <div className="form-label">Add another</div>
      <CollaboratorCreator
        possibleRoles={possibleRoles}
        project={project}
        onAdd={addCollaborator} />
    </div>
  );
}
