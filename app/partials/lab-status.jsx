/*
"Lab Status" Banner
===================

A spin-off of the AppStatus component, for the Lab page.

(shaun.a.noordin 20170327)
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
      message: '',
    };
  }
  
  componentDidMount() {  //Display only first time user loads zooniverse.org
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
      const cleanedText = (text) ? text.trim() : '';  //If text is just white space or newlines...
      if (cleanedText === '') {  //...ignore it.
        console.log('LabStatus: Nothing to report.');
      } else {
        this.setState({
          show: true,
          message: cleanedText,
        });
      }
    })
    .catch((err) => {
      console.error('LabStatus: No status data from ' + APP_STATUS_URL + '. ', err);
    });
  }
  
  render() {
    if (!this.state.show) return null;
    if (!this.state.message || this.state.message === '') return null;
    
    return (
      <div className="lab-status">
        <button className="fa fa-close" onClick={this.hide.bind(this)} autoFocus={true}></button>
        <div className="message">{this.state.message}</div>
      </div>
    );
  }
  
  hide() {
    this.setState({
      show: false,
    });
  }
}
