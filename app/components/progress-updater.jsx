import React from 'react';

class ProgressUpdater {

  constructor() {

    this.state = {
      playing: false,
      progressObject: null,
      progressPosition: '0%',
      subjectViewer: null
    };

    this.progressUpdateListener = this.handleProgressUpdate.bind(this);
    this.progressMarkerRenderer = this.renderProgressMarker.bind(this);
    this.progressMonitoredObject = this.registerProgressingObject.bind(this);
  }

  setSubjectViewer(subjectViewer){
    this.state.subjectViewer = subjectViewer;
  }

  updateSubjectViewer(){
    if(this.state.subjectViewer){
      this.state.subjectViewer.forceUpdate();
    }
  }

  handleProgressUpdate(event) {
    var xPosition = 100 * (this.state.progressObject.currentTime / this.state.progressObject.duration)
    this.state.progressPosition = `${xPosition}%`;
    this.updateSubjectViewer();
  }

  renderProgressMarker() {
    var points = {
      x1: this.state.progressPosition,
      y1: '0%',
      x2: this.state.progressPosition,
      y2: '100%'
    };

    var progressMarkerStyle = {
      fill: 'transparent',
      stroke: 'red',
      strokeWidth: 4
    };

    return (
      <g id='progress_marker' {...progressMarkerStyle}>
        <line {...points}/>
      </g>
    )
  }

  registerProgressingObject(progressObject) {
    this.state.progressObject = progressObject;
  }

}

export default ProgressUpdater;
