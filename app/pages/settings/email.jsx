import React from 'react';
import Translate from 'react-translate-component';
import apiClient from 'panoptes-client/lib/api-client';
import talkClient from 'panoptes-client/lib/talk-client';
import AutoSave from '../../components/auto-save';
import handleInputChange from '../../lib/handle-input-change';

function TalkPreferenceOption({ preference, index, digest, onChange }) {
  return (
    <td className="option">
      <input
        type="radio"
        name={preference.category}
        value={digest}
        checked={preference.email_digest === digest}
        onChange={e => onChange(index, e)}
      />
    </td>
  );
}

TalkPreferenceOption.propTypes = {
  digest: React.PropTypes.string.isRequired,
  index: React.PropTypes.number.isRequired,
  onChange: React.PropTypes.func,
  preference: React.PropTypes.shape({
    email_digest: React.PropTypes.string
  }).isRequired
};

function TalkPreferences(props) {
  const { talkPreferences, onChange } = props;
  return (
    (talkPreferences.length > 0) ?
      <tbody>
        {talkPreferences.map((pref, i) => {
          if (pref.category !== 'system' && pref.category !== 'moderation_reports') {
            return (
              <tr key={pref.id}>
                <Translate component="td" content={`emailSettings.talk.options.${pref.category}`} />
                <TalkPreferenceOption preference={pref} index={i} digest="immediate" onChange={onChange} />
                <TalkPreferenceOption preference={pref} index={i} digest="daily" onChange={onChange} />
                <TalkPreferenceOption preference={pref} index={i} digest="weekly" onChange={onChange} />
                <TalkPreferenceOption preference={pref} index={i} digest="never" onChange={onChange} />
              </tr>
            );
          } else {
            return null;
          }
        })}
      </tbody> :
      <tbody />
  );
}

TalkPreferences.propTypes = {
  onChange: React.PropTypes.func,
  talkPreferences: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
};

function ProjectPreferences({ projects, projectPreferences, onChange }) {
  return (
    <tbody>
      {projectPreferences.map((projectPreference, i) => {
        if (projects[i]) {
          return (
            <tr key={projectPreference.id}>
              <td>
                <input
                  type="checkbox"
                  name="email_communication"
                  checked={projectPreference.email_communication}
                  onChange={(e) => onChange(i, e)}
                />
              </td>
              <td>
                {projects[i].display_name}
              </td>
            </tr>
          );
        } else {
          return null;
        }
      })}
    </tbody>
  );
}

ProjectPreferences.propTypes = {
  projects: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  projectPreferences: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  onChange: React.PropTypes.func
};

function Pagination({ meta, page, onChange }) {
  if (meta) {
    return (
      <nav className="pagination">{'Page'}
        <select
          value={page}
          disabled={meta.page_count < 2}
          onChange={onChange}
        >
          {Array.from(Array(meta.page_count), (p, i) => {
            return <option key={i} value={i + 1}>{i + 1}</option>;
          })}
        </select> {' of '} {meta.page_count || '?'}
      </nav>
    );
  } else {
    return null;
  }
}

Pagination.propTypes = {
  meta: React.PropTypes.shape({
    page_count: React.PropTypes.number
  }),
  page: React.PropTypes.number,
  onChange: React.PropTypes.func
};

Pagination.defaultProps = {
  meta: {
    page_count: 1
  },
  page: 1
}

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
      const talkPreferences = this.sortPreferences(preferences);
      this.setState({ talkPreferences });
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
          <TalkPreferences talkPreferences={this.state.talkPreferences} onChange={this.handleTalkPreferenceChange} />
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
          <ProjectPreferences
              projects={this.state.projects}
            projectPreferences={this.state.projectPreferences}
            onChange={this.handleProjectPreferenceChange}
          />
          <tfoot>
            <tr>
              <td colSpan="2">
                <Pagination
                  meta={this.state.meta}
                  page={this.state.page}
                  onChange={e => this.setState({ page: parseInt(e.target.value, 10) })}
                />
              </td>
            </tr>
          </tfoot>
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
