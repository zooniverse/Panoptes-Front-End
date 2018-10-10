import React from 'react';
import mockData from './mock-data';
import { ClassifierWrapper } from '../../classifier';
import tasks from '../../classifier/tasks';
import ProjectThemeButton from '../project/components/ProjectThemeButton';

export default class ClassificationViewer extends React.Component {
  constructor() {
    super();

    this.state = {
      showOnlyLast: false,
      showThrowaways: false
    }

    this.togglePersistAnnotations = this.togglePersistAnnotations.bind(this);
    this.toggleMultiImageCloneMarkers = this.toggleMultiImageCloneMarkers.bind(this);
    this.toggleShowOnlyLast = this.toggleShowOnlyLast.bind(this);
    this.toggleShowThrowaways = this.toggleShowThrowaways.bind(this);
  }

  static defaultProps = {
    annotations: [],
    classification: null,
    workflow: {}
  }

  componentDidMount() {
    this._boundForceUpdate = this.forceUpdate.bind(this);
    mockData.classification.listen(this._boundForceUpdate);
  }

  componentWillUnmount() {
    mockData.classification.stopListening(this._boundForceUpdate);
    this._boundForceUpdate = null;
  }

  ignoreUnderscoredProperties(key, value) {
    if (`${key}`.charAt(0) !== '_') {
      return value;
    }
  }

  togglePersistAnnotations(e) {
    this.props.workflow.configuration.persist_annotations = e.target.checked;
    this.forceUpdate();
  }

  toggleMultiImageCloneMarkers(e) {
    this.props.workflow.configuration.multi_image_clone_markers = e.target.checked;
    this.forceUpdate();
  }

  toggleShowOnlyLast(e) {
    this.setState({ showOnlyLast: e.target.checked });
  }

  toggleShowThrowaways(e) {
    this.setState({ showThrowaways: e.target.checked });
  }

  render() {
    const showing = (this.state.showOnlyLast) ?
      this.props.annotations[this.props.annotations.length - 1] :
      this.props.annotations

    const replacer = (this.state.showThrowaways) ?
      null :
      this.ignoreUnderscoredProperties

    return (
      <div className="classifier--dev__tools">
        <ProjectThemeButton />
        <hr />
        <label>
          <input
            type="checkbox"
            checked={this.state.showOnlyLast}
            onChange={this.toggleShowOnlyLast}
          />{' '}
          Show only the last annotation
        </label>
        &ensp;
        <label>
          <input
            type="checkbox"
            checked={this.state.showThrowaways}
            onChange={this.toggleShowThrowaways}
          />{' '}
          Show throwaway properties
        </label>
        &ensp;
        <label>
          <input
            type="checkbox"
            checked={this.props.workflow.configuration.persist_annotations}
            onChange={this.togglePersistAnnotations}
          />{' '}
          Persist Annotations
        </label>
        &ensp;
        <label>
          <input
            type="checkbox"
            checked={this.props.workflow.configuration.multi_image_clone_markers}
            onChange={this.toggleMultiImageCloneMarkers}
          />{' '}
          Clone markings between frames
        </label>
        <br />
        <pre>{JSON.stringify(showing, replacer, 2)}</pre>
      </div>
    );
  }
}