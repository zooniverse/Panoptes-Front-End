import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import UserSearch from '../components/user-search';
import checkIfCollectionOwner from '../lib/check-if-collection-owner';

const ID_PREFIX = 'COLLECTION_COLLABORATORS_PAGE_';

const POSSIBLE_ROLES = [
  'owner',
  'collaborator',
  'contributor',
  'viewer'
];

const ROLES_INFO = {
  owner: {
    label: 'Owner',
    description: 'The collection creator. There can only be one.'
  },
  collaborator: {
    label: 'Collaborator',
    description: 'Collaborators have full access to add and remove subjects from the collection.'
  },
  contributor: {
    label: 'Contributor',
    description: 'Contributors can only add subjects to the collection.'
  },
  viewer: {
    label: 'Viewer',
    description: 'Viewers can see this collection even if it\'s private.'
  }
};

export class RoleCreator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      creating: null,
      error: null
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();

    const checkboxes = this.node.querySelectorAll('[name="role"]');
    const users = this.userSearch.value().map(option => parseInt(option.value, 10));
    const checkedBoxes = Object.keys(checkboxes).filter(key => checkboxes[key].checked);
    const roles = checkedBoxes.map(value => checkboxes[value].value);

    this.setState({
      creating: true,
      error: null
    });

    const roleSets = users.map((id) => {
      const newRoleSet = apiClient.type('collection_roles').create({
        roles,
        links: {
          collection: this.props.collection.id,
          user: id
        }
      });
      return newRoleSet;
    });

    Promise.all(roleSets.map((roleSet) => {
      roleSet.save();
    }))
    .then((...args) => {
      this.userSearch.clear();
      Object.keys(checkboxes).map((key) => {
        checkboxes[key].checked = false;
      });
      if (this.props.onAdd) {
        this.props.onAdd.apply(null, args);
      }
    })
    .catch((error) => {
      this.setState({ error });
    })
    .then(() => {
      this.setState({ creating: false });
    });
  }

  render() {
    let style;
    let errorMessage;

    if (this.state.creating) {
      style = {
        opacity: 0.5,
        pointerEvents: 'none'
      };
    }

    if (this.state.error) {
      const rawErrorMessage = this.state.error.toString();

      if (rawErrorMessage.indexOf('No User with id')) {
        errorMessage = 'That user doesn\'t exist!';
      } else {
        errorMessage = 'Error adding user.';
      }
    }

    return (
      <div ref={(node) => { this.node = node; }}>
        {this.state.error && (
          <p className="form-help error">{errorMessage}</p>
        )}

        <form style={style}>
          <div>
            <UserSearch ref={(component) => { this.userSearch = component; }} />
          </div>

          <table className="standard-table">
            <tbody>
              {POSSIBLE_ROLES.map(role =>
                <tr key={role}>
                  <td><input id={ID_PREFIX + role} type="checkbox" name="role" value={role} disabled={role === 'owner'} /></td>
                  <td><strong><label htmlFor={ID_PREFIX + role}>{ROLES_INFO[role].label}</label></strong></td>
                  <td>{ROLES_INFO[role].description}</td>
                </tr>
              )}
            </tbody>
          </table>

          <p>
            <button type="submit" className="major-button" onClick={this.handleSubmit}>Add user role</button>
          </p>
        </form>
      </div>
    );
  }
}

RoleCreator.defaultProps = {
  collections: null
};

RoleCreator.propTypes = {
  collection: React.PropTypes.shape({
    id: React.PropTypes.string
  }),
  onAdd: React.PropTypes.func
};

export class RoleRow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      owner: null,
      saving: null
    };

    this.removeRoles = this.removeRoles.bind(this);
    this.toggleRole = this.toggleRole.bind(this);
    this.updateRoles = this.updateRoles.bind(this);
  }

  componentDidMount() {
    this.props.roleSet.get('owner')
      .then((owner) => {
        this.setState({ owner });
      });
  }

  removeRoles() {
    this.updateRoles([], this.props.onRemove);
  }

  toggleRole(role) {
    let index;
    const currentRoles = this.props.roleSet.roles;

    if (currentRoles.includes(role)) {
      index = currentRoles.indexOf(role);
      currentRoles.splice(index, 1);
    } else {
      currentRoles.push(role);
    }

    if (currentRoles.length) {
      this.updateRoles(currentRoles);
    } else {
      this.removeRoles();
    }
  }

  updateRoles(newRoles = [], callback = () => {}) {
    let promise;
    this.setState({ saving: true });

    if (newRoles.length > 0) {
      promise = this.props.roleSet.update({ roles: newRoles }).save();
    } else {
      promise = this.props.roleSet.delete();
    }

    promise.then(() => {
      callback();
      this.setState({ saving: false });
    })
    .catch((error) => {
      this.setState({ error });
    });
  }

  render() {
    const { owner } = this.state;

    return (
      <p>
        {owner && (<strong>{owner.login}</strong>)}

        <button type="button" className="pill-button" onClick={this.removeRoles}>Remove</button>
        <br />

        <span className="columns-container inline">
          {POSSIBLE_ROLES.map(role =>
            <label htmlFor="role" key={role}>
              <input type="checkbox" name={role} checked={this.props.roleSet.roles.includes(role)} disabled={role === 'owner' || this.state.saving} onChange={this.toggleRole.bind(this, role)} />{' '}
              {ROLES_INFO[role].label}
            </label>
          )}
        </span>
      </p>
    );
  }
}

export class CollectionCollaborators extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      hasSettingsRole: false,
      owner: null,
      roleSets: []
    };

    this.update = this.update.bind(this);
    this.handleCollaboratorChange = this.handleCollaboratorChange.bind(this);
  }

  componentDidMount() {
    checkIfCollectionOwner(this.props.user, this.props.collection)
    .then((hasSettingsRole) => {
      this.setState({ hasSettingsRole });
    });
    this.update();
  }

  update(callback = () => {}) {
    const promise = Promise.all([
      apiClient.type('collection_roles').get({ collection_id: this.props.collection.id, http_cache: false }),
      this.props.collection.get('owner')
    ]);

    promise.then(([roleSets, owner]) => {
      this.setState({ roleSets, owner }, callback);
    });
  }

  handleCollaboratorChange() {
    this.props.collection.uncacheLink('collection_roles');
    this.update();
  }

  render() {
    const { roleSets } = this.state;
    const { owner } = this.state;

    if (this.state.hasSettingsRole) {
      return (
        <div className="collection-settings-tab">
          {this.state.error && (<p className="form-help error">{this.state.error.toString()}</p>)}

          {roleSets.length === 1 && (
            <div className="helpful-tip">None yet, add some with the form below.</div>
          )}

          {owner && roleSets.length > 1 && (
            <div>
              {roleSets.map((roleSet) => {
                if (owner.id !== roleSet.links.owner.id) {
                  return <RoleRow key={roleSet.id} roleSet={roleSet} onRemove={this.handleCollaboratorChange} />;
                }
              })}
            </div>
          )}

          <br />
          <hr />
          <br />

          <div className="form-label">Add a collaborator</div>
          <RoleCreator collection={this.props.collection} onAdd={this.handleCollaboratorChange} />
        </div>
      );
    } else {
      return (
        <div className="collection-settings-tab">
          <p>Not allowed to edit this collection</p>
        </div>
      );
    }
  }
}

CollectionCollaborators.propTypes = {
  collection: React.PropTypes.shape({
    get: React.PropTypes.func,
    id: React.PropTypes.string,
    uncacheLink: React.PropTypes.func
  }),
  user: React.PropTypes.shape({
    id: React.PropTypes.string
  })
};

export default CollectionCollaborators;
