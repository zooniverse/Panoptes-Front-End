import React from 'react';

const SVG_NS = 'http://www.w3.org/2000/svg';

// NOTE: This is completely ridiculous. But React doesn't know about SVG's <a>. Replace this thing ASAP.

const SVGLink = React.createClass({
  componentDidMount() {
    this.link = document.createElementNS(SVG_NS, 'a');
    this.inject();
  },

  componentWillUpdate() {
    this.backToNormal();
  },

  componentDidUpdate() {
    this.inject();
  },

  inject() {
    Array.prototype.forEach.call(this.link.attributes, (attribute) => {
      this.link.removeAttribute(attribute.name);
    });

    Array.prototype.forEach.call(this.refs.group.attributes, (attribute) => {
      const attributeName = `${attribute.name}:${attribute.name}`.split(':')[1]; // TODO: Clean this up.
      this.link.setAttribute(attributeName, attribute.value);
    });

    while (this.refs.group.childNodes.length > 0) {
      this.link.appendChild(this.refs.group.childNodes[0]);
    }

    this.refs.group.parentNode.insertBefore(this.link, this.refs.group);
    this.refs.group.parentNode.removeChild(this.refs.group);
  },

  backToNormal() {
    while (this.link.childNodes.length > 0) {
      this.refs.group.appendChild(this.link.childNodes[0]);
    }

    if (!!this.link.parentNode) {
      this.link.parentNode.insertBefore(this.refs.group, this.link);
      this.link.parentNode.removeChild(this.link);
    }
  },

  render() {
    return (
      <g ref="group" {...this.props} href={null}>
        {this.props.children}
      </g>
    );
  }
});

export default SVGLink;
