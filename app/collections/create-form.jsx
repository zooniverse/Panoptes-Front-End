import React from 'react';
import Translate from 'react-translate-component';
import apiClient from 'panoptes-client/lib/api-client';

class CollectionsCreateForm extends React.Component {
  constructor() {
    super();

    this.state = {
      collectionNameLength: 0,
      error: null
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.handleNameInputChange = this.handleNameInputChange.bind(this);
  }

  onSubmit(event) {
    event.preventDefault();

    const displayName = this.name.value;
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
      private: isPrivate,
      links
    };

    apiClient.type('collections').create(collection).save()
      .then((newCollection) => {
        this.name.value = '';
        this.isPrivate.value = null;
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
        <label>
          <input
            className="collection-name-input"
            ref={(node) => { this.name = node; }}
            onChange={this.handleNameInputChange}
            placeholder="Collection Name"
          />
        </label>
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
            <button type="submit" disabled={this.state.collectionNameLength < 1}>
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
