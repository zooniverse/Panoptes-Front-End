import React from 'react';
import assert from 'assert';
import { mount } from 'enzyme';
import FrameViewer from './frame-viewer';
import FrameAnnotator from '../classifier/frame-annotator';

const subject = {
  locations: [{ image: 'www.testimage.com' }]
};

const videoSubject = {
  locations: [{ video: 'www.testvideo.com' }]
};

const clickSimulate = {
  target: { videoWidth: 0, videoHeight: 0 }
};

describe('FrameViewer', function () {
  describe('if loading an image subject', function() {
    let wrapper;

    beforeEach(function () {
      wrapper = mount(<FrameViewer frameWrapper={FrameAnnotator} subject={subject} />);
    });

    it('should render without crashing', function () {
    });

    it('should load an image subject correctly', function () {
      assert.equal(wrapper.find('img').length, 1);
    });

    it('should setState correctly in handleLoad', function () {
      wrapper.instance().handleLoad(clickSimulate);
      assert.equal(wrapper.state('loading'), false);
    });

    it('should load a wrapper when included', function () {
      assert.equal(wrapper.find('FrameAnnotator').length, 1);
    });
  });

  describe('if loading other subjects', function() {
    it('should load a video subject correctly', function () {
      const wrapper = mount(<FrameViewer subject={videoSubject} />);
      assert.equal(wrapper.find('VideoPlayer').length, 1);
    });

    it('should load nothing without a subject or wrapper present', function () {
      const wrapper = mount(<FrameViewer />);
      assert.equal(wrapper.children().length, 0);
    });
  });
});
