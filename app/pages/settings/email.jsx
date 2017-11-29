import React from 'react';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';
import apiClient from 'panoptes-client/lib/api-client';
import talkClient from 'panoptes-client/lib/talk-client';
import AutoSave from '../../components/auto-save';
import handleInputChange from '../../lib/handle-input-change';

counterpart.registerTranslations('en', {
  zooPrefs: {
    general: 'Get general Zooniverse email updates',
    classify: 'Get email updates from the Projects you classify on',
    beta: 'Get beta project email updates and become a beta tester'
  },
  talkPrefs: {
    title: 'Send me an email',
    frequency: {
      immediate: 'Immediately',
      day: 'Daily',
      week: 'Weekly',
      never: 'Never'
    }
  }
});

class EmailSettingsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      projects: [],
      projectPreferences: [],
      talkPreferences: []
    };
    this.handleProjectPreferenceChange = this.handleProjectPreferenceChange.bind(this);
    this.handleTalkPreferenceChange = this.handleTalkPreferenceChange.bind(this);
    this.getProjectForPreferences(props.user);
    this.getTalkPreferences();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.page !== prevState.page) {
      this.getProjectForPreferences(prevProps.user);
    }
  }

  getTalkPreferences() {
    talkClient.type('subscription_preferences').get()
    .then((preferences) => {
      this.setState({
        talkPreferences: preferences
      });
    });
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
          this.setState({
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

  handleProjectPreferenceChange(index, event) {
    const { projectPreferences } = this.state;
    projectPreferences[index].update({
      email_communication: !!event.target.checked
    })
    .save()
    .then((updatedPref) => {
      projectPreferences[index] = updatedPref;
      this.setState({ projectPreferences });
    });
  }

  handleTalkPreferenceChange(index, event) {
    const { talkPreferences } = this.state;
    talkPreferences[index].update({
      email_digest: event.target.value
    })
    .save()
    .then((updatedPref) => {
      talkPreferences[index] = updatedPref;
      this.setState({ talkPreferences });
    });
  }

  nameOfPreference(preference) {
    const options = {
      participating_discussions: 'When discussions I\'m participating in are updated',
      followed_discussions: 'When discussions I\'m following are updated',
      mentions: 'When I\'m mentioned',
      group_mentions: 'When I\'m mentioned by group (this.admins, this.team, etc)',
      messages: 'When I receive a private message',
      started_discussions: 'When a discussion is started in a board I\'m following'
    };
    return options[preference.category];
  }

  renderProjectPreferences() {
    const { projects, projectPreferences } = this.state;
    return projectPreferences.map((projectPreference, i) => {
      if (projects[i]) {
        return (
          <tr key={projectPreference.id}>
            <td>
              <input
                type="checkbox"
                name="email_communication"
                checked={projectPreference.email_communication}
                onChange={this.handleProjectPreferenceChange.bind(this, i)}
              />
            </td>
            <td>
              {projects[i].display_name}
            </td>
          </tr>
        );
      }
    });
  }

  renderPagination() {
    const { meta, page } = this.state;
    if (meta) {
      return (
        <nav className="pagination">{'Page'}
          <select
            value={page}
            disabled={meta.page_count < 2}
            onChange={e => this.setState({ page: e.target.value })}
          >
            {Array.from(Array(meta.page_count), (p, i) => {
              return <option key={i} value={i + 1}>{i + 1}</option>;
            })}
          </select> {' of '} {meta.page_count || '?'}
        </nav>
      );
    }
  }

  renderTalkPreferences() {
    const { talkPreferences } = this.state;
    const sortedPrefs = this.sortPreferences(talkPreferences);
    return (
      (sortedPrefs.length > 0) ?
        <tbody>
          {sortedPrefs.map((pref, i) => {
            if (pref.category !== 'system' && pref.category !== 'moderation_reports') {
              return (
                <tr key={pref.id}>
                  <td>{this.nameOfPreference(pref)}</td>
                  {this.talkPreferenceOption(pref, i, 'immediate')}
                  {this.talkPreferenceOption(pref, i, 'daily')}
                  {this.talkPreferenceOption(pref, i, 'weekly')}
                  {this.talkPreferenceOption(pref, i, 'never')}
                </tr>
              );
            }
          })}
        </tbody> :
        <tbody />
    );
  }

  talkPreferenceOption(preference, index, digest) {
    return (
      <td className="option">
        <input
          type="radio"
          name={preference.category}
          value={digest}
          checked={preference.email_digest === digest}
          onChange={this.handleTalkPreferenceChange.bind(this, index)}
        />
      </td>
    );
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
              <Translate content="zooPrefs.general" />
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
              <Translate content="zooPrefs.classify" />
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
              <Translate content="zooPrefs.beta" />
            </label>
          </AutoSave>
        </p>

        <p><strong>Talk email preferences</strong></p>
        <table className="talk-email-preferences">
          <thead>
            <tr>
              <Translate component="th" content="talkPrefs.title" />
              <Translate component="th" content="talkPrefs.frequency.immediate" />
              <Translate component="th" content="talkPrefs.frequency.day" />
              <Translate component="th" content="talkPrefs.frequency.week" />
              <Translate component="th" content="talkPrefs.frequency.never" />
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
            <tr>
              <td colSpan="2">
                {this.renderPagination()}
              </td>
            </tr>
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
