import React, { Component } from 'react';

import LoadingIndicator from '../../../components/loading-indicator';

class DeleteUser extends Component {
  constructor(props) {
    super(props);
    this.state = {deletionInProgress: false};
    this.handleClick = this.handleClick.bind(this)
    this.performDelete = this.performDelete.bind(this)
  }

  render() {
    return (
      <div>
        <button type="button" className="minor-button" disabled={this.state.deletionInProgress} onClick={this.handleClick} style={{background: "red", color: "white"}}>
          Delete this user
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

    var phrase = prompt("You are about to delete this user and all their projects! This cannot be reversed.\nEnter this user's login to confirm.");

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
};

DeleteUser.propTypes = {
  user: React.PropTypes.object
}

DeleteUser.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default DeleteUser;
