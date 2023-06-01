import { useEffect, useState } from 'react';

import { ROLES_INFO } from './constants.js';

export default function UserRow({
  disabled = false,
  onDelete,
  onToggle,
  possibleRoles,
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