import PropTypes from 'prop-types';
import React from 'react';
import talkClient from 'panoptes-client/lib/talk-client';
import CreateSubjectDefaultButton from '../../talk/lib/create-subject-default-button';
import CreateBoardForm from '../../talk/lib/create-board-form';
import projectSection from '../../talk/lib/project-section';
import SingleSubmitButton from '../../components/single-submit-button';

export default class EditProjectTalk extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      boards: [],
      editingBoard: null,
      suggestedTags: []
    };

    this.board = this.board.bind(this);
    this.createSuggestedTag = this.createSuggestedTag.bind(this);
    this.deleteSuggestedTag = this.deleteSuggestedTag.bind(this);
    this.getSuggestedTags = this.getSuggestedTags.bind(this);
    this.section = this.section.bind(this);
    this.setBoards = this.setBoards.bind(this);
    this.suggestedTag = this.suggestedTag.bind(this);
    this.suggestedTagChanged = this.suggestedTagChanged.bind(this);
  }

  componentDidMount() {
    this.getSuggestedTags();
    this.setBoards();
  }

  onClickDeleteBoard(e, board) {
    e.preventDefault();
    if (window.confirm(`Are you sure that you want to delete the ${board.title} board? All of it's content will be lost forever`)) {
      talkClient.type('boards').get(board.id).delete()
        .then(this.setBoards());
    }
  }

  onClickEditTitle(e, board) {
    e.preventDefault();
    const titleInput = this.refs[`board-title-${board.id}`];
    const title = titleInput.value;

    const descriptionTextarea = this.refs[`board-description-${board.id}`];
    const description = descriptionTextarea.value;

    talkClient.type('boards').get(board.id).update({ title, description }).save()
      .then(() => this.setState({ editingBoard: null }, this.setBoards()));
  }

  setBoards() {
    talkClient.type('boards').get({ section: this.section() })
      .then((boards) => { this.setState({ boards }); });
  }

  getSuggestedTags() {
    talkClient.type('suggested_tags').get({ section: this.section() })
      .then((suggestedTags) => { this.setState({ suggestedTags }); });
  }

  board(board, i) {
    const { editingBoard } = this.state;
    return (
      <li key={board.id}>
        {editingBoard === board.id // eslint-disable-line
          ? (
            <div className="talk-module talk-form">
              <span>Title</span>
              <input ref={`board-title-${board.id}`} type="text" defaultValue={board.title} />
              <div>Description</div>
              <textarea ref={`board-description-${board.id}`} defaultValue={board.description} />
              <button type="button" onClick={() => this.setState({ editingBoard: null })}>
                Cancel
              </button>
              <button type="button" onClick={(e) => { this.onClickEditTitle(e, board); }}>
                Submit
              </button>
            </div>
          ) : (
            <span>
              <span>
                {board.title}
                {board.subject_default ? ' (Subject Default)' : ''}
                {' '}
              </span>
              <i
                className="fa fa-pencil"
                role="button"
                tabIndex="0"
                title="Edit Title"
                onClick={() => this.setState({ editingBoard: editingBoard ? null : board.id })}
              />
              {' '}
              <i
                className="fa fa-close"
                role="button"
                tabIndex="0"
                title="Delete"
                onClick={(e) => { this.onClickDeleteBoard(e, board); }}
              />
            </span>
          )}

        <ul>
          <li style={{ listStyleType: 'none', opacity: 0.5 }}>
            {board.description}
          </li>
        </ul>
      </li>
    );
  }

  deleteSuggestedTag(tag) {
    tag.delete().then(() => this.getSuggestedTags());
  }

  suggestedTag(tag) {
    return (
      <div className="suggested-tag" key={`suggested-tag-${tag.id}`}>
        {`#${tag.name}`}
        <SingleSubmitButton type="submit" onClick={this.deleteSuggestedTag.bind(this, tag)}>Remove</SingleSubmitButton>
      </div>
    );
  }

  suggestedTagChanged(e) {
    const key = e.which || e.keyCode;
    const { suggestedTagError } = this.state;
    if (key === 13) {
      this.createSuggestedTag(e);
    } else if (suggestedTagError) {
      this.setState({ suggestedTagError: null });
    }
  }

  createSuggestedTag(e) {
    e.preventDefault();
    const name = this.refs.newSuggestedTag.value.trim().toLowerCase()
    this.setState({ suggestedTagError: null });
    talkClient.type('suggested_tags').create({ section: this.section(), name }).save()
      .then(() => {
        this.refs.newSuggestedTag.value = '';
        this.getSuggestedTags();
      })
      .catch((error) => {
        this.setState({ suggestedTagError: error.message });
      });
  }

  section() {
    const { project } = this.props;
    return projectSection(project);
  }

  render() {
    const { boards, suggestedTagError, suggestedTags } = this.state;
    const { user } = this.props;

    return (
      <div className="edit-project-talk talk">
        <p className="form-help">Setup your project&#39;s talk</p>

        <p>
          “Talk” is the name for the discussion boards attached to your project.
          On your Talk, volunteers will be able to discuss your project and subjects
          with each other, as well as with you and your project’s researchers.
          Maintaining a vibrant and active Talk is important for keeping your
          volunteers engaged with your project. Conversations on Talk also can
          lead to additional research discoveries.
        </p>

        <p>
          You can use this page to set up the initial Talk boards for your
          project. We highly recommend first activating the default subject-discussion
          board, which hosts a single dedicated conversation for each subject.
          After that, you can add additional boards, where each board will host
          conversation about a general topic. Example boards might include:
          “Announcements,” “Project Discussion,” “Questions for the Research Team,”
          or “Technical Support.”
        </p>

        <p>
          1. Click this button to create a default board for volunteers to comment
          on subjects after classifying (strongly recommended)
        </p>

        <CreateSubjectDefaultButton
          section={this.section()}
          onCreateBoard={() => this.setBoards()}
        />

        <p>2. Add any additional discussion boards</p>

        <div className="talk-module">
          <CreateBoardForm
            section={this.section()}
            user={user}
            onSubmitBoard={() => this.setBoards()}
          />
        </div>

        <p>Your Project&#39;s Discussion Boards</p>

        <div>
          {boards.length > 0 // eslint-disable-line
            ? <ul>{boards.map(this.board)}</ul> // eslint-disable-line
            : (
              <p>
                See above to add boards to your project, or look in the moderator
                controls listed under the talk tab of your project!
              </p>
            )}
        </div>

        <p>
          3. You can create a list of suggested tags to use. Suggested tags are
          weighted higher in autocompletion results as well as populating the
          list of tags when you first type &quot;#&quot; in a Talk text box.
        </p>

        <div className="suggested-tags">
          {suggestedTags.map(this.suggestedTag)}
          <input
            type="text"
            ref="newSuggestedTag"
            placeholder="New suggested tag"
            onKeyUp={this.suggestedTagChanged}
          />
          <SingleSubmitButton
            type="submit"
            onClick={this.createSuggestedTag}
          >
            Create
          </SingleSubmitButton>
          {suggestedTagError && (
            <span className="error">{suggestedTagError}</span>
          )}
        </div>
      </div>
    );
  }
}

EditProjectTalk.defaultProps = {
  project: {},
  user: {}
};

EditProjectTalk.propTypes = {
  project: PropTypes.shape(),
  user: PropTypes.shape()
};
