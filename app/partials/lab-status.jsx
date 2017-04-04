/*
"Lab Status" Banner
===================

A spin-off of the AppStatus component, for the Lab page.

(shaun.a.noordin 20170329)
********************************************************************************
 */

import React from 'react';

const APP_STATUS_URL = (process.env.NODE_ENV === 'staging' || process.env.NODE_ENV === 'development')
  ? 'https://static.zooniverse.org/zooniverse.org-lab-status-TEST.txt'
  : 'https://static.zooniverse.org/zooniverse.org-lab-status.txt';

export default class LabStatus extends React.Component {
  constructor(props) {
    super(props);
    this.button = null;

    this.state = {
      show: false,
      message: ''
    };
  }

  componentDidMount() {  // Display only first time user loads zooniverse.org
    if (typeof fetch === 'function') { // conditional required to support webview on iOS < 10.3
      fetch(APP_STATUS_URL, { mode: 'cors' })
      .then((response) => {
        if (!response.ok) {
          console.error('LabStatus: ERROR')
          throw Error(response.statusText);
        }

        return response.text();
      })
      .then((text) => {
        console.log('LabStatus: Received status data from ' + APP_STATUS_URL + '.');
        this.setStatus(text);
      })
      .catch((err) => {
        console.error('LabStatus: No status data from ' + APP_STATUS_URL + '. ', err);
      });
    } else {
      const request = new XMLHttpRequest();
      request.onreadystatechange = () => {
        if (request.readyState === 4 && request.status === 200) {
          this.setStatus(request.responseText);
        } else if (request.readyState === 4) {
          console.log('LabStatus: No status data from ' + APP_STATUS_URL + '. Assuming everything is OK.');
        }
      };
      request.open('GET', APP_STATUS_URL, true);
      request.send();
    }
  }

  setStatus(text) {
    const cleanedText = (text) ? text.trim() : '';  // If text is just white space or newlines...
    if (cleanedText === '') {  // ...ignore it.
      console.log('LabStatus: Nothing to report.');
    } else {
      this.setState({
        show: true,
        message: cleanedText
      });
    }
  }

  render() {
    if (!this.state.show) return null;
    if (!this.state.message || this.state.message === '') return null;

    return (
      <div className="lab-status">
        {/*
        <button className="fa fa-close" onClick={this.hide.bind(this)} autoFocus={true}></button>
        //Unlike App Status, we prevent the closing of the message since we
        //can't get a consistent 'state' across every instance of Lab Status,
        //meaning users will get annoyed if they close the message on Project 13
        //but the message pops up again in Project 15. Removing the option to
        //close will remove the expectation (-shaun 20170327)
        */}
        <div className="message">{this.state.message}</div>
      </div>
    );
  }
}
