import React from 'react';

export default class DragAndDropTarget extends React.Component {
  constructor(props) {
    super(props);

    this.handleDragOver = this.handleDragOver.bind(this);
    this.handleDragLeave = this.handleDragLeave.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
  }

  handleDragEnter(e) {
    e.preventDefault();
  }

  handleDragOver(e) {
    e.preventDefault();
  }

  handleDragLeave(e) {
    e.preventDefault();
  }

  handleDrop(e) {
    e.preventDefault();
    this.props.onDrop(...arguments);
  }

  render() {
    const className = `file-drop-target ${this.props.className}`.trim();
    return (
      <div
        {...this.props}
        className={className}
        onDragEnter={this.handleDragEnter}
        onDragOver={this.handleDragOver}
        onDragLeave={this.handleDragLeave}
        onDrop={this.handleDrop}
      >
        {this.props.children}
      </div>
    );
  }
}

DragAndDropTarget.defaultProps = {
  children: null,
  className: '',
  onDrop: () => {},
};

DragAndDropTarget.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  onDrop: React.PropTypes.func,
};
