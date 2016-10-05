import React from 'react'
import assert from 'assert'
import SVGImage from './svg-image'
import {shallow} from 'enzyme'

describe('SVGImage', () => {
  it('should render without crashing', () => {
    shallow(<SVGImage />)
  });
});