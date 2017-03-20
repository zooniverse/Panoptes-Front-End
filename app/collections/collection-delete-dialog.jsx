import React from 'react';


const CollectionDeleteDialog = ({ deleteCollection, isDeleting, onComplete }) => {
  return (
    <div>
      <p>Are you sure you want to delete this collection? This action is irreversible!</p>

      {isDeleting &&
        <div>
          <button className="major-button" disabled={true}><i className="fa fa-spinner" /></button>
          {' '}
        </div>}

      {!isDeleting &&
        <div>
          <button className="major-button" onClick={deleteCollection}>Yes, delete it!</button>
          {' '}
          <button className="minor-button" onClick={onComplete}>No, don't delete it.</button>
        </div>}
    </div>
  );
};

CollectionDeleteDialog.defaultProps = {
  deleteCollection: () => {},
  isDeleting: false,
  onComplete: () => {}
};

CollectionDeleteDialog.propTypes = {
  deleteCollection: React.PropTypes.func.isRequired,
  isDeleting: React.PropTypes.bool.isRequired,
  onComplete: React.PropTypes.func
};

export default CollectionDeleteDialog;
