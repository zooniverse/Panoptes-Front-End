import React from 'react';
import Translate from 'react-translate-component';

const NotFoundPage = () =>
  (<div className="content-container">
    <i className="fa fa-frown-o" aria-hidden="true" />{' '}
    <Translate content="notFoundPage.message" />
  </div>);

export default NotFoundPage;
