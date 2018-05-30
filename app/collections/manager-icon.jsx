import PropTypes from 'prop-types';
import React from 'react';
import Dialog from 'modal-form/dialog';
import CollectionsManager from './collections-manager';

class CollectionsManagerIcon extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
  }

  open() {
    this.setState({ open: true });
  }

  close(e) {
    this.setState({ open: false });
    e.stopPropagation();
  }

  render() {
    const subjectIDs = this.props.subject ? [this.props.subject.id] : [];
    return (
      <button
        aria-label="Collect"
        className={`collections-manager-icon ${this.props.className}`}
        title="Collect"
        onClick={this.open}
      >
        <i className="fa fa-list fa-fw" />

        {this.state.open &&
          <Dialog tag="div" closeButton={true} onCancel={this.close}>
            <CollectionsManager
              onSuccess={this.close}
              project={this.props.project}
              subjectIDs={subjectIDs}
              user={this.props.user}
            />
          </Dialog>}
      </button>
    );
  }
}

CollectionsManagerIcon.defaultProps = {
  className: ''
};

CollectionsManagerIcon.propTypes = {
  className: PropTypes.string,
  project: PropTypes.object,
  subject: PropTypes.shape({
    id: PropTypes.string
  }),
  user: PropTypes.object
};

export default CollectionsManagerIcon;