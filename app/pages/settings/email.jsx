import React from 'react';
import Translate from 'react-translate-component';
import apiClient from 'panoptes-client/lib/api-client';
import talkClient from 'panoptes-client/lib/talk-client';
import AutoSave from '../../components/auto-save';
import handleInputChange from '../../lib/handle-input-change';

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
                  <Translate component="td" content={`emailSettings.talk.options.${pref.category}`} />
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
              <Translate content="emailSettings.email" />
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
        <p>
          <strong>
            <Translate content="emailSettings.general.section" />
          </strong>
        </p>
        <p>
          <AutoSave resource={this.props.user}>
            <label>
              <input
                type="checkbox"
                name="global_email_communication"
                checked={this.props.user.global_email_communication}
                onChange={handleInputChange.bind(this.props.user)}
              />{' '}
              <Translate content="emailSettings.general.updates" />
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
              <Translate content="emailSettings.general.classify" />
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
              <Translate content="emailSettings.general.beta" />
            </label>
          </AutoSave>
        </p>

        <p>
          <strong>
            <Translate content="emailSettings.talk.section" />
          </strong>
        </p>
        <table className="talk-email-preferences">
          <thead>
            <tr>
              <Translate component="th" content="emailSettings.talk.header" />
              <Translate component="th" content="emailSettings.talk.frequency.immediate" />
              <Translate component="th" content="emailSettings.talk.frequency.day" />
              <Translate component="th" content="emailSettings.talk.frequency.week" />
              <Translate component="th" content="emailSettings.talk.frequency.never" />
            </tr>
          </thead>
          {this.renderTalkPreferences()}
        </table>

        <p>
          <strong>
            <Translate content="emailSettings.project.section" />
          </strong>
        </p>
        <table>
          <thead>
            <tr>
              <th>
                <i className="fa fa-envelope-o fa-fw" />
              </th>
              <Translate component="th" content="emailSettings.project.header" />
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
