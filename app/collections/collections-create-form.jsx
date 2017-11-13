import React from 'react';
import Translate from 'react-translate-component';
import apiClient from 'panoptes-client/lib/api-client';
import CharLimit from '../components/char-limit';

class CollectionsCreateForm extends React.Component {
  constructor() {
    super();

    this.state = {
      collectionNameLength: 0,
      description: '',
      error: null
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.handleDescriptionInputChange = this.handleDescriptionInputChange.bind(this);
    this.handleNameInputChange = this.handleNameInputChange.bind(this);
  }

  onSubmit(event) {
    event.preventDefault();

    const displayName = this.name.value;
    const description = this.description.value;
    const isPrivate = this.isPrivate.checked;

    const links = {};

    if (this.props.projectID) {
      links.project = this.props.projectID;
    }

    if (this.props.subjectIDs.length > 0) {
      links.subjects = this.props.subjectIDs;
    }

    const collection = {
      display_name: displayName,
      description,
      private: isPrivate,
      links
    };

    apiClient.type('collections').create(collection).save()
      .then((newCollection) => {
        this.name.value = '';
        this.description.value = '';
        this.isPrivate.checked = false;
        this.props.onSubmit(newCollection);
      })
      .catch((error) => {
        this.setState({ error });
      });
  }

  handleNameInputChange() {
    this.setState({
      collectionNameLength: this.name.value.length
    });
  }

  handleDescriptionInputChange(event) {
    this.setState({
      description: event.target.value
    });
  }

  renderError() {
    if (this.state.error.status === 400) {
      return 'You can\'t name two collections the same thing!';
    }

    return 'There was a problem creating your collection.';
  }

  render() {
    return (
      <form onSubmit={this.onSubmit} className="collections-create-form">
        <div className="form-help error">
          {this.state.error &&
              this.renderError()}
        </div>
        <input
          className="collection-create-form__input--name"
          ref={(node) => { this.name = node; }}
          onChange={this.handleNameInputChange}
          placeholder="Collection Name"
        />
        <textarea
          className="collection-create-form__input--description"
          onChange={this.handleDescriptionInputChange}
          ref={(node) => { this.description = node; }}
          placeholder="Collection Description (less than 300 characters)"
        />
        <CharLimit
          limit={300}
          string={this.state.description}
        />
        <div className="collection-create-form-actions">
          <label>
            <input
              ref={(node) => { this.isPrivate = node; }}
              type="checkbox"
              defaultChecked={false}
            />
            <Translate content="collections.createForm.private" />
          </label>
          <div className="submit-button-container">
            <button
              type="submit"
              disabled={this.state.collectionNameLength < 1 || this.state.description.length > 300}
            >
              <Translate content="collections.createForm.submit" />
            </button>
          </div>
        </div>
      </form>
    );
  }
}

CollectionsCreateForm.defaultProps = {
  onSubmit: () => {},
  projectID: '',
  subjectIDs: []
};

CollectionsCreateForm.propTypes = {
  onSubmit: React.PropTypes.func,
  projectID: React.PropTypes.string,
  subjectIDs: React.PropTypes.arrayOf(React.PropTypes.string)
};

export default CollectionsCreateForm;
