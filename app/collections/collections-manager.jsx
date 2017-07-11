import React from 'react';
import CollectionsCreateForm from './create-form';
import CollectionSearch from './collection-search';
import LoadingIndicator from '../components/loading-indicator';

class CollectionsManager extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      adding: false,
      collections: [],
      errors: [],
      hasCollectionSelected: false
    };

    this.addToCollections = this.addToCollections.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange() {
    const collections = this.search.getSelected();

    if (collections.length > 0) {
      this.setState({ hasCollectionSelected: true });
    }
  }

  addToCollections() {
    this.setState({ adding: true, errors: [] });
    const collections = this.search.getSelected();
    if (collections.length === 0) return;

    const promises = collections.map((searchResult) => {
      const collection = searchResult.collection;
      const subjectsToAdd = this.props.subjectIDs.filter((id) => {
        return !collection.links.subjects.includes(id);
      });

      if (subjectsToAdd.length === 0) {
        const noSubjectsError = [
          `There are no subjects to add or subjects are already added to ${collection.display_name}.`
        ];
        const errors = noSubjectsError.concat(this.state.errors);
        this.setState({ errors });
      }

      return collection.addLink('subjects', subjectsToAdd)
        .catch((error) => {
          const newError = [`${collection.display_name}: ${error}`];
          const errors = newError.concat(this.state.errors);
          this.setState({ errors });
        });
    });

    Promise.all(promises)
      .then(() => {
        if (this.state.errors.length === 0) this.props.onSuccess();
        this.setState({ adding: false });
      }).catch(error => this.setState({ adding: false, errors: [error.toString()] }));
  }

  render() {
    return (
      <div className="collections-manager">
        <h2 className="collections-manager__header">
          Add Subject to Collection{' '}<LoadingIndicator off={!this.state.adding} />
        </h2>

        <div>
          {this.state.errors.length > 0 &&
            <ul>
              {this.state.errors.map((error, i) =>
                <li key={i} className="form-help error">{error}</li>)}
            </ul>}
          <CollectionSearch
            ref={(node) => { this.search = node; }}
            onChange={this.onChange}
            multi={true}
          />
          <button
            type="button"
            className="standard-button search-button"
            disabled={!this.state.hasCollectionSelected}
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
