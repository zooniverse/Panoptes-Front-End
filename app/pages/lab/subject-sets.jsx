import React from 'react';
import { Link } from 'react-router';
import LoadingIndicator from '../../components/loading-indicator';
import Paginator from '../../talk/lib/paginator';

const SubjectSetsPage = (props) => {
  const meta = props.subjectSets.length ? props.subjectSets[0].getMeta() : {};

  return (
    <div>
      <div className="form-label">Subject sets</div>
      <ul className="nav-list">
        {props.subjectSets.map((subjectSet) => {
          const subjectSetListLabel = subjectSet.display_name || <i>{'Untitled subject set'}</i>;
          return (
            <li key={subjectSet.id}>
              <Link
                activeClassName="active"
                className="nav-list-item"
                title="A subject is an image (or group of images) to be analyzed."
                to={props.labPath(`/subject-set/${subjectSet.id}`)}
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
            disabled={props.creationInProgress}
            title="A subject is an image (or group of images) to be analyzed."
          >
            New subject set{' '}
            <LoadingIndicator off={!props.creationInProgress} />
          </button>{' '}
          {props.error && (
            <div className="form-help error">{props.error.message}</div>
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
  createNewSubjectSet: React.PropTypes.func,
  creationInProgress: React.PropTypes.bool,
  labPath: React.PropTypes.func,
  loading: React.PropTypes.bool,
  error: React.PropTypes.shape({
    message: React.PropTypes.string
  }),
  onPageChange: React.PropTypes.func,
  subjectSets: React.PropTypes.arrayOf(React.PropTypes.object)
};

export default SubjectSetsPage;
