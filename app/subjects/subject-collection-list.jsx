import PropTypes from 'prop-types';
import React from 'react';
import Loading from '../components/loading-indicator';
import CollectionCard from '../pages/collections/collection-card';
import Paginator from '../talk/lib/paginator';

const SubjectCollectionList = (props) => {
  if (props.collections && props.collections.length === 0) {
    return (<p>There are no collections yet</p>);
  }

  if (props.collections && props.project) {
    const meta = props.collections[0].getMeta();

    return (
      <div className="collection-card-list">
        <h2>Collections:</h2>
        <div>
          {props.collections.map((collection) => {
            return (
              <CollectionCard
                key={`collection-${collection.id}`}
                collection={collection}
                linkTo={`/projects/${props.project.slug}/collections/${collection.slug}`}
              />
            );
          })}
        </div>
        <Paginator
          className="talk"
          onPageChange={props.onCollectionsPageChange}
          page={meta.page}
          pageCount={meta.page_count}
          pageKey="collections_page"
        />
      </div>
    );
  }

  return (<Loading />);
};

SubjectCollectionList.defaultProps = {
  collections: null,
  project: null
};

SubjectCollectionList.propTypes = {
  collections: PropTypes.arrayOf(PropTypes.object),
  onCollectionsPageChange: PropTypes.func,
  project: PropTypes.shape({
    slug: PropTypes.string
  })
};

export default SubjectCollectionList;