import React from 'react';
import CollectionsCreateForm from './create-form';
import CollectionSearch from './collection-search';

class CollectionsManager extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      collections: [],
      error: null,
      hasCollectionSelected: false
    };

    this.addToCollections = this.addToCollections.bind(this);
  }

  addToCollections() {
    const collections = this.search.getSelected();
    if (!(collections.length > 0)) return;

    const promises = collections.map(collection =>
      collection.addLink('subjects', this.props.subjectIDs)
    );

    Promise.all(promises)
      .then(() => {
        this.props.onSuccess();
      }).catch(error => this.setState({ error }));
  }

  render() {
    return (
      <div className="collections-manager">
        <h1>Add Subject to Collection</h1>

        <div>
          {this.state.error &&
            <div className="form-help error">{this.state.error.toString()}</div>}
          <CollectionSearch
            ref={(node) => { this.search = node; }}
            multi={true}
            project={this.props.project}
          />
          <button
            type="button"
            className="standard-button search-button"
            disabled={this.state.hasCollectionSelected}
            onClick={this.addToCollections}
          >
            Add
          </button>
        </div>

        <hr />

        <div className="form-help">Or Create a new Collection</div>
        <CollectionsCreateForm
          project={this.props.project ? this.props.project.id : null}
          subjectIDs={this.props.subjectIDs}
          onSubmit={this.props.onSuccess}
        />
      </div>
    );
  }
}

CollectionsManager.defaultProps = {
  onSuccess: () => {},
  project: null,
  subjectIDs: []
};

CollectionsManager.propTypes = {
  onSuccess: React.PropTypes.func,
  project: React.PropTypes.shape({
    id: React.PropTypes.string
  }),
  subjectIDs: React.PropTypes.arrayOf(React.PropTypes.string)
};

export default CollectionsManager;
