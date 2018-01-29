import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';
import { Markdown } from 'markdownz';
import Translate from 'react-translate-component';
import getSubjectLocation from '../../../lib/get-subject-location.coffee';
import Thumbnail from '../../../components/thumbnail';
import FinishedBanner from '../finished-banner';
import ProjectMetadata from './metadata';
import ProjectHomeWorkflowButtons from './home-workflow-buttons';
import TalkStatus from './talk-status';
import ProjectNavbar from '../project-navbar';
import ProjectNavbarFacelift from '../components/ProjectNavbar';

const ProjectHomePage = (props) => {
  const avatarSrc = props.researcherAvatar || '/assets/simple-avatar.png';

  const descriptionClass = classnames(
    'project-home-page__description',
    { 'project-home-page__description--top-padding': !props.organization }
  );

  const renderTalkSubjectsPreview = props.talkSubjects.length > 2;

  // As this is a functional component, we don't have access to the router via
  // props, so we just check the URL direct.
  const params = (new URL(document.location)).searchParams;
  const facelift = params.get('facelift');
  const NavbarComponent = (facelift) ? ProjectNavbarFacelift : ProjectNavbar;

  return (
    <div className="project-home-page">
      <div className="project-page project-background" style={{ backgroundImage: `radial-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.8)), url(${props.background.src})` }}>
        <NavbarComponent {...props} />

        {props.projectIsComplete &&
          (<div className="project-home-page__finished-banner-container">
            <FinishedBanner project={props.project} />
          </div>)}

        {props.project.configuration && props.project.configuration.announcement &&
          (<div className="informational project-announcement-banner">
            <Markdown>{props.project.configuration.announcement}</Markdown>
          </div>)}

        {props.organization &&
          <Link
            to={`/organizations/${props.organization.slug}`}
            className="project-home-page__organization"
          >
            <Translate content="project.home.organization" />: {props.organization.display_name}
          </Link>}

        <div className={descriptionClass}>
          {props.translation.description}
        </div>

        <div className="project-home-page__call-to-action">
          {props.project && !props.project.redirect &&
            <Link to={`/projects/${props.project.slug}/about`} className="project-home-page__button call-to-action__button call-to-action__button--learn-more">
              <Translate content="project.home.learnMore" />
            </Link>}
          {!props.showWorkflowButtons && props.project && !props.project.redirect &&
            <Link
              to={`/projects/${props.project.slug}/classify`}
              className="project-home-page__button call-to-action__button call-to-action__button--get-started"
            >
              <Translate content="project.home.getStarted" />
            </Link>}
          {props.project && props.project.redirect &&
            <a href={props.project.redirect} className="project-home-page__button">
              <strong><Translate content="project.home.visitLink" /></strong>
              <i className="fa fa-external-link" />
            </a>}
        </div>
        {!props.project.launch_approved &&
          <Translate
            component="p"
            className="project-disclaimer"
            content="project.disclaimer"
          />}
        <ProjectHomeWorkflowButtons
          activeWorkflows={props.activeWorkflows}
          onChangePreferences={props.onChangePreferences}
          preferences={props.preferences}
          project={props.project}
          projectIsComplete={props.projectIsComplete}
          showWorkflowButtons={props.showWorkflowButtons}
          workflowAssignment={props.project.experimental_tools.includes('workflow assignment')}
          splits={props.splits}
          user={props.user}
        />
      </div>

      {renderTalkSubjectsPreview && (
        <div className="project-home-page__container">
          {props.talkSubjects.map((subject) => {
            const location = getSubjectLocation(subject);
            return (
              <div className="project-home-page__talk-image" key={subject.id}>
                <Link to={`/projects/${props.project.slug}/talk/subjects/${subject.id}`} >
                  <Thumbnail
                    alt=""
                    controls={false}
                    format={location.format}
                    height={240}
                    src={location.src}
                    width={600}
                  />
                </Link>
              </div>
            );
          })}
          <TalkStatus
            project={props.project}
            translation={props.translation}
          />
        </div>
      )}

      <ProjectMetadata
        project={props.project}
        activeWorkflows={props.activeWorkflows}
        showTalkStatus={!renderTalkSubjectsPreview}
        translation={props.translation}
      />

      <div className="project-home-page__container">
        {props.project.researcher_quote && (
          <div className="project-home-page__researcher-words">
            <h4 className="project-home-page__small-header"><Translate content="project.home.researcher" /></h4>

            <div>
              <img role="presentation" src={avatarSrc} />
              <span>&quot;{props.translation.researcher_quote}&quot;</span>
            </div>
          </div>)}

        <div className="project-home-page__about-text">
          <h4 className="project-home-page__small-header">
            <Translate
              content="project.home.about"
              with={{
                title: props.translation.display_name
              }}
            />
          </h4>
          {props.project.introduction &&
            <Markdown project={props.project}>
              {props.translation.introduction}
            </Markdown>}
        </div>
      </div>
    </div>
  );
};

ProjectHomePage.contextTypes = {
  user: PropTypes.object
};

ProjectHomePage.defaultProps = {
  activeWorkflows: [],
  onChangePreferences: () => {},
  organization: null,
  preferences: {},
  project: {},
  projectIsComplete: false,
  showWorkflowButtons: false,
  splits: {},
  talkSubjects: [],
  user: null
};

ProjectHomePage.propTypes = {
  activeWorkflows: PropTypes.arrayOf(PropTypes.object).isRequired,
  background: PropTypes.shape({
    src: PropTypes.string
  }).isRequired,
  onChangePreferences: PropTypes.func.isRequired,
  organization: PropTypes.shape({
    display_name: PropTypes.string,
    slug: PropTypes.string
  }),
  preferences: PropTypes.object,
  project: PropTypes.shape({
    configuration: PropTypes.object,
    description: PropTypes.string,
    display_name: PropTypes.string,
    experimental_tools: PropTypes.arrayOf(PropTypes.string),
    id: PropTypes.string,
    introduction: PropTypes.string,
    redirect: PropTypes.string,
    researcher_quote: PropTypes.string,
    slug: PropTypes.string
  }).isRequired,
  projectIsComplete: PropTypes.bool.isRequired,
  researcherAvatar: PropTypes.string,
  showWorkflowButtons: PropTypes.bool,
  splits: PropTypes.object,
  talkSubjects: PropTypes.arrayOf(PropTypes.object),
  translation: PropTypes.shape({
    description: PropTypes.string,
    display_name: PropTypes.string,
    introduction: PropTypes.string,
    researcher_quote: PropTypes.string,
    title: PropTypes.string
  }).isRequired,
  user: PropTypes.object
};

export default ProjectHomePage;
