import { useEffect, useRef, useState } from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import talkClient from 'panoptes-client/lib/talk-client';

import CollaboratorCreator from './collaborators/CollaboratorCreator.jsx';
import UserRow from './collaborators/UserRow.jsx';
import { ROLES_NOT_IN_TALK_API } from './collaborators/constants.js';
import projectSection from '../../talk/lib/project-section.coffee';
import isAdmin from '../../lib/is-admin.coffee';
import getAllLinked from '../../lib/get-all-linked.js';

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
    .then(setProjectRoleSets);
  }

  useEffect(function fetchOwner() {
    project.get('owner')
      .then(setProjectOwner)
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
      talkRoleAction = filteredRoles[0]?.delete();
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
        onAdd={addCollaborator}
      />
    </div>
  );
}
