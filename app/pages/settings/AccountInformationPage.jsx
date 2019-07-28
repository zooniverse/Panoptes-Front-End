import React from 'react';
import counterpart from 'counterpart';
import ChangePasswordForm from './ChangePasswordForm';

export default class AccountInformationPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      displayName: props.user.display_name,
      creditedName: props.user.credited_name,
      interventionNotifications: props.user.intervention_notifications,
      inProgress: false,
      success: false,
      error: null
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();

    this.setState({
      inProgress: true,
      success: false,
      error: null
    });

    this.props.user.update({
      display_name: this.state.displayName,
      credited_name: this.state.creditedName,
      intervention_notifications: this.state.interventionNotifications
    });

    this.props.user.save()
      .then(() => {
        this.setState({
          inProgress: false,
          success: true
        });
      })
      .catch(error => {
        this.setState({
          error: error,
          inProgress: false
        });
      });
  }

  submitDisabled() {
    return this.state.displayName == this.props.user.display_name
      && this.state.creditedName == this.props.user.credited_name
      && this.state.interventionNotifications == this.props.user.intervention_notifications
      || this.state.displayName.length == 0;
  }

  renderStatus() {
    let status = null;
    if (this.state.inProgress) {
      status = <i className="fa fa-spinner fa-spin form-help"></i>;
    } else if (this.state.success) {
      status = <i className="fa fa-check-circle form-help success"></i>;
    } else if (this.state.error) {
      status = <small className="form-help error">{this.state.error.toString()}</small>;
    }
    return status;
  }

  render() {
    return (
      <div className="account-information-tab">
        <div className="columns-container">
          <div className="content-container column">
            <form onSubmit={this.handleSubmit}>
              <p>
                  <span className="form-label">
                    <label htmlFor="displayName">{counterpart('userSettings.account.displayName')}</label>
                  </span>
                  <br />
                  <input
                    type="text"
                    id="displayName"
                    className="standard-input full"
                    name="display_name"
                    value={this.state.displayName}
                    onChange={(e) => { this.setState({ displayName: e.target.value }); }}
                    required
                  />
                <span className="form-help">{counterpart('userSettings.account.displayNameHelp')}</span>
                <br />
                  <label htmlFor="realName">
                    <span className="form-label">{counterpart('userSettings.account.realName')}</span>
                  </label>
                  <br />
                  <input
                    type="text"
                    id="realName"
                    className="standard-input full"
                    name="credited_name"
                    value={this.state.creditedName}
                    onChange={(e) => { this.setState({ creditedName: e.target.value }); }}
                  />
                <span className="form-help">{counterpart('userSettings.account.realNameHelp')}</span>
              </p>
              <fieldset>
                <legend>{counterpart('userSettings.account.interventionsPreferences')}</legend>
                  <label className="form-label">
                    <input
                      type="checkbox"
                      className="standard-input"
                      name="intervention_notifications"
                      checked={this.state.interventionNotifications}
                      onChange={() => { this.setState({ interventionNotifications: !this.state.interventionNotifications }); }}
                    />
                    {counterpart('userSettings.account.interventions')}
                  </label>
                <br />
                <span className="form-help">{counterpart('userSettings.account.interventionsHelp')}</span>
              </fieldset>
              <p>
                <button
                  type="submit"
                  disabled={this.submitDisabled()}
                  className="standard-button"
                >
                  {counterpart('userSettings.account.save')}
                </button>
                {this.renderStatus()}
              </p>
            </form>
          </div>
        </div>
        <hr />
        <div className="content-container">
          {<ChangePasswordForm {...this.props} />}
        </div>
      </div>
    );
  }
}