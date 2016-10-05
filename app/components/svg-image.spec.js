import React from 'react'
import assert from 'assert'
import SVGImage from './svg-image'
import {shallow, render} from 'enzyme'

describe('SVGImage', function(){
  it('should render without crashing', function(){
    shallow(<SVGImage src="barfoo.png"/>)
  });

  it('it should contain an image element', function(){
    const filename = 'foobar.jpeg'
    const wrapper = render(<SVGImage src={filename} />);
    const image = wrapper.find('image');

    assert(image.length, 1);

    assert(image.attr('xlink:href', filename));

  });

});