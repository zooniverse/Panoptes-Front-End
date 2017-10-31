import React from 'react';
import Translate from 'react-translate-component';
import apiClient from 'panoptes-client/lib/api-client';

class CollectionsCreateForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      collectionNameLength: 0,
      error: null
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.handleNameInputChange = this.handleNameInputChange.bind(this);
  }

  onSubmit(event) {
    event.preventDefault();

    const displayName = this.refs.name.value;
    const notPublic = this.refs.private.checked;

    const links = {};

    if (this.props.project) {
      links.project = this.props.project.links;
    }

    if (this.props.subjectIDs.length > 0) {
      links.subjects = this.props.subjectIDs;
    }

    const collection = {
      display_name: displayName,
      private: notPublic,
      links
    };

    apiClient.type('collections').create(collection).save()
      .then((newCollection) => {
        this.refs.name.value = '';
        this.refs.private.value = true;
        this.props.onSubmit(newCollection);
      })
      .catch((error) => {
        this.setState({ error });
      });
  }

  handleNameInputChange() {
    this.setState({
      collectionNameLength: this.refs.name.value.length
    });
  }

  render() {
    return (
      <form onSubmit={this.onSubmit} className="collections-create-form">
        <div className="form-help error">
          {this.state.error &&
              `Error ${this.state.error.status}: ${this.state.error.message}`}
        </div>
        <label>
          <input
            className="collection-name-input"
            ref="name"
            onChange={this.handleNameInputChange}
            placeholder="Collection Name"
          />
        </label>
        <div className="collection-create-form-actions">
          <label>
            <input
              ref="private"
              type="checkbox"
              defaultChecked={false}
            />
            <Translate content="collections.createForm.private" />
          </label>
          <div className="submit-button-container">
            {this.state.collectionNameLength < 1 ?
              <button type="submit" disabled={true}>
                <Translate content="collections.createForm.submit" />
              </button> :
              <button type="submit">
                <Translate content="collections.createForm.submit" />
              </button>}
          </div>
        </div>
      </form>
    );
  }
}

CollectionsCreateForm.defaultProps = {
  onSubmit: () => {},
  project: '',
  subjectIDs: []
};

CollectionsCreateForm.propTypes = {
  onSubmit: React.PropTypes.func,
  project: React.PropTypes.string,
  subjectIDs: React.PropTypes.arrayOf(React.PropTypes.string)
};

export default CollectionsCreateForm;
