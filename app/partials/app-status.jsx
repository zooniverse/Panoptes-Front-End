/*
"App Status" Banner
===================

The AppStatus banner has one job: it displays a static message to the users, if
it detects a non-empty 'status message' file at a specified static URL. 
(The static resource is defined by the hardcoded APP_STATUS_URL.)

Intended use: Zooniverse admins can manually change the status file (e.g. via
AWS CLI) so we can quickly notify zooniverse.org users of certain messages,
notably in emergencies, e.g. "Sorry folks but the animals have escaped, brb"

Expected Input/Output:
* static file found, is non-empty => show contents of static file in banner
* static file found, is empty => don't show status banner
* static file not found (403, 404, etc) => don't show status banner

Assumptions:
* the static "status message" resource is stored on a reliable, scalable host.
* fetch() polyfill is available in most browsers, except for
*   on iOS UIWebview < 10.3.  In this case XHR is used instead.

See https://github.com/zooniverse/Panoptes-Front-End/issues/3530 for initial
feature specs.

(shaun.a.noordin 20170301)
********************************************************************************
 */

import React from 'react';

const APP_STATUS_URL = (process.env.NODE_ENV === 'staging' || process.env.NODE_ENV === 'development')
  ? 'https://static.zooniverse.org/zooniverse.org-status-TEST.txt'
  : 'https://static.zooniverse.org/zooniverse.org-status.txt';

export default class AppStatus extends React.Component {
  constructor(props) {
    super(props);
    this.button = null;

    this.state = {
      show: false,
      message: ''
    };
    this.hide = this.hide.bind(this);
  }

  componentDidMount() {  // Display only first time user loads zooniverse.org
    if (typeof fetch === 'function') { // conditional required to support webview on iOS < 10.3
      fetch(APP_STATUS_URL, { mode: 'cors' })
      .then((response) => {
        if (!response.ok) {
          console.error('AppStatus: ERROR')
          throw Error(response.statusText);
        }

        return response.text();
      })
      .then((text) => {
        console.log('AppStatus: Received status data from ' + APP_STATUS_URL + '.');
        this.setStatus(text);
      })
      .catch((err) => {
        console.error('AppStatus: No status data from ' + APP_STATUS_URL + '. ', err);
      });
    } else {
      const request = new XMLHttpRequest();
      request.onreadystatechange = () => {
        if (request.readyState === 4 && request.status === 200) {
          this.setStatus(request.responseText);
        } else if (request.readyState === 4) {
          console.log('AppStatus: No status data from ' + APP_STATUS_URL + '. Assuming everything is OK.');
        }
      };
      request.open('GET', APP_STATUS_URL, true);
      request.send();
    }
  }

  setStatus(text) {
    const cleanedText = (text) ? text.trim() : '';  // If text is just white space or newlines...
    if (cleanedText === '') {  // ...ignore it.
      console.log('AppStatus: Nothing to report.');
    } else {
      this.setState({
        show: true,
        message: cleanedText
      });
    }
  }

  hide() {
    this.setState({
      show: false
    });
  }

  render() {
    if (!this.state.show) return null;
    if (!this.state.message || this.state.message === '') return null;

    return (
      <div className="app-status">
        <button className="fa fa-close" onClick={this.hide} autoFocus={true} />
        <div className="message">{this.state.message}</div>
      </div>
    );
  }
}
