import React from 'react';

const MAIN_SEPARATOR = ' » ';
const SUFFIX_SEPARATOR = ' \u2014 '; // Em dash
const titleSegments = [];
let SUFFIX;

if (document) { SUFFIX = document.title; }

function defineTitle(Component) {
  return class extends Component {
    componentDidMount() {
      this.titleSegmentIndex = NaN;
      this.titleSegmentIndex = titleSegments.length;
      this.updateTitle();
    }

    componentDidUpdate() {
      this.updateTitle();
    }

    componentWillUnmount() {
      titleSegments.splice(this.titleSegmentIndex);
      this.titleSegmentIndex = NaN;
      this.updateTitle();
    }

    updateTitle() {
      if (typeof this.title === 'function') {
        titleSegments[this.titleSegmentIndex] = this.title();
      } else {
        titleSegments[this.titleSegmentIndex] = this.title;
      }

      const mainTitle = titleSegments.filter(Boolean).join(MAIN_SEPARATOR);
      if (document) {
        document.title = [mainTitle, SUFFIX].filter(Boolean).join(SUFFIX_SEPARATOR);
      }
    }

    render() {
      return <Component {...this.props} />;
    }
  };
}

export default defineTitle;
