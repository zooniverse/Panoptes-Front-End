import PropTypes from 'prop-types';
import React, { Component } from 'react';
import updateQueryParams from '../talk/lib/update-query-params.coffee';

export default class CollapsableSection extends Component {
  constructor(props) {
    super(props);
    this.onSectionToggle = this.onSectionToggle.bind(this);
  }

  onSectionToggle() {
    const expandToggle = this.props.expanded ? false : this.props.section;
    updateQueryParams(this.context.router, { page: 1 });
    this.props.callbackParent(expandToggle);
  }

  render() {
    const children = React.Children.map(this.props.children, child =>
       React.cloneElement(child, {
         toggleSection: this.onSectionToggle,
         expanded: this.props.expanded,
         section: this.props.section
       })
    );
    return (
      <div>
        {children}
      </div>
    );
  }
}

CollapsableSection.propTypes = {
  callbackParent: PropTypes.func,
  children: PropTypes.node,
  expanded: PropTypes.bool,
  section: PropTypes.string
};

CollapsableSection.contextTypes = {
  router: PropTypes.object.isRequired
};

CollapsableSection.defaultProps = {
  expanded: false
};
