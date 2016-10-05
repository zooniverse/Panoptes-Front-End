import React from 'react'
import assert from 'assert'
import SVGImage from './svg-image'
import {shallow, render} from 'enzyme'

describe('SVGImage', () => {
  it('should render without crashing', () => {
    shallow(<SVGImage />)
  });

  it('it should contain an image element', () => {
    const filename = 'foobar.jpeg'
    const wrapper = render(<SVGImage src={filename} />);
    const image = wrapper.find('image');

    assert(image.length, 1);

    assert(image.attr('xlink:href', filename));

  });

});