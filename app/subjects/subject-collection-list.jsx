import React from 'react';
import Loading from '../components/loading-indicator';
import CollectionPreview from '../collections/preview';

const SubjectCollectionList = (props) => {
  if (!props.collections) {
    return (<Loading />);
  }

  if (props.collections && props.collections.length === 0) {
    return (<p>There are no collections yet</p>);
  }

  return (
    <div className="subject-collection-list">
      <h2>Collections:</h2>
      <div className="subject-collection-list-container">
        {props.collections.map((collection) => {
          return (
            <CollectionPreview
              key={`collection-${collection.id}`}
              collection={collection}
              project={props.project}
            />
          );
        })}
      </div>
    </div>
  );
};

SubjectCollectionList.defaultProps = {
  collections: null,
  project: null
};

SubjectCollectionList.propTypes = {
  collections: React.PropTypes.arrayOf(React.PropTypes.object),
  project: React.PropTypes.object
};

export default SubjectCollectionList;
