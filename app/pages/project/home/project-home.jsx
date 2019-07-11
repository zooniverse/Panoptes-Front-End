import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';
import { Markdown } from 'markdownz';
import Translate from 'react-translate-component';
import { VisibilitySplit } from 'seven-ten';

import getSubjectLocations from '../../../lib/get-subject-locations';
import Thumbnail from '../../../components/thumbnail';
import FinishedBanner from '../finished-banner';
import ProjectMetadata from './metadata';
import ProjectHomeWorkflowButtons from './home-workflow-buttons';
import TalkStatus from './talk-status';
import ExternalLinksBlock from '../../../components/ExternalLinksBlock';

const ProjectHomePage = (props) => {
  const projectIsNotRedirected = props.project && !props.project.redirect;
  const canClassify = props.project.links.active_workflows && props.project.links.active_workflows.length > 0;
  const avatarSrc = props.researcherAvatar || '/assets/simple-avatar.png';

  const descriptionClass = classnames(
    'project-home-page__description',
    { 'project-home-page__description--top-padding': !props.organization }
  );

  const renderTalkSubjectsPreview = props.talkSubjects.length > 2;

  let backgroundStyle = {};
  if (props.background) {
    backgroundStyle = {
      backgroundImage: `radial-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.8)), url('${props.background.src}')`
    };
  }

  const showGetStartedLink = (!props.showWorkflowButtons && projectIsNotRedirected) || props.splits['workflow.assignment']

  return (
    <div className="project-home-page">
      <div className="project-page project-background" style={backgroundStyle}>

        {props.projectIsComplete &&
          (<div className="project-home-page__finished-banner-container">
            <FinishedBanner project={props.project} />
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
          {projectIsNotRedirected &&
            <Link to={`/projects/${props.project.slug}/about`} className="project-home-page__button call-to-action__button call-to-action__button--learn-more">
              <Translate content="project.home.learnMore" />
            </Link>}
          {canClassify && showGetStartedLink &&
            <VisibilitySplit splits={props.splits} splitKey='workflow.assignment' elementKey='link'>
              <Link
                to={`/projects/${props.project.slug}/classify`}
                className="project-home-page__button call-to-action__button call-to-action__button--get-started"
              >
                <Translate content="project.home.getStarted" />
              </Link>
            </VisibilitySplit>}
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
        <VisibilitySplit splits={props.splits} splitKey='workflow.assignment' elementKey='div'>
          <ProjectHomeWorkflowButtons
            activeWorkflows={props.activeWorkflows}
            preferences={props.preferences}
            project={props.project}
            projectIsComplete={props.projectIsComplete}
            showWorkflowButtons={props.showWorkflowButtons}
            workflowAssignment={props.project.experimental_tools.includes('workflow assignment')}
            splits={props.splits}
            translation={props.translation}
            user={props.user}
          />
        </VisibilitySplit>
      </div>

      {renderTalkSubjectsPreview && (
        <div className="project-home-page__container">
          {props.talkSubjects.map((subject) => {
            const locations = getSubjectLocations(subject);
            let format = '';
            let src = '';
            let type = '';
            if (locations.image) {
              type = 'image';
              [format, src] = locations.image;
            } else if (locations.video) {
              type = 'video';
              [format, src] = locations.video;
            }
            return (
              <div className="project-home-page__talk-image" key={subject.id}>
                <Link to={`/projects/${props.project.slug}/talk/subjects/${subject.id}`} >
                  <Thumbnail
                    alt=""
                    controls={false}
                    type={type}
                    format={format}
                    height={240}
                    src={src}
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
            <Translate className="project-home-page__small-header" content="project.home.researcher" component="h4" />

            <div className="researcher-words__wrapper">
              <img className="researcher-words__avatar" role="presentation" src={avatarSrc} alt="The researcher" />
              <p className="researcher-words__quote">&quot;{props.translation.researcher_quote}&quot;</p>
            </div>
          </div>)}

        <div className="project-home-page__about-text" style={(props.project.researcher_quote && props.project.urls && props.project.urls.length > 0) ? { flexBasis: '33.333%' } : { flexBasis: '66.666%' }}>
          <Translate
            className="project-home-page__small-header"
            content="project.home.about"
            component="h4"
            with={{
              title: props.translation.display_name
            }}
          />
          {props.project.introduction &&
            <Markdown project={props.project}>
              {props.translation.introduction}
            </Markdown>}
        </div>
        <ExternalLinksBlock
          header={<Translate className="project-home-page__small-header" component="h4" content="project.home.links" />}
          resource={props.project}
        />
      </div>
    </div>
  );
};

ProjectHomePage.contextTypes = {
  user: PropTypes.object
};

ProjectHomePage.defaultProps = {
  activeWorkflows: [],
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
    slug: PropTypes.string,
    urls: PropTypes.arrayOf(PropTypes.object)
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
