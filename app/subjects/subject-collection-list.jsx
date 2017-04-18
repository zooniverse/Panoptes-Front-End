import React from 'react';
import Loading from '../components/loading-indicator';
import CollectionCard from '../pages/collections/collection-card';
import Paginator from '../talk/lib/paginator';

const SubjectCollectionList = (props) => {
  let meta;
  if (!props.collections) {
    return (<Loading />);
  }

  if (props.collections && props.collections.length === 0) {
    return (<p>There are no collections yet</p>);
  }

  if (props.collections) {
    meta = props.collections[0].getMeta();
  }

  return (
    <div className="collection-card-list">
      <h2>Collections:</h2>
      <div>
        {props.collections.map((collection) => {
          return (
            <CollectionCard
              key={`collection-${collection.id}`}
              collection={collection}
            />
          );
        })}
      </div>
      <Paginator
        className='talk'
        page={meta.page}
        onPageChange={props.onCollectionsPageChange}
        pageCount={meta.page_count}
      />
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
