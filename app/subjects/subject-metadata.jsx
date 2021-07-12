/*
Subject Metadata Component
--------------------------

The more accurate name for this component would be the "SELECTIVE subject
metadata display component".

- This component is meant to display certain additional information to the user,
  based on the TYPE of Subject.
- The earliest context for the feature comes with the Survos project (2021)
  which introduces "Subject Groups". In this case, we want to expose the
  individual Subjects that make the Subject Group.
- This does NOT replace the "Subject Metadata" button built into the
  Subject Viewer.

(shaun 20210709)
 */

import PropTypes from 'prop-types';
import React, { useState } from 'react';
import Loading from '../components/loading-indicator';

const SubjectMetadata = (props) => {
  const [expandSubjectGroup, setExpandSubjectGroup] = useState(props.expandSubjectGroup);
  
  if (props.project && props.subject) {
    const metadata = props.subject.metadata || {};
    
    // A "Subject Group" is a Subject that's a collection of other Subjects.
    const isSubjectGroup = metadata['#group_subject_ids'] && metadata['#subject_group_id'];
    let subjectGroupHtml = null;
    
    if (isSubjectGroup) {
      const projectSlug = props.project.slug || ''
      const subjects = (typeof metadata['#group_subject_ids'] === 'string')
        ? metadata['#group_subject_ids'].split('-')
        : [];
      
      subjectGroupHtml = (
        <div>
          <p>
            This Subject is a group of subjects, with a Subject Group ID of <b>{metadata['#subject_group_id']}</b> and consisting of <b>{subjects.length}</b> subject(s).
            &nbsp;
            <button onClick={()=>{ setExpandSubjectGroup(!expandSubjectGroup) }}>
              {expandSubjectGroup ? 'hide' : 'show'}
            </button>
          </p>
          {expandSubjectGroup && (
          <ul>
            {subjects.map(subjectId => {
              return (
                <li key={`subjectGroup-subject-${subjectId}`}>
                  <a
                    href={`/projects/${projectSlug}/talk/subjects/${subjectId}`}
                  >
                    Subject {subjectId}
                  </a>
                </li>
              )
            })}
          </ul>
          )}
        </div>
      )
    }
    
    // Only display if the Subject has something interesting to say
    if (subjectGroupHtml) {
      return (
        <div className="subject-metadata">
          <h3>Additional Subject information</h3>
          {subjectGroupHtml}
        </div>
      );
    }
    
    return null;
  }

  return (<Loading />);
};

SubjectMetadata.defaultProps = {
  expandSubjectGroup: false,
  project: null,
  subject: null,
};

SubjectMetadata.propTypes = {
  expandSubjectGroup: PropTypes.bool,
  project: PropTypes.shape({
    id: PropTypes.string
  }),
  subject: PropTypes.shape({
    id: PropTypes.string
  }),
};

export default SubjectMetadata;