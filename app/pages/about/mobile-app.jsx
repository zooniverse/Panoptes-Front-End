import React from 'react';
import counterpart from 'counterpart';
import { Markdown } from 'markdownz';

class MobileAppPage extends React.Component {
  render() {
    return (
      <section>
        <Markdown>{counterpart('about.mobileApp.title')}</Markdown>
        <Markdown>{counterpart('about.mobileApp.paragraphOne')}</Markdown>
        <Markdown>{counterpart('about.mobileApp.paragraphTwo')}</Markdown>
        <Markdown>{counterpart('about.mobileApp.paragraphThree')}</Markdown>
        <Markdown>{counterpart('about.mobileApp.paragraphFour')}</Markdown>
        <div className="mobileApp__sections">
          <div className="mobileApp__section">
            <Markdown>{counterpart('about.mobileApp.android.header')}</Markdown>
            <Markdown>{counterpart('about.mobileApp.android.download', { url: 'https://play.google.com/store/apps/details?id=com.zooniversemobile' })}</Markdown>
          </div>
          <div className="mobileApp__section">
            <Markdown>{counterpart('about.mobileApp.ios.header')}</Markdown>
            <Markdown>{counterpart('about.mobileApp.ios.download', { url: 'https://apps.apple.com/us/app/zooniverse/id1194130243' })}</Markdown>
          </div>
        </div>
      </section>
    );
  }
}

export default MobileAppPage;
