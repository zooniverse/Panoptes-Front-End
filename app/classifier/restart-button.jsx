import React from 'react';

class RestartButton extends React.Component {
  constructor(props) {
    super(props);
    this.fetchFor = this.fetchFor.bind(this);
    this.state = {
      dialog: null,
    };
  }

  componentDidMount() {
    this.fetchFor(this.props.workflow);
  }

  componentWillReceiveProps(nextProps) {
    if ((nextProps.workflow !== this.props.workflow) && (nextProps.project === this.props.project)) {
      this.fetchFor(nextProps.workflow);
    }
  }

  getCallback() {
    // override in sub-class
    return () => {};
  }

  shouldRender() {
    // override in sub-class
    return true;
  }

  fetchFor(workflow) {
    this.setState({ dialog: null }, () => {
      this.props.Dialog.find({ workflow }).then((dialog) => {
        this.setState({ dialog });
      });
    });
  }

  render() {
    // state and props are passed into getCallback and shouldRender
    // to avoind binding a sub-class function to the parent class `this`
    const onClick = this.getCallback(this.state, this.props);
    if (this.shouldRender(this.state, this.props)) {
      return (
        <button type="button" {...this.props} onClick={onClick}>
          {this.props.children}
        </button>
      );
    } else {
      return null;
    }
  }
}

RestartButton.defaultProps = {
  wrkflow: null,
  project: null,
  user: null,
};

RestartButton.propTypes = {
  workflow: React.PropTypes.object,
  project: React.PropTypes.object,
  user: React.PropTypes.object,
  children: React.PropTypes.node,
  Dialog: React.PropTypes.func,
};

export default RestartButton;
