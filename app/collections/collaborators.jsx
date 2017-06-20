import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import classNames from 'classnames';
import UserSearch from '../components/user-search';
import checkIfCollectionOwner from '../lib/check-if-collection-owner';
import alert from '../lib/alert';

const ID_PREFIX = 'COLLECTION_COLLABORATORS_PAGE_';

const POSSIBLE_ROLES = [
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
    const checkedBoxes = Array.from(checkboxes).filter(box => box.checked);
    const roles = checkedBoxes.map(role => role.value);

    this.setState({
      creating: true,
      error: null
    });

    const roleSets = users.map(id =>
      apiClient.type('collection_roles').create({
        roles,
        links: {
          collection: this.props.collection.id,
          user: id
        }
      })
    );

    Promise.all((roleSets.map(roleSet =>
      roleSet.save()
    )))
      .then(() => {
        this.userSearch.clear();
        checkboxes.forEach((box) => {
          box.checked = false;
        });
        if (this.props.onAdd) {
          this.props.onAdd();
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
    let errorMessage;

    if (this.state.error) {
      if (this.state.error.status === 404) {
        errorMessage = 'That user doesn\'t exist!';
      } else {
        errorMessage = 'Error adding user.';
      }
    }

    const style = classNames({
      'collection-role-create': this.state.creating
    });

    return (
      <div ref={(node) => { this.node = node; }}>
        {this.state.error && (
          <p className="form-help error">{errorMessage}</p>
        )}

        <form className={style}>
          <div>
            <UserSearch ref={(component) => { this.userSearch = component; }} />
          </div>

          <dl className="collection-list">
            {POSSIBLE_ROLES.map(role =>
              <div key={role}>
                <dt>
                  <input id={ID_PREFIX + role} type="checkbox" name="role" value={role} disabled={role === 'owner'} />
                  <strong><label htmlFor={ID_PREFIX + role}>{ROLES_INFO[role].label}</label></strong>
                </dt>
                <dd>{ROLES_INFO[role].description}</dd>
              </div>
            )}
          </dl>

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
      owner: {},
      saving: null
    };

    this.confirmDelete = this.confirmDelete.bind(this);
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
    this.updateRoles([]).then(() => {
      this.props.onRemove();
    });
  }

  toggleRole(role) {
    const currentRoles = this.props.roleSet.roles;
    const removing = currentRoles.includes(role);

    if (removing) {
      if (currentRoles.length > 1) {
        const index = currentRoles.indexOf(role);
        currentRoles.splice(index, 1);
      } else {
        this.confirmDelete();
      }
    } else {
      currentRoles.push(role);
    }

    if (currentRoles.length) { this.updateRoles(currentRoles); }
  }

  confirmDelete() {
    alert((resolve) => {
      const handleDelete = () => {
        this.removeRoles();
        resolve();
      };

      return (
        <div className="confirm-delete-dialog content-container">
          <p>Are you sure you want to remove roles for this user?</p>
          <div>
            <button className="minor-button" autoFocus={true} onClick={resolve}>No</button>
            {' '}
            <button className="major-button" onClick={handleDelete}>Yes</button>
          </div>
        </div>
      );
    });
  }

  updateRoles(newRoles = []) {
    let promise;
    this.setState({ saving: true });

    if (newRoles.length > 0) {
      promise = this.props.roleSet.update({ roles: newRoles }).save();
    } else {
      promise = this.props.roleSet.delete();
    }

    return promise.then(() => {
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

        {' '}<button type="button" className="secret-button" onClick={this.confirmDelete}>&times;</button>

        <span className="columns-container inline">
          {POSSIBLE_ROLES.map((role) => {
            const checkedRole = this.props.roleSet.roles.includes(role);
            const boldRole = checkedRole ? <strong>{ROLES_INFO[role].label}</strong> : ROLES_INFO[role].label;

            return (
              <label htmlFor={role.id} key={role}>
                <input id={role.id} type="checkbox" name={role} checked={checkedRole} disabled={this.state.saving} onChange={this.toggleRole.bind(this, role)} />{' '}
                {boldRole}
              </label>
            );
          })}
        </span>
      </p>
    );
  }
}

RoleRow.propTypes = {
  onRemove: React.PropTypes.func,
  roleSet: React.PropTypes.shape({
    delete: React.PropTypes.func,
    get: React.PropTypes.func,
    roles: React.PropTypes.array,
    update: React.PropTypes.func
  })
};

export class CollectionCollaborators extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      hasSettingsRole: false,
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

  update() {
    apiClient.type('collection_roles').get({ collection_id: this.props.collection.id })
      .then((roleSets) => {
        this.setState({ roleSets });
      });
  }

  handleCollaboratorChange() {
    this.props.collection.uncacheLink('collection_roles');
    this.update();
  }

  render() {
    const { roleSets } = this.state;

    if (this.state.hasSettingsRole) {
      return (
        <div className="collection-settings-tab">
          {this.state.error && (<p className="form-help error">{this.state.error.toString()}</p>)}

          {roleSets.length === 1 && (
            <div className="helpful-tip">None yet, add some with the form below.</div>)}

          {this.props.owner && roleSets.length > 1 && (
            <ul>
              {roleSets.map((roleSet) => {
                if (this.props.owner.id !== roleSet.links.owner.id) {
                  return (
                    <li key={roleSet.id}>
                      <RoleRow key={roleSet.id} roleSet={roleSet} onRemove={this.handleCollaboratorChange} />
                    </li>
                  );
                }
              })}
            </ul>
          )}

          <hr />

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
  owner: React.PropTypes.shape({
    display_name: React.PropTypes.string,
    id: React.PropTypes.string
  }),
  user: React.PropTypes.shape({
    id: React.PropTypes.string
  })
};

export default CollectionCollaborators;
