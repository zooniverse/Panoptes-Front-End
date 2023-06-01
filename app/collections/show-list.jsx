/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
import { Component, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';
import Translate from 'react-translate-component';
import apiClient from 'panoptes-client/lib/api-client';
import intersection from 'lodash/intersection';
import pick from 'lodash/pick';
import classNames from 'classnames';
import counterpart from 'counterpart';
import alert from '../lib/alert';
import Paginator from '../talk/lib/paginator';
import SubjectViewer from '../components/subject-viewer';
import Loading from '../components/loading-indicator';
import CollectionsManager from './collections-manager';
import getSubjectLocation from '../lib/getSubjectLocation';

const VALID_COLLECTION_MEMBER_SUBJECTS_PARAMS = ['page', 'page_size'];

counterpart.registerTranslations('en', {
  collectionSubjectListPage: {
    error: 'There was an error listing this collection.',
    noSubjects: 'No subjects in this collection.'
  }
});

const DEFAULT_HANDLER = () => true;

function SubjectNode({
  addSelected = DEFAULT_HANDLER,
  canCollaborate = false,
  collection = null,
  onDelete = DEFAULT_HANDLER,
  projectContext = null,
  removeSelected = DEFAULT_HANDLER,
  selecting = false,
  selected = false,
  subject,
  user = null
}) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [project, setProject] = useState(projectContext);

  async function checkFavorite(project) {
    if (collection?.favorite && (collection.links.owner.id === user?.id)) {
      setIsFavorite(true);
    } else if (user != null) {
      const query = {
        favorite: true,
        project_ids: project.id,
        owner: user.login
      };
      let isFavorite = false;

      const [favoritesCollection] = await apiClient.type('collections').get(query);
      if ((favoritesCollection != null) && (favoritesCollection.links.subjects != null)) {
        isFavorite = favoritesCollection.links.subjects.includes(subject.id);
      }
      setIsFavorite(isFavorite);
    }
  }

  useEffect(function () {
    async function getSubjectProject() {
      const project = await subject.get('project');
      setProject(project);
      checkFavorite(project);
    }

    if (projectContext) {
      if (projectContext !== project) {
        setProject(projectContext);
      }
    } else {
      getSubjectProject();
    }
  }, [projectContext, subject])

  function toggleSelect(e) {
    if (e.target.checked) {
      addSelected();
    } else {
      removeSelected();
    }
  }

  function setCollectionCover() {
    collection.addLink('default_subject', subject.id);
  }

  const subjectSelectClasses = classNames({
    "collection-subject-viewer-circle": true,
    "fa fa-check-circle": selected,
    "fa fa-circle-o": !selected
  });

  const { src } = getSubjectLocation(subject);

  return (
    <div className="collection-subject-viewer">
      <SubjectViewer
        defaultStyle={false}
        subject={subject}
        user={user}
        project={projectContext}
        isFavorite={isFavorite}
      >
        {!selecting ?
          <Link className="subject-link" to={`/projects/${project?.slug}/talk/subjects/${subject.id}`}>
            <span></span>
          </Link> : undefined}
        {canCollaborate && !selecting ?
          <button
            type="button"
            aria-label="Delete"
            className="collection-subject-viewer-delete-button"
            onClick={onDelete}>
            <i className="fa fa-close" />
          </button> : undefined}
        {selecting ?
          <label className="collection-subject-viewer-select">
            <input
              aria-label={selected ? "Selected" : "Not Selected"}
              type="checkbox"
              checked={selected}
              onChange={toggleSelect}/>
            <i className={subjectSelectClasses} />
          </label> : undefined}
      </SubjectViewer>
      {canCollaborate && collection.default_subject_src ?
        src === collection.default_subject_src ?
          <div className="collection-subject-viewer__default-label">Collection Cover</div>
        :
          <button
            type="button"
            className="collection-subject-viewer__default-label collection-subject-viewer__button--cover"
            onClick={setCollectionCover}
          >
            Set as collection cover
          </button> : undefined}
    </div>
  )
}

function CollectionShowList({
  canCollaborate = false,
  collection,
  location,
  project = null,
  router,
  user = null
}) {
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState(null);
  const [selecting, setSelecting] = useState(false);
  const [selected, setSelected] = useState([]);

  useEffect(function () {
    async function fetchCollectionSubjects(query = null) {
      if (query == null) { ({
        query
      } = location); }

      const defaultQuery = {
        page: 1,
        page_size: 12
      };

      query = {...defaultQuery, ...query};
      return collection.get('subjects', query)
        .catch(setError);
    }

    fetchCollectionSubjects(pick(location.query, VALID_COLLECTION_MEMBER_SUBJECTS_PARAMS))
      .then(subjects => {
        setSubjects(subjects);
        setError(null);
    })
  }, [collection, location]);

  function onPageChange(page) {
    const nextQuery = {...location.query, page };
    router.push({
      pathname: location.pathname,
      query: nextQuery
    });
  }

  function toggleSelecting() {
    setSelecting(!selecting);
    setSelected([]);
  }

  function addSelected(subjectID) {
    setSelected([...selected, subjectID])
  }

  function removeSelected(subjectID) {
    const index = selected.indexOf(subjectID);
    setSelected(selected.splice(index, 1));
  }

  function isSelected(subjectID) {
    return selected?.indexOf(subjectID) !== -1;
  }

  function promptCollectionManager() {
    alert(resolve => <CollectionsManager
      user={user}
      project={project}
      subjectIDs={selected}
      onSuccess={() => {
        toggleSelecting();
        resolve();
      }}
    />);
  }

  function handleDeleteSubject(subjectToDelete) {
    const newSubjects = subjects.filter(subject => subject !== subjectToDelete)
    setSubjects(newSubjects);

    collection.removeLink('subjects', [subjectToDelete.id.toString()])
      .then(() => {
        collection.uncacheLink('subjects');
    });
  }

  function confirmDeleteSubjects() {
    alert(resolve => <div className="confirm-delete-dialog content-container">
        <p>Are you sure you want to remove {selected.length} subjects from this collection?</p>
        <div style={{ textAlign: "center" }}>
          <button className="minor-button" autoFocus={true} onClick={resolve}>Cancel</button>
        {' '}
          <button className="major-button" onClick={() => { deleteSubjects(); resolve(); }}>Yes</button>
        </div>
      </div>);
  }

  function deleteSubjects() {
    setSubjects(subjects.filter(subject => selected.indexOf(subject.id) === -1));

    collection.removeLink('subjects', selected)
      .then(() => {
        collection.uncacheLink('subjects');
    });

    toggleSelecting();
  }

  if (subjects != null) {
    return (
      <div>
        <div className="collection__description-container">
          {collection.description ?
            <p className="collection__description">
              {collection.description}
            </p> : undefined}

          {(() => {
          if (selecting) {
            return <div className="collection__buttons-container">
              <button
                type="button"
                className="collection__select-subjects-button"
                onClick={promptCollectionManager}
                disabled={selected.length < 1}>
                Add to Collection
              </button>
              {canCollaborate ?
                <button
                  type="button"
                  className="collection__select-subjects-button"
                  onClick={confirmDeleteSubjects}
                  disabled={selected.length < 1}>
                  Remove from Collection
                </button> : undefined}
              <button type="button" className="collection__select-subjects-button" onClick={toggleSelecting}>Cancel</button>
            </div>;
          } else if (user != null) {
            return <div className="collection__buttons-container">
              <button type="button" className="collection__select-subjects-button" onClick={toggleSelecting}>Select Subjects</button>
            </div>;
          }
        })()}
          </div>

          <div className="collections-show">
            {subjects.length === 0 ?
              <Translate component="p" content="collectionSubjectListPage.noSubjects" /> : undefined}

            {(() => {
            if (subjects.length > 0) {
              const meta = subjects[0].getMeta();

              return <div>
                {subjects.map(subject => {
                  return <SubjectNode
                    key={subject.id}
                    collection={collection}
                    subject={subject}
                    projectContext={project}
                    user={user}
                    canCollaborate={canCollaborate}
                    selecting={selecting}
                    selected={isSelected(subject.id)}
                    addSelected={() => addSelected(subject.id)}
                    removeSelected={() => removeSelected(subject.id)}
                    onDelete={() => handleDeleteSubject(subject)}
                  />;
                })}
                <Paginator
                  className="talk"
                  page={meta.page}
                  onPageChange={onPageChange}
                  pageCount={meta.page_count}
                />
              </div>;
            }
          })()}
          </div>
      </div>
    );
  } else if (error) {
    return <Translate component="p" className="form-help error" content="collectionSubjectListPage.error" />;
  } else {
    return <Loading />;
  }
}

export default class CollectionShowListContainer extends Component {
  render() {
    return <CollectionShowList {...this.props} router={this.context.router} />
  }
}

CollectionShowListContainer.contextTypes = {
  router: PropTypes.object
}
