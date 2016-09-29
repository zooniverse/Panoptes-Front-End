import React from 'react';
import Filmstrip from '../components/filmstrip';

const DisciplineSelector = React.createClass({
  propTypes: {
    onChange: React.PropTypes.function,
    value: React.PropTypes.string,
  },
  render() {
    return (
      <Filmstrip increment={350} value={this.props.value} onChange={this.props.onChange} />
    );
  },
});

export default DisciplineSelector;
