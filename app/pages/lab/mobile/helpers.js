import _ from 'lodash';

const lifecycleMethods = [
  'render',
  'componentWillMount',
  'componentDidMount',
  'componentWillReceiveProps',
  'shouldComponentUpdate',
  'componentWillUpdate',
  'componentDidUpdate',
  'componentWillUnmount'
];

 function stubComponent(componentClass) {
  beforeEach(function() {
    _.each(lifecycleMethods, function(method) {
      if(typeof componentClass.prototype[method] !== 'undefined') {
        spyOn(componentClass.prototype, method).and.returnValue(null);
      }
    });
  });
};

module.exports = {
  stubComponent: stubComponent
};
