import React from 'react';
import alert from '../lib/alert';
import DisplayNameSlugEditor from '../partials/display-name-slug-editor';
import CollectionDeleteDialog from './collection-delete-dialog';

export default class CollectionSettings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
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

    return this.props.collection.delete()
      .catch((error) => {
        this.setState({ error, isDeleting: false });
      });
  }

  handleToggle(privacy, event) {
    const property = event.target.name;
    const setting = this.state.setting;
    setting[property] = true;
    this.setState({ error: null, setting });
    const changes = {};
    changes[property] = privacy;

    this.props.collection.update(changes).save()
      .catch((error) => {
        this.setState({ error });
      }).then(() => {
        setting[property] = false;
        this.setState({ setting });
      });
  }

  render() {
    if (!this.props.canCollaborate) {
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
              value="true"
              disabled={this.state.setting.private}
              defaultChecked={this.props.collection.private}
              onChange={this.handleToggle.bind(this, true)}
            />
            Private
          </label>
          &emsp;
          <label>
            <input
              type="radio"
              name="private"
              value="false"
              disabled={this.state.setting.private}
              defaultChecked={!this.props.collection.private ? true : !this.props.collection.private}
              onChange={this.handleToggle.bind(this, false)}
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
  canCollaborate: false,
  collection: {},
  roles: [],
  user: null
};

CollectionSettings.propTypes = {
  canCollaborate: React.PropTypes.bool,
  collection: React.PropTypes.shape({
    private: React.PropTypes.bool
  }),
  roles: React.PropTypes.arrayOf(React.PropTypes.object),
  user: React.PropTypes.object
};

