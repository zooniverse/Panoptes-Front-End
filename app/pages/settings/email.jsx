import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import talkClient from 'panoptes-client/lib/talk-client';
import AutoSave from '../../components/auto-save';
import handleInputChange from '../../lib/handle-input-change';

class EmailSettingsPage extends React.Component {
  constructor(props) {
    super(props);
    console.log(props)
    this.state = {
      page: 1,
      projects: [],
      projectPreferences: []
    };
    this.handlePreferenceChange = this.handlePreferenceChange.bind(this);
    this.nameOfPreference = this.nameOfPreference.bind(this);
    this.sortPreferences = this.sortPreferences.bind(this);
    this.talkPreferenceOption = this.talkPreferenceOption.bind(this);
    this.getProjectForPreferences(props.user);
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.state.page === prevState.page) {
      this.getProjectForPreferences();
    }
  }

  getProjectForPreferences(user) {
    return user.get('project_preferences', {
      page: this.state.page,
      sort: 'display_name'
    })
    .then((preferences) => {
      if (preferences.length > 0) {
        const projectIDs = preferences.map(pref => pref.links.project);
        apiClient.type('projects').get({
          id: projectIDs
        })
        .then((projects) => {
          return this.setState({
            meta: preferences[0].getMeta(),
            projectPreferences: preferences,
            projects
          });
        });
      }
    })
    .catch((error) => {
      console.log('Something went wrong. Error: ', error);
    });
  }

  handleProjectEmailChange(projectPreference, args) {
    handleInputChange.apply(projectPreference, args);
    projectPreference.save();
    this.setState();
  }

  handlePreferenceChange(preference, event) {
    return preference.update({
      email_digest: event.target.value
    })
    .save();
  }

  nameOfPreference(preference) {
    switch (preference.category) {
      case 'participating_discussions':
        'When discussions I\'m participating in are updated';
        break;
      case 'followed_discussions':
        'When discussions I\'m following are updated';
        break;
      case 'mentions':
        'When I\'m mentioned';
        break;
      case 'group_mentions':
        'When I\'m mentioned by group (this.admins, this.team, etc)';
        break;
      case 'messages':
        'When I receive a private message';
        break;
      case 'started_discussions':
        'When a discussion is started in a board I\'m following';
        break;
      default:
        'nope';

    }
  }

  renderProjectPreferences() {
    const { projects, projectPreferences } = this.state;
    return projectPreferences.map((projectPreference, i) => {
      if (projects[i]) {
        return (
          <tr key={i}>
            <td>
              <input
                type="checkbox"
                name="email_communication"
                checked={projectPreference.email_communication}
                onChange={this.handleProjectEmailChange.bind(this, projectPreference)}
              />
            </td>
            <td>
              {projects[i].display_name}
            </td>
            <td colSpan="2">
              {this.renderPagination()}
            </td>
          </tr>
        );
      }
    });
  }

  renderTalkPreferences() {
    return talkClient.type('subscription_preferences').get()
      .then((preferences) => {
        const sortedPrefs = this.sortPreferences(preferences);
        (preferences.length > 0) ?
          <tbody>
            {sortedPrefs.map((pref) => {
              if (pref.category !== 'system' && pref.category !== 'moderation_reports') {
                return (
                  <tr key={pref.id}>
                    <td>{this.nameOfPreference(pref)}</td>
                    {this.talkPreferenceOption(pref, 'immediate')}
                    {this.talkPreferenceOption(pref, 'daily')}
                    {this.talkPreferenceOption(pref, 'weekly')}
                    {this.talkPreferenceOption(pref, 'never')}
                  </tr>
                );
              }
            })}
          </tbody> :
          <tbody />;
      });
  }

  talkPreferenceOption(preference, digest) {
    return (
      <td className="option">
        <input
          type="radio"
          name={preference.category}
          value={digest}
          checked={preference.email_digest === digest}
          onChange={this.handlePreferenceChange.bind(this, preference)}
        />
      </td>
    );
  }

  renderPagination() {
    if (this.state.meta) {
      return (
        <nav className="pagination">{'Page'}
          {(this.state.meta.page_count) ?
            <select
              value={this.state.page}
              disabled={this.state.meta.page_count < 2}
              onChange={e => this.setState({ page: e.target.value })}
            >
              {[this.state.meta.page_count].forEach(p => <option key={p} value={p}>{p}</option>)}
            </select> :
            '?'
          }
        </nav>
      );
    }
  }

  sortPreferences(preferences) {
    const order = [
      'participating_discussions',
      'followed_discussions',
      'started_discussions',
      'mentions', 'group_mentions',
      'messages'
    ];
    return preferences.sort((a, b) => {
      return order.indexOf(a.category) > order.indexOf(b.category);
    });
  }

  render() {
    return (
      <div className="content-container">
        <p>
          <AutoSave resource={this.props.user}>
            <span className="form-label">
              Email address
            </span>
            <br />
            <input
              type="text"
              className="standard-input full"
              name="email"
              value={this.props.user.email}
              onChange={handleInputChange.bind(this.props.user)}
            />
          </AutoSave>
        </p>
        <p><strong>Zooniverse email preferences</strong></p>
        <p>
          <AutoSave resource={this.props.user}>
            <label>
              <input
                type="checkbox"
                name="global_email_communication"
                checked={this.props.user.global_email_communication}
                onChange={handleInputChange.bind(this.props.user)}
              />{' '}
              Get general Zooniverse email updates
            </label>
          </AutoSave>
          <br />
          <AutoSave resource={this.props.user}>
            <label>
              <input
                type="checkbox"
                name="project_email_communication"
                checked={this.props.user.project_email_communication}
                onChange={handleInputChange.bind(this.props.user)}
              />{' '}
              Get email updates from the Projects you classify on
            </label>
          </AutoSave>
          <br />
          <AutoSave resource={this.props.user}>
            <label>
              <input
                type="checkbox"
                name="beta_email_communication"
                checked={this.props.user.beta_email_communication}
                onChange={handleInputChange.bind(this.props.user)}
              />{' '}
              Get beta project email updates and become a beta tester
            </label>
          </AutoSave>
        </p>

        <p><strong>Talk email preferences</strong></p>
        <table className="talk-email-preferences">
          <thead>
            <tr>
              <th>Send me an email</th>
              <th>Immediately</th>
              <th>Daily</th>
              <th>Weekly</th>
              <th>Never</th>
            </tr>
          </thead>
          {this.renderTalkPreferences()}
        </table>

        <p><strong>Project email preferences</strong></p>
        <table>
          <thead>
            <tr>
              <th>
                <i className="fa fa-envelope-o fa-fw" />
              </th>
              <th>Project</th>
            </tr>
          </thead>
          <tbody>
            {this.renderProjectPreferences(this.state.projectPreferences)}
          </tbody>
        </table>
      </div>
    );
  }
}

EmailSettingsPage.defaultProps = {
  user: null
};

EmailSettingsPage.propTypes = {
  user: React.PropTypes.shape({
    get: React.PropTypes.func
  })
};

export default EmailSettingsPage;
