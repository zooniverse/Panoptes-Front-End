import React from 'react';
import PropTypes from 'prop-types';
import tasks from '../../tasks';

function getCorrectSingularOrPluralOfDrawingType(type, number) {
  return number !== 1 ? `${type}s` : type;
}

function stripMarkdownFromLabel(label) {
  return label.replace(/\!\[[^\]]*\]\([^)]*\)/g, '');
}

function MarkProperty({ property, mark, tool }) {
  switch (property) {
    case 'tool':
    case 'sources':
      return null;
    case 'points':
      return <code>{mark.points.length}&nbsp;points{' '}</code>;
    case 'details':
      return tool.details.map((task, i) => {
        const SummaryComponent = tasks[task.type].Summary;
        return (
          <SummaryComponent
            key={`${task.type}.${i}`}
            task={task}
            annotation={mark.details[i]}
            translation={task}
          />
        );
      });
    default:
      return <code><strong>{property}:</strong>&nbsp;{mark[property]}{' '}</code>;
  }
}

MarkProperty.propTypes = {
  property: PropTypes.string.isRequired,
  mark: PropTypes.shape({
    details: PropTypes.array,
    points: PropTypes.array
  }).isRequired,
  tool: PropTypes.shape({
    details: PropTypes.array
  }).isRequired
};

export default function SummaryAnswer({ expanded, tool, marks }) {
  return (
    <div className="answer">
      <p>
        <strong>{stripMarkdownFromLabel(tool.label)}</strong>
        {' '}
        ({marks.length} {getCorrectSingularOrPluralOfDrawingType(tool.type, marks.length)} marked)
      </p>
      {expanded &&
        <ol>
          {marks.map(mark => (
            <li key={mark._key}>
              {Object.keys(mark)
                .filter(property => property[0] !== '_')
                .map(property => <MarkProperty key={property} tool={tool} mark={mark} property={property} />)}
            </li>
          ))}
        </ol>
      }
    </div>
  );
}

SummaryAnswer.propTypes = {
  expanded: PropTypes.bool,
  marks: PropTypes.arrayOf(PropTypes.shape({})),
  tool: PropTypes.shape({})
};

SummaryAnswer.defaultProps = {
  expanded: false,
  marks: [],
  tool: {}
};
