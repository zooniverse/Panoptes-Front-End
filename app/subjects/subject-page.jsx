import PropTypes from 'prop-types';
import React from 'react';
import SubjectViewer from '../components/subject-viewer';
import ActiveUsers from '../talk/active-users';
import ProjectLinker from '../talk/lib/project-linker';
import SubjectCommentForm from './comment-form';
import SubjectCommentList from './comment-list';
import SubjectDiscussionList from './discussion-list';
import SubjectMentionList from './mention-list';
import SubjectCollectionList from './subject-collection-list';
import PopularTags from '../talk/popular-tags';

const SubjectPage = (props) => {
  return (
    <div className="subject-page talk">
      <div className="talk-list-content">
        <section>
          {props.subject &&
            <div>
              <h1>Subject {props.subject.id}</h1>
              <SubjectViewer
                subject={props.subject}
                user={props.user}
                project={props.project}
                linkToFullImage={true}
                metadataFilters={['#']}
                talkInvert={true}
                isFavorite={props.isFavorite}
              />

              <SubjectCommentList subject={props.subject} {...props} />
              <SubjectCollectionList collections={props.collections} {...props} />
              <SubjectDiscussionList subject={props.subject} {...props} />
              <SubjectMentionList subject={props.subject} {...props} />
              <SubjectCommentForm subject={props.subject} {...props} />
            </div>}
        </section>
        <div className="talk-sidebar">
          <section>
            {props.subject &&
              <PopularTags
                header={<h3>Popular Tags:</h3>}
                section={props.section}
                type="Subject"
                id={props.subject.id}
                project={props.project}
              />}
          </section>

          <section>
            <ActiveUsers section={props.section} project={props.project} />
          </section>

          <section>
            <h3>Projects:</h3>
            <ProjectLinker user={props.user} />
          </section>
        </div>
      </div>
    </div>
  );
};

SubjectPage.defaultProps = {
  isFavorite: false
};

SubjectPage.propTypes = {
  collections: PropTypes.arrayOf(PropTypes.object),
  isFavorite: PropTypes.bool,
  project: PropTypes.object,
  section: PropTypes.string,
  subject: PropTypes.shape({
    id: PropTypes.string
  }),
  user: PropTypes.object
};

export default SubjectPage;