import PropTypes from 'prop-types';
import React from 'react';

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
          <strong>Delete your account</strong>
        </p>

        <p>Deleting your account will remove your email address, username, password, and other personal information from our database. It will not remove your work on any projects you've taken part in or any comments you've left on Talk. Your account will not be recoverable.</p>

        <button type="button" className="minor-button" disabled={this.state.deletionInProgress} onClick={this.handleClick} style={{background: "red", color: "white"}}>
          I understand and want to delete my account
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

    var phrase = prompt("You are about to delete this user! This cannot be reversed.\nEnter this user's login to confirm.");

    if (phrase === this.props.user.login) {
      this.performDelete();
    } else {
      this.setState({deletionError: {message: "Entered login did not match user. Aborted deletion."}});
    }
  }

  performDelete() {
    this.setState({deletionInProgress: true});

    this.props.user.delete()
        .then(() => {
          this.context.router.push('/admin');
        })
        .catch((error) => {
          this.setState({deletionError: error, deletionInProgress: false});
        })
        .then(() => {
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
