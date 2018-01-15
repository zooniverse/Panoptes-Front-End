import PropTypes from 'prop-types';
import React from 'react';
import alert from '../lib/alert';
import AutoSave from '../components/auto-save';
import DisplayNameSlugEditor from '../partials/display-name-slug-editor';
import Thumbnail from '../components/thumbnail';
import CharLimit from '../components/char-limit';

export default class CollectionSettings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      description: '',
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
    this.handleDescriptionInputChange = this.handleDescriptionInputChange.bind(this);
  }

  componentDidMount() {
    this.props.collection.listen('delete', this.redirect);
  }

  componentWillUnmount() {
    this.props.collection.stopListening('delete');
  }

  redirect() {
    this.context.router.push('/collections');
  }

  confirmDelete() {
    alert((resolve) => {
      const handleDelete = () => { this.deleteCollection().then(resolve); };

      return (
        <div className="confirm-delete-dialog content-container">
          <p>Are you sure you want to delete this collection? This action is irreversible!</p>

          {this.state.isDeleting &&
            <div>
              <button className="major-button" disabled={true}><i className="fa fa-spinner" /></button>
              {' '}
            </div>}

          {!this.state.isDeleting &&
            <div>
              <button className="minor-button" autoFocus={true} onClick={resolve}>No, don&apos;t delete it.</button>
              {' '}
              <button className="major-button" onClick={handleDelete}>Yes, delete it!</button>
            </div>}
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

  handleDescriptionInputChange(event) {
    const description = event.target.value;
    this.setState({ description })

    if (description.length <= 300) {
       this.props.collection.update({ description });
    }
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
        <h2>Collection Settings</h2>
        {this.state.error &&
          <p>Something went wrong. Please try again</p>}
        <DisplayNameSlugEditor resource={this.props.collection} resourceType="collection" />

        <hr />

        <h3 className="form-label">Description</h3>
        <AutoSave resource={this.props.collection}>
          <form>
            <textarea
              name="description"
              className="standard-input full"
              value={this.props.collection.description}
              onChange={this.handleDescriptionInputChange}
              placeholder="Collection Description"
            />
          </form>
        </AutoSave>
        <small>
          Describe your collection in more detail.{' '}
          <CharLimit
            limit={300}
            string={this.props.collection.description}
          />
        </small>
        <br />
        {this.state.description.length > 300 &&
          <span className="form-help error">Description cannot be more than 300 characters.</span>}
        <hr />

        <h3 className="form-label">Visibility</h3>

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

        <p className="form-help">
          Only the assigned <strong>collaborators</strong> can view a private project.
          Anyone with the URL can access a public project.
        </p>

        <hr />

        <h3 className="form-label">Cover Subject</h3>

        <p className="form-help">
          The cover subject defaults to the first frame of the first subject linked to the collection.
          A custom cover can be set by owners or collaborators using the button toggle
          below the subject previews while browsing the collection.
        </p>
        <p className="form-help">
          Note: Setting the subject cover is only supported for image subjects at this time.
        </p>

        {this.props.collection.default_subject_src &&
          <Thumbnail className="cover-subject-preview" src={this.props.collection.default_subject_src} width={300} />}

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
  router: PropTypes.object.isRequired
};

CollectionSettings.defaultProps = {
  canCollaborate: false,
  collection: {}
};

CollectionSettings.propTypes = {
  canCollaborate: PropTypes.bool,
  collection: PropTypes.shape({
    default_subject_src: PropTypes.string,
    description: PropTypes.string,
    private: PropTypes.bool
  })
};