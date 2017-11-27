import React from 'react';
import alert from './alert';

function confirm(message, successCallback) {
  return (
    alert((resolve) => {
      return (
        <div className="confirm-delete-dialog content-container">
          <p>{message}</p>
          <div>
            <button className="minor-button" autoFocus={true} onClick={resolve}>Cancel</button>
              {' '}
            <button className="major-button" onClick={() => resolve(successCallback())}>Yes</button>
          </div>
        </div>
      )
    })
  )
}

export default confirm;
