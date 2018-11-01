import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import drawingTools from '../drawing-tools';

for (const property in drawingTools) {
  const TaskComponent = drawingTools[property];

  describe(`Task  ${property}`, function() {
    let wrapper;

    before(function () {
      wrapper = TaskComponent.initStart({ x: 100, y: 200 });
    });
  });
}
