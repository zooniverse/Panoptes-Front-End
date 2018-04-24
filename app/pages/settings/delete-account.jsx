import PropTypes from 'prop-types';
import React from 'react';
import counterpart from 'counterpart';

import LoadingIndicator from '../../components/loading-indicator';

class DeleteUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {deletionInProgress: false};
    this.handleClick = this.handleClick.bind(this);
    this.performDelete = this.performDelete.bind(this);
  }

  render() {
    return (
      <div>
        <p>
          <strong>{counterpart('accountSettings.deleteAccount.header')}</strong>
        </p>

        <p>{counterpart('accountSettings.deleteAccount.info')}</p>

        <button type="button" className="minor-button" disabled={this.state.deletionInProgress} onClick={this.handleClick} style={{background: "red", color: "white"}}>
          {counterpart('accountSettings.deleteAccount.button')}
          <LoadingIndicator off={!this.state.deletionInProgress} />
        </button>
        {this.state.deletionError && (
           <div className="form-help error">{this.state.deletionError.message}</div>
        )}
      </div>
    );
  }

  handleClick() {
    this.setState({deletionError: null});

    var phrase = prompt(counterpart('accountSettings.deleteAccount.confirmMessage'));

    if (phrase === this.props.user.login) {
      this.performDelete();
    } else {
      this.setState({deletionError: {message: counterpart('accountSettings.deleteAccount.confirmError')}});
    }
  }

  performDelete() {
    this.setState({deletionInProgress: true});

    this.props.user.delete().then(() => {
      auth.signOut().then(() => {
        this.context.router.push('/');
      });
    }).catch((error) => {
        this.setState({deletionError: error, deletionInProgress: false});
    }).then(() => {
        this.setState({deletionInProgress: false});
    })
  }
}

DeleteUser.propTypes = {
  user: PropTypes.object
}

DeleteUser.contextTypes = {
  router: PropTypes.object.isRequired
};

export default DeleteUser;
