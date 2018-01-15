import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import LoadingIndicator from '../../components/loading-indicator';
import Paginator from '../../talk/lib/paginator';

const SubjectSetsPage = (props) => {
  const meta = props.subjectSets.length ? props.subjectSets[0].getMeta() : {};

  return (
    <div>
      <h1 className="form-label">Subject sets</h1>
      <p>
        Subject sets are a group of data presented to volunteers in a project.
      </p>
      <ul className="nav-list">
        {props.subjectSets.map((subjectSet) => {
          const subjectSetListLabel = subjectSet.display_name || <i>{props.defaultSubjectSetName}</i>;
          return (
            <li key={subjectSet.id}>
              <Link
                activeClassName="active"
                className="nav-list-item"
                to={props.labPath(`/subject-sets/${subjectSet.id}`)}
              >
                {subjectSetListLabel}
              </Link>
            </li>
          );
        })}

        {(props.subjectSets.length === 0 && props.loading === false) && (
          <p>No subject sets are currently associated with this project.</p>
        )}

        <li className="nav-list-item">
          <button
            type="button"
            onClick={props.createNewSubjectSet}
            disabled={props.subjectSetCreationInProgress}
          >
            New subject set{' '}
            <LoadingIndicator off={!props.subjectSetCreationInProgress} />
          </button>{' '}
          {props.subjectSetCreationError && (
            <div className="form-help error">{props.subjectSetCreationError.message}</div>
          )}
        </li>
      </ul>

      {props.subjectSets.length > 0 && (
        <Paginator
          className="talk"
          page={meta.page}
          onPageChange={props.onPageChange}
          pageCount={meta.page_count}
        />
      )}

    </div>
  );
};

SubjectSetsPage.defaultProps = {
  subjectSets: []
};

SubjectSetsPage.propTypes = {
  createNewSubjectSet: PropTypes.func,
  defaultSubjectSetName: PropTypes.string,
  labPath: PropTypes.func,
  loading: PropTypes.bool,
  onPageChange: PropTypes.func,
  subjectSetCreationError: PropTypes.shape({
    message: PropTypes.string
  }),
  subjectSetCreationInProgress: PropTypes.bool,
  subjectSets: PropTypes.arrayOf(PropTypes.object)
};

export default SubjectSetsPage;