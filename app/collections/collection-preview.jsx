import React from 'react';
import { Link } from 'react-router';
import Avatar from '../partials/avatar';
import Thumbnail from '../components/thumbnail';

const CollectionPreview = (props) => {
  const maxWidth = innerWidth < 400 ? 75 : 100;

  return (
    <div className="collection-preview">
      <div className="collection">
        <p className="title">
          <Link to={`/projects/${props.project.slug}/collections/${props.collection.slug}`}>
            {props.collection.display_name}
          </Link>
          {' '}by{' '}
          {props.owner &&
            <Link className="user-profile-link" to="/projects/#{props.project.slug}/users/#{props.owner.login}">
              <Avatar user={props.owner} />{' '}{props.owner.display_name}
            </Link>}
        </p>
        {props.collection.default_subject &&
          <div className="subject-previews">
            <Link to={`/projects/${props.project.slug}/collections/${props.collection.slug}`}>
              <div>
                <Thumbnail src={props.collection.default_subject} width={maxWidth} />
              </div>
            </Link>
          </div>}
      </div>
    </div>
  );
};

CollectionPreview.propTypes = {
  collection: React.PropTypes.shape({
    default_subject: React.PropTypes.string,
    display_name: React.PropTypes.string,
    slug: React.PropTypes.string
  }),
  owner: React.PropTypes.shape({
    display_name: React.PropTypes.string,
    login: React.PropTypes.string
  }),
  project: React.PropTypes.shape({
    slug: React.PropTypes.string
  })
};

export default CollectionPreview;
