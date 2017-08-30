import React from 'react';
import ReactDOM from 'react-dom';
import Dialog from '../components/dialog';

function alert(message) {
  const defer = {
    resolve: null,
    reject: null
  };

  const promise = new Promise((resolve, reject) => {
    defer.resolve = resolve;
    defer.reject = reject;
  });

  if (typeof message === 'function') {
    message = message(defer.resolve, defer.reject);
  }

  const container = document.createElement('div');
  container.classList.add('dialog-container');
  document.body.appendChild(container);

  const closeButton = <button autoFocus={true} aria-label="Close" onClick={defer.resolve}>&times;</button>;
  ReactDOM.render(
    <Dialog className="alert" controls={closeButton} onEscape={defer.resolve}>
      {message}
    </Dialog>,
    container
  );

  function unmount() {
    ReactDOM.unmountComponentAtNode(container);
    container.parentNode.removeChild(container);
  }

  promise.then(unmount, unmount);
  return promise;
}

export default alert;
