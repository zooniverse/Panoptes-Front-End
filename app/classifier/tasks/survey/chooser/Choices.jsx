import PropTypes from 'prop-types';
import React from 'react';
import sortIntoColumns from 'sort-into-columns';
import Thumbnail from '../../../../components/thumbnail';

const BACKSPACE = 8;
const UP = 38;
const DOWN = 40;

class Choices extends React.Component {
  constructor() {
    super();
    this.choiceButtons = [];
  }

  componentDidMount() {
    this.sortChoiceButtons();
  }

  componentDidUpdate() {
    this.sortChoiceButtons();
  }

  sortChoiceButtons() {
    // overrides default DOM focus order by sorting the buttons according to task.choicesOrder
    const newChoiceButtons = [];
    this.choiceButtons
      .filter(Boolean)
      .map((button) => {
        const choiceID = button.getAttribute('data-choiceid');
        const index = this.props.task.choicesOrder.indexOf(choiceID);
        newChoiceButtons[index] = button;
      });
    this.choiceButtons = newChoiceButtons.filter(Boolean);
  }

  howManyColumns({ length }) {
    if (length <= 5) {
      return 1;
    } else if (length <= 20) {
      return 2;
    } else {
      return 3;
    }
  }

  whatSizeThumbnails({ length }) {
    if (this.props.task.alwaysShowThumbnails) {
      return 'small';
    }
    if (length > 30) {
      return 'none';
    }
    switch (this.howManyColumns({ length })) {
      case 1:
        return 'large';
      case 2:
        return 'medium';
      case 3:
        return 'small';
      default:
        return 'none';
    }
  }

  handleKeyDown(choiceId, e) {
    const index = this.choiceButtons.indexOf(document.activeElement);
    let newIndex;
    switch (e.which) {
      case BACKSPACE:
        this.props.onRemove(choiceId);
        e.preventDefault();
        break;
      case UP:
        newIndex = index - 1;
        if (newIndex === -1) {
          newIndex = this.choiceButtons.length - 1;
        }
        this.choiceButtons[newIndex].focus();
        e.preventDefault();
        break;
      case DOWN:
        newIndex = (index + 1) % this.choiceButtons.length;
        this.choiceButtons[newIndex].focus();
        e.preventDefault();
        break;
      default:
    }
  }

  render() {
    const { filteredChoices, task, translation } = this.props;
    this.choiceButtons = [];
    const selectedChoices = this.props.annotation.value.map(item => item.choice);
    const columnsCount = this.howManyColumns(filteredChoices);
    const sortedFilteredChoices = sortIntoColumns(filteredChoices, columnsCount);
    const thumbnailSize = this.whatSizeThumbnails(sortedFilteredChoices);
    const choiceNotPresent = this.props.focusedChoice.length === 0 ||
      filteredChoices.indexOf(this.props.focusedChoice) === -1;
    return (
      <div className="survey-task-chooser-choices" data-thumbnail-size={thumbnailSize} data-columns={columnsCount}>
        {sortedFilteredChoices.length === 0 && <div><em>No matches.</em></div>}
        {sortedFilteredChoices.map((choiceId, i) => {
          const choice = task.choices[choiceId];
          const chosenAlready = selectedChoices.indexOf(choiceId) > -1;
          let tabIndex = -1;
          if (i === 0 && choiceNotPresent) {
            tabIndex = 0;
          }
          if (choiceId === this.props.focusedChoice) {
            tabIndex = 0;
          }
          const src = this.props.task.images[choice.images[0]];
          const srcPath = Thumbnail.getThumbnailSrc({
            origin: 'https://thumbnails.zooniverse.org',
            width: 500,
            height: 500,
            src
          });
          const thumbnail = srcPath || '';
          const chosenClassName = chosenAlready ? 'survey-task-chooser-choice-button-chosen' : '';
          const className = `survey-task-chooser-choice-button ${chosenClassName}`;
          return (
            <button
              autoFocus={choiceId === this.props.focusedChoice}
              key={choiceId}
              data-choiceid={choiceId}
              ref={button => this.choiceButtons.push(button)}
              tabIndex={tabIndex}
              type="button"
              className={className}
              onClick={this.props.onChoose.bind(null, choiceId)}
              onKeyDown={this.handleKeyDown.bind(this, choiceId)}
            >
              <span className="survey-task-chooser-choice">
                {choice.images.length > 0 &&
                  <span
                    className="survey-task-chooser-choice-thumbnail"
                    role="presentation"
                    style={{ backgroundImage: `url('${thumbnail}')` }}
                  />
                }
                <span className="survey-task-chooser-choice-label">{translation.choices[choiceId].label}</span>
              </span>
            </button>
          );
        })}
      </div>
    );
  }
}

Choices.propTypes = {
  annotation: PropTypes.shape({
    task: PropTypes.string,
    value: PropTypes.array
  }),
  filteredChoices: PropTypes.array,
  focusedChoice: PropTypes.string,
  onChoose: PropTypes.func,
  onRemove: PropTypes.func,
  task: PropTypes.shape({
    alwaysShowThumbnails: PropTypes.bool,
    characteristics: PropTypes.object,
    characteristicsOrder: PropTypes.array,
    choices: PropTypes.object,
    choicesOrder: PropTypes.array,
    images: PropTypes.object,
    questions: PropTypes.object
  }),
  translation: PropTypes.shape({
    characteristics: PropTypes.object,
    choices: PropTypes.object,
    questions: PropTypes.object
  }).isRequired
};

Choices.defaultProps = {
  annotation: {
    task: '',
    value: []
  },
  filteredChoices: [],
  focusedChoice: '',
  onChoose: Function.prototype,
  onRemove: Function.prototype,
  task: null
};

export default Choices;
