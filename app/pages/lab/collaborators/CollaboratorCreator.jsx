import { useRef, useState } from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import talkClient from 'panoptes-client/lib/talk-client';

import UserSearch from '../../../components/user-search.cjsx';
import projectSection from '../../../talk/lib/project-section.coffee';
import { ROLES_NOT_IN_TALK_API, ROLES_INFO } from './constants.js';

const ID_PREFIX = 'LAB_COLLABORATORS_PAGE_';


export default function CollaboratorCreator({
  onAdd,
  possibleRoles,
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
    const roles = [];
    checkboxes.forEach((checkbox) => {
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
      .catch((error) => {
        if (error.message.match(/not allowed to create this role/i)) {
          error.message = 'Your account status on this project is still being setup. Please try again later.';
        }
        setError(error);
      })
      .then(() => {
        setCreating(false);
      });
  }

  return (
    <div>
      {error
        && <p className="form-help error">{error.toString()}</p>
      }
      <form style={style}>
        <div>
          <UserSearch ref={userSearch} />
        </div>

        <table ref={rolesTable} className="standard-table">
          <tbody>
            {Object.entries(possibleRoles).map(([role, label]) => (
              <tr key={`${role}-${label}`}>
                <td><input id={ID_PREFIX + role} type="checkbox" name="role" value={role} disabled={role === 'owner'} /></td>
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
