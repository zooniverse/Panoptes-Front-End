import React, { Component, PropTypes } from 'react';
import getColorFromString from '../lib/get-color-from-string';


class ClassificationsRibbon extends Component {
  constructor(props) {
    super(props);
    this.renderOtherProjectsRectangle = this.renderOtherProjectsRectangle.bind(this);
    this.renderProjectsRectangles = this.renderProjectsRectangles.bind(this);
  }

  renderProjectsRectangles(projects) {
    const others = [];
    return (
      projects.map((project) => {
        if (project.width < this.props.cutoff) {
          others.push({ project });
          return this.renderOtherProjectsRectangle(others);
        } else {
          return (
            <rect
              key={project.projectName}
              fill={getColorFromString(project.projectName)}
              stroke="none"
              x={project.x}
              y="0"
              width={project.width}
              height="1"
            >
              <title>
                {project.projectName}: {project.classifications ? project.classifications : 'Classifications not available.'}
              </title>
            </rect>
          );
        }
      })
    );
  }

  renderOtherProjectsRectangle(others) {
    others.map((other) => {
      return (
        <rect fill="gray" fillOpacity="0.5" stroke="none" x={other.x} y="0" width={1 - other.x} height="1">
          <title>
            { other + ": " + (other.classifications != null ? other.classifications : 'Classifications not available.')}
          </title>
        </rect>
      );
    });
  }

  render() {
    const { height, projects, totalClassifications, width } = this.props;
    return (
      <div>
        {(projects.length === 0)
        ? <span className="classifications-ribbon-empty" style={{ display: 'block', width, height }}>
            <span className="empty">No classifications yet</span>
          </span>
        : <div>
            <h4>You've made {totalClassifications} total classifications to date.</h4>
            <p>
              <svg
                className="classifications-ribbon"
                width={width}
                height={height}
                viewBox="0 0 1 1"
                preserveAspectRatio="none"
                style={{ display: 'block' }}
              >
                {this.renderProjectsRectangles(projects)}
              </svg>
            </p>
          </div>
        }
      </div>
    );
  }
}

ClassificationsRibbon.propTypes = {
  cutoff: PropTypes.number.isRequired,
  height: PropTypes.string.isRequired,
  projects: PropTypes.array.isRequired,
  totalClassifications: PropTypes.number.isRequired,
  width: PropTypes.string.isRequired,
};

ClassificationsRibbon.defaultProps = {
  cutoff: 1 / 50,
  height: '1em',
  projects: [],
  totalClassifications: 0,
  width: '100%',
};

export default ClassificationsRibbon;
