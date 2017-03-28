import React from 'react';
import counterpart from 'counterpart';
import Translate from 'react-translate-component';

counterpart.registerTranslations('en', {
  announcement: `
    The Zooniverse is being featured on BBC Stargazing Live (UK) and ABC Stargazing Live (Australia) from 28th March - 6th April.
    During this time the main Zooniverse collections page has been disabled to help cope with the large amount of traffic on the site.
    Don't worry, your individual collections are still accessible and the main collections page will return after the event is finished.
    Thanks for your understanding during this time!
  `
});

export default class Announcement extends React.Component {
  render() {
    return (
      <div className="collections-announcement-banner">
        <Translate content="announcement" />
      </div>
    );
  }
}
