import React, { Component, PropTypes } from 'react';


class ClassificationsRibbon extends Component {
  constructor(props) {
    super(props);

//    fill={this.getColorFromString(project).bind(this)}
  }
  render() {
    const { cutoff, getColor, height, projects, totalClassifications, width } = this.props;
    const lastX = 0;
    const others = [];
    return (
      <div>
        {(projects.length === 0) ?
          <span className="classifications-ribbon-empty">
            <span className="empty">No classifications yet</span>
          </span> :
          <div>
            <h4>{totalClassifications} total classifications to date!</h4>
            <svg className="classifications-ribbon" width={width} height={height} viewBox="0 0 1 1" preserveAspectRatio="none">
              { projects.map((project) => {
//                const width = (project.classifications ? project.classifications : 1) / totalClassifications;
                if (width < cutoff) {
                  others.push({ project });
                  return others;
                } else {
                  return (
                    <rect
                      key={project.project}
                      fill={getColor(project.project)}
                      stroke="none"
                      x={lastX}
                      y="0"
                      width={width}
                      height="1"
                    >
                      <title>
                        {project}: {project.classifications ? project.classifications : '?'}
                      </title>
                    </rect>
                  );
                }
              })};
              <rect fill="gray" fillOpacity="0.5" stroke="none" x={lastX} y="0" width={1 - lastX} height="1">
                <title>
                  Hello, change this.
                </title>
              </rect>
            </svg>
          </div>}
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
