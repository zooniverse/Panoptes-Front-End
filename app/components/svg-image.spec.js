import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import SVGImage from './svg-image';

describe('SVGImage', () => {
  it('should render without crashing', () => {
    shallow(<SVGImage src="barfoo.png" width={100} height={100} />);
  });

  it('it should contain an image element', () => {
    const filename = 'foobar.jpeg';
    const wrapper = shallow(<SVGImage src={filename} width={100} height={100} />);
    const image = wrapper.find('image');

    assert.equal(image.length, 1);

    assert.equal(image.prop('xlinkHref'), filename);
  });
});
