/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const React = require('react');
const createReactClass = require('create-react-class');
const {Link} = require('react-router');
const AutoSave = require('../../components/auto-save');
const handleInputChange = require('../../lib/handle-input-change').default;
const ImageSelector = require('../../components/image-selector');
const apiClient = require('panoptes-client/lib/api-client');
const putFile = require('../../lib/put-file').default;
const TagSearch = require('../../components/tag-search');
const {MarkdownEditor, MarkdownHelp} = require('markdownz');
const alert = require('../../lib/alert').default;
const Select = require('react-select').default;
const getAllLinked = require('../../lib/get-all-linked').default;
const { usesPFEClassifier } = require('../../monorepoUtils');

import DISCIPLINES from '../../constants/disciplines';
import CharLimit from '../../components/char-limit';
import ExternalLinksEditor from './external-links-editor';
import SocialLinksEditor from './social-links-editor';
import DisplayNameSlugEditor from '../../partials/display-name-slug-editor';
import sanitizeArrayInput from '../../lib/sanitize-array-input';

const MAX_AVATAR_SIZE = 64000;
const MAX_BACKGROUND_SIZE = 256000;

const DISCIPLINE_NAMES = (Array.from(DISCIPLINES).map((discipline) => discipline.value));

// Get organizations linked to this project.
// In 2026, projects started to support multiple linked organizations.
// - Previously, it would be project.links.organization = "123" (or null).
// - Now, it's project.links.organizations = ["123"] (or [])
// - That's organization(S), plural.
//
// Input: project resource.
// Output: array containing IDs of linked organizations, e.g. ["123", "456"]
function getLinkedOrganizations (project) {
  if (Array.isArray(project?.links?.organizations)) return project.links.organizations;
  if (project?.links?.organization) return [project?.links?.organization];  // Fallback, only required during the 2026 transition period.
  return []
}

class EditProjectDetails extends React.Component {
  constructor (props) {
    super(props)

    const {disciplineTagList, otherTagList} = this.splitTags();
    this.state = {
      disciplineTagList,
      otherTagList,
      researchers: [],
      avatar: null,
      background: null,
      organizations: [],
      error: null
    };
  }

  componentWillMount() {
    getAllLinked(this.props.project, 'project_roles').then(roles => {
      const scientists = Array.from(roles).filter((role) => Array.from(role.roles).includes('scientist') || Array.from(role.roles).includes('owner')).map((role) =>
        role.links.owner.id);
      return apiClient.type('users').get(scientists).then(researchers => {
        return this.setState({ researchers });
      });
    });

    // Fetch linked organizations.
    let linkedOrganizations = getLinkedOrganizations(this.props.project)
    if (linkedOrganizations.length > 0) {
      apiClient.type('organizations').get({ id: linkedOrganizations.join(',') }).then(orgs => {
        return this.setState({ organizations: orgs });
      });
    }

    this.updateImage('avatar');
    return this.updateImage('background');
  }

  updateImage(type) {
    return this.props.project.get(type)
      .then(image => {
        return this.setState({
          [type]: image});
    }).catch(error => {
        return console.log(error);
    });
  }

  splitTags(kind) {
    const disciplineTagList = [];
    const otherTagList = [];
    for (let tag of Array.from(this.props.project.tags)) {
      if (Array.from(DISCIPLINE_NAMES).includes(tag)) {
        disciplineTagList.push(tag);
      } else {
        otherTagList.push(tag);
      }
    }
    return {disciplineTagList, otherTagList};
  }

  researcherOptions() {
    const options = [];
    for (let researcher of Array.from(this.state.researchers)) {
      options.push(Object.assign({value: researcher.id, label: researcher.display_name}));
    }
    options.push(Object.assign({value: this.props.project.display_name, label: `${this.props.project.display_name} Avatar`}));
    return options;
  }

  render() {
    // Failures on media GETs are acceptable here,
    // but the JSON-API lib doesn't cache failed requests,
    // so do it manually:
    let checked;
    const avatarPlaceholder = <div className="form-help content-container">Drop an avatar image here</div>;
    const backgroundPlaceholder = <div className="form-help content-container">Drop a background image here</div>;
    const linkedOrganizations = getLinkedOrganizations(this.props.project)

    return (
      <div>
        <p className="form-help">Input the basic information about your project, and set up its home page.</p>
        <div className="columns-container">
          <div>
            Avatar<br />
            <ImageSelector maxSize={MAX_AVATAR_SIZE} ratio={1} src={this.state.avatar?.src} placeholder={avatarPlaceholder} onChange={this.handleMediaChange.bind(this, 'avatar')} />
            {this.state.error ?
              <div className="form-help error">{this.state.error.toString()}</div> : undefined}

            <p><small className="form-help">Pick a logo to represent your project. To add an image, either drag and drop or click to open your file viewer. For best results, use a square image of not more than 50 KB.</small></p>

            {/*
            Show a preview of the logo, but in circular form.
            The style here should match the FEM project logo, e.g. on https://www.zooniverse.org/projects/darkeshard/test-project-2022
            In practice, the BACKGROUND matters since the project header uses a background image if available, but we'll just use a teal background here, just to have some contrast for projects with transparent logos.
            (Projects shouldn't have transparent logos.)
            */}
            {(this.state.avatar?.src) && (
              <div>
                <p><small className="form-help">Your image will also be displayed as a circular logo on the project page. This is an example of how it will look like:</small></p>
                <div
                  style={{
                    background: 'rgb(0, 151, 157)',
                    borderRadius: '5px',
                    padding: '1em'
                  }}
                >
                  <img
                    style={{
                      borderRadius: '100%',
                      boxShadow: 'rgba(0, 0, 0, 0.22) 5px 10px 20px',
                      objectFit: 'cover',
                      overflow: 'hidden',
                      width: '80px',

                      display: 'block',
                      margin: '0 auto',
                    }}
                    src={this.state.avatar?.src}
                    alt='Preview of project avatar cropped to a circle'
                  />
                </div>
              </div>
            )}

            <hr />

            Background image<br />
            <ImageSelector maxSize={MAX_BACKGROUND_SIZE} src={this.state.background?.src} placeholder={backgroundPlaceholder} onChange={this.handleMediaChange.bind(this, 'background')} />
            {this.state.error ?
              <div className="form-help error">{this.state.error.toString()}</div> : undefined}

            <p><small className="form-help">This image will be the background for all of your project pages, including your project’s front page. To add an image, either drag and drop or left click to open your file viewer. For best results, use good quality images no more than 256 KB.</small></p>

            <hr />

            {usesPFEClassifier(this.props.project.slug) ? <p>
              <AutoSave tag="label" resource={this.props.project}>
                {(checked = this.props.project.configuration?.user_chooses_workflow)}
                <input type="checkbox" name="configuration.user_chooses_workflow" defaultChecked={checked} defaultValue={checked} onChange={handleInputChange.bind(this.props.project)}/>{' '}
                Volunteers can choose which workflow they work on
              </AutoSave>
              <br />
              <small className="form-help">If you have multiple workflows, check this to let volunteers select which workflow they want to to work on; otherwise, they’ll be served randomly.</small>
            </p> :
              null
            }
          </div>

          <div className="column">
            
            {linkedOrganizations.length > 0 && (
              <div>
                {this.state.organizations.length === linkedOrganizations.length ? (
                  <p>
                    This project is part of the following {this.state.organizations.length > 1 ? 'organizations' : 'organization'}:&nbsp;
                    <span>
                      {this.state.organizations.map(org => (
                        <Link style={{ marginLeft: '0.25em' }} key={`org-${org.slug}`} to={`/organizations/${org.slug}`}>{org.display_name}</Link>
                      ))}
                    </span>
                  </p>
                ) : (
                  <p><i>Fetching linked organization data...</i></p>
                )}
                <p>If you are not a collaborator on the organization, please coordinate with this project's other collaborators for additional information regarding the affiliated organization.</p>
              </div>
            )}

            <DisplayNameSlugEditor resource={this.props.project} resourceType="project" />

            <p>
              <AutoSave resource={this.props.project}>
                <label for="description" className="form-label">Description</label>
                <input id="description" className="standard-input full" name="description" value={this.props.project.description} onChange={handleInputChange.bind(this.props.project)} />
              </AutoSave>
              <small className="form-help">This should be a one-line call to action for your project that displays on your landing page. Some volunteers will decide whether to try your project based on reading this, so try to write short text that will make people actively want to join your project. <CharLimit limit={300} string={this.props.project.description != null ? this.props.project.description : ''} /></small>
            </p>

            <div>
              <AutoSave resource={this.props.project}>
                <span className="form-label">Introduction</span>
                <br />
                <MarkdownEditor className="full" name="introduction" rows="10" value={this.props.project.introduction} project={this.props.project} onChange={handleInputChange.bind(this.props.project)} onHelp={() => alert(<MarkdownHelp/>)}/>
              </AutoSave>
              <small className="form-help">Add a brief introduction to get people interested in your project. This will display on your landing page. <CharLimit limit={1500} string={this.props.project.introduction != null ? this.props.project.introduction : ''} /></small>
            </div>

            <p>
              <AutoSave resource={this.props.project}>
                <label for="workflowDescription" className="form-label">Workflow Description</label>
                <textarea id="workflowDescription" className="standard-input full" name="workflow_description" value={this.props.project.workflow_description} onChange={handleInputChange.bind(this.props.project)} />
              </AutoSave>
              <small className="form-help">Add text here when you have multiple workflows and want to help your volunteers decide which one they should do. <CharLimit limit={500} string={this.props.project.workflow_description != null ? this.props.project.workflow_description : ''} /></small>
            </p>

            <div>
              <AutoSave resource={this.props.project}>
                <label for="researcherQuote" className="form-label">Researcher Quote</label>
                <Select
                  className="researcher-quote"
                  placeholder="Choose a Researcher"
                  onChange={this.handleResearcherChange}
                  options={this.researcherOptions()}
                  value={this.props.project?.configuration?.researcherID} />
                <textarea id="researcherQuote" className="standard-input full" name="researcher_quote" value={this.props.project.researcher_quote} onChange={handleInputChange.bind(this.props.project)} />
              </AutoSave>
              <small className="form-help">This text will appear on a project landing page alongside an avatar of the selected researcher. <CharLimit limit={255} string={this.props.project.researcher_quote != null ? this.props.project.researcher_quote : ''} /></small>
            </div>

            <div>
              <AutoSave resource={this.props.project}>
                <span className="form-label">Announcement Banner</span>
                <br />
                <MarkdownEditor className="full" name="configuration.announcement" rows="2" value={this.props.project.configuration?.announcement} project={this.props.project} onChange={handleInputChange.bind(this.props.project)} onHelp={() => alert(<MarkdownHelp/>)}/>
              </AutoSave>
              <small className="form-help">This text will appear as a banner at the top of all your project's pages. Only use this when you've got a big important announcement to make!</small>
            </div>

            <div>
              <AutoSave resource={this.props.project}>
                <span className="form-label">Discipline Tag</span>
                <br />
                <Select
                  ref="disciplineSelect"
                  name="disciplines"
                  placeholder="Add Discipline Tag"
                  className="discipline-tag"
                  value={this.state.disciplineTagList}
                  options={DISCIPLINES}
                  multi={true}
                  onChange={this.handleDisciplineTagChange}
                />
                <small className="form-help">Enter or select one or more discipline tags to identify which field(s) of research your project belongs to. These tags will determine the categories your project will appear under on the main Zooniverse projects page, if your project becomes a full Zooniverse project. </small>
                <br />
              </AutoSave>
              <AutoSave resource={this.props.project}>
                <span className="form-label">Other Tags</span>
                <br />
                <TagSearch name="tags" multi={true} value={this.state.otherTagList} onChange={this.handleOtherTagChange} />
              </AutoSave>
              <small className="form-help">Enter a list of additional tags to describe your project separated by commas to help users find your project.</small>
            </div>

            <div>
              External links<br />
              <small className="form-help">
                Adding an external link will populate an entry in a list of links
                in the bottom right section of the project landing page. You can rearrange the
                displayed order by clicking and dragging on the left gray tab next
                to each link.
              </small>
              <br />
              <small className="form-help">
                The URL must begin with "<code>https://</code>" or "<code>http://</code>".
              </small>
              <ExternalLinksEditor project={this.props.project} />
              <div className="edit-social-links">
                <h5>Social Links Section</h5>
                <small className="form-help">
                  A specialized form of an external link, adding a social link
                  will populate an entry in the list of links in the bottom right
                  section of the project landing page that includes
                  service-specific icons. You can rearrange the displayed order by
                  clicking and dragging on the left gray tab next to each link,
                  but all social links follow after external links in the
                  displayed list.
                </small>
                <SocialLinksEditor project={this.props.project} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  handleDisciplineTagChange(options) {
    const newTags = options.map(option => option.value);
    const sanitizedTags = sanitizeArrayInput(newTags);
    this.setState({disciplineTagList: sanitizedTags});
    const allTags = sanitizedTags.concat(this.state.otherTagList);
    return this.handleTagChange(allTags);
  }

  handleResearcherChange(option) {
    this.props.project.update({
      'configuration.researcherID': option?.value || ""
    });
    return this.props.project.save();
  }

  handleOtherTagChange(options) {
    const newTags = options.map(option => option.value);
    const sanitizedTags = sanitizeArrayInput(newTags);
    this.setState({otherTagList: sanitizedTags});
    const allTags = this.state.disciplineTagList.concat(sanitizedTags);
    return this.handleTagChange(allTags);
  }

  handleTagChange(value) {
    const changes =
      {tags: value};
    return this.props.project.update(changes);
  }

  handleMediaChange(type, file) {
    const errorProp = `${type}Error`;

    let newState = {};
    newState[errorProp] = null;
    this.setState(newState);

    return apiClient.post(this.props.project._getURL(type), {media: {content_type: file.type}})
      .then(([resource]) => {
        return putFile(resource.src, file, {'Content-Type': file.type});
    })
      .then(() => {
        this.props.project.uncacheLink(type);
        this[`${type}Get`] = null; // Uncache the local request so that rerendering makes it again.
        return this.props.project.refresh();
    }).then(() => {
        this.props.project.emit('change'); // Re-render
        return this.updateImage(type);
      }).catch(error => {
        newState = {};
        newState[errorProp] = error;
        return this.setState(newState);
    });
  }
}

EditProjectDetails.defaultProps = {
  project: {}
};

export default EditProjectDetails;
