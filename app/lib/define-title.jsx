import React from 'react';

const MAIN_SEPARATOR = ' » ';
const SUFFIX_SEPARATOR = ' \u2014 '; // Em dash

function defineTitle(Component) {
  return React.createClass({
    componentDidMount() {
      this.titleSegments = [];
      this.titleSegmentIndex = NaN;
      this.titleSegmentIndex = this.titleSegments.length;
      this.updateTitle();
    },

    componentDidUpdate() {
      this.updateTitle();
      console.log(this);
    },

    componentWillUnmount() {
      this.titleSegments.splice(this.titleSegmentIndex); // All children are unmounting too.
      this.titleSegmentIndex = NaN;
      this.updateTitle();
    },

    updateTitle() {
      if (typeof Component.title === 'function') {
        this.titleSegments[this.titleSegmentIndex] = Component.prototype.title();
      } else {
        this.titleSegments[this.titleSegmentIndex] = Component.title;
      }

      const mainTitle = this.titleSegments.filter(Boolean).join(MAIN_SEPARATOR);
      if (document) {
        const SUFFIX = document.title;
        document.title = [mainTitle, SUFFIX].filter(Boolean).join(SUFFIX_SEPARATOR);
      }
    },

    render() {
      return <Component {...this.props} {...this.state} />;
    }
  });
}

export default defineTitle;
