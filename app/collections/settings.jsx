import React from 'react';
import alert from '../lib/alert';
import checkIfCollectionOwner from '../lib/check-if-collection-owner';
import DisplayNameSlugEditor from '../partials/display-name-slug-editor';
import CollectionDeleteDialog from './collection-delete-dialog';

export default class CollectionSettings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      hasSettingsRole: true,
      isDeleting: false,
      setting: {
        private: false
      }
    };

    this.confirmDelete = this.confirmDelete.bind(this);
    this.deleteCollection = this.deleteCollection.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.redirect = this.redirect.bind(this);
  }

  componentDidMount() {
    console.log('roles', this.props.roles);
    // checkIfCollectionOwner(this.props.user, this.props.collection)
    //   .then((hasSettingsRole) => {
    //     this.setState({ hasSettingsRole });
    //   }).catch((error) => { this.setState({ error }); });
    this.props.collection.listen('delete', this.redirect);
  }

  componentDidUnMount() {
    this.props.collection.stopListening('delete');
  }

  redirect() {
    this.context.router.push('/collections');
  }

  confirmDelete() {
    alert((resolve) => {
      return (
        <div className="confirm-delete-dialog content-container">
          <CollectionDeleteDialog
            deleteCollection={this.deleteCollection}
            isDeleting={this.state.isDeleting}
            onComplete={resolve}
          />
        </div>
      );
    });
  }

  deleteCollection() {
    this.setState({ isDeleting: true });

    this.props.collection.delete()
      .catch((error) => {
        this.setState({ error, isDeleting: false });
      }).then(() => {
        this.setState({ isDeleting: false });
      });
  }

  handleToggle(event) {
    const property = event.target.name;
    const value = event.target.value;
    const setting = this.state.setting;
    setting[property] = true;
    this.setState({ error: null, setting });

    const changes = {};
    changes[property] = value;
    this.props.collection.update(changes).save()
      .catch((error) => {
        this.setState({ error });
      }).then(() => {
        setting[property] = false;
        this.setState({ setting });
      });
  }

  render() {
    if (!this.state.hasSettingsRole) {
      return (
        <div className="collection-settings-tab">
          <p>Not allowed to edit this collection</p>
        </div>
      );
    }

    return (
      <div className="collection-settings-tab">
        <DisplayNameSlugEditor resource={this.props.collection} resourceType="collection" />

        <hr />

        <span className="form-label">Visibility</span>
        {this.state.error &&
          <span>Something went wrong. Please try again</span>}
        <form>
          <label>
            <input
              type="radio"
              name="private"
              value={true}
              data-json-value={true}
              disabled={this.state.setting.private}
              checked={this.props.collection.private}
              onChange={this.handleToggle}
            />
            Private
          </label>
          &emsp;
          <label>
            <input
              type="radio"
              name="private"
              value={false}
              data-json-value={true}
              disabled={this.state.setting.private}
              checked={this.props.collection.private ? !this.props.collection.private : this.props.collection.private}
              onChange={this.handleToggle}
            />
            Public
          </label>
        </form>

        <p className="form-help">Only the assigned <strong>collaborators</strong> can view a private project. Anyone with the URL can access a public project.</p>

        <hr />

        <div className="form-label">Delete this Collection</div>
        <div className="delete-container">
          <button className="error major-button" type="button" onClick={this.confirmDelete}>Delete</button>
        </div>
      </div>
    );
  }
}

CollectionSettings.contextTypes = {
  router: React.PropTypes.object.isRequired
};

CollectionSettings.defaultProps = {
  collection: {},
  roles: [],
  user: null
};

CollectionSettings.propTypes = {
  collection: React.PropTypes.shape({
    private: React.PropTypes.bool
  }),
  roles: React.PropTypes.arrayOf(React.PropTypes.object),
  user: React.PropTypes.object
};

