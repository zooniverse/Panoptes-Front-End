import React from 'react';
import fetch from 'isomorphic-fetch';

const APP_STATUS_URL = 'https://static.zooniverse.org/zooniverse.org-status.txt';

export default class AppStatus extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      show: false,
      message: '',
    };
  }
  
  componentDidMount() {
    /**/
    var request = new XMLHttpRequest();
    request.onreadystatechange = () => {
      if (request.readyState === 4 && request.status === 200) {
        console.log('AppStatus: Received status data from ' + APP_STATUS_URL + '.');
        if (!request.responseText || request.responseText === '') console.log('AppStatus: Nothing to report.');
        this.setState({
          show: true,
          message: request.responseText,
        });
      } else if (request.readyState === 4) {
        console.log('AppStatus: No status data from ' + APP_STATUS_URL + '. Assuming everything is OK.');
      }
    };
    request.open("GET", APP_STATUS_URL, true);
    request.send();
    /**/
    
    /*
    fetch(APP_STATUS_URL, {
      mode: 'cors',
      method: 'GET',
    })
    .then((dataStream) => {
      if (!dataStream) return;
      
      let dataText = '', chunk;
      
      dataStream.on('end', function() {
        this.setState({
          show: true,
          message: dataText,
        });
      });
      
      dataStream.on('readable', () => {
        while ((chunk = dataStream.read()) !== null) { dataText += chunk; }
      });
    })
    .catch((err) => {
      console.error('AppStatus ERROR: ', err);
    });
    /**/
  }
  
  render() {
    if (!this.state.show) return null;
    if (!this.state.message || this.state.message === '') return null;
    
    return (
      <div className="app-status">
        <button className="fa fa-close" onClick={this.hide.bind(this)}></button>
        <div className="message" dangerouslySetInnerHTML={{ __html: this.state.message }}></div>
      </div>
    );
  }
  
  hide() {
    this.setState({
      show: false,
    });
  }
}
