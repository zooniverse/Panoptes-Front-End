import React from 'react';
import assert from 'assert';
import { mount, shallow } from 'enzyme';
import VideoPlayer from './file-viewer/video-player';
import AudioPlayer from './file-viewer/audio-player';
import FrameViewer from './frame-viewer';
import FrameAnnotator from '../classifier/frame-annotator';

const subject = {
  locations: [{ 'image/jpeg': '/assets/dev-classifier/landscape.jpeg' }]
};

const videoSubject = {
  locations: [{ 'video/mp4': 'testvideo.mp4' }]
};

const audioSubject = {
  locations: [{ 'audio/mp3': 'testaudio.mp3' }]
};

const clickProps = {
  target: { videoWidth: 0, videoHeight: 0 }
};

describe('FrameViewer', function () {
  describe('if loading an image subject', function() {
    let wrapper;

    beforeEach(function () {
      wrapper = shallow(<FrameViewer frameWrapper={FrameAnnotator} subject={subject} />);
    });

    it('should render without crashing', function () {
    });

    it('should load an image subject correctly', function () {
      assert.equal(wrapper.find('FileViewer').props().type, 'image');
    });

    it('should setState correctly in handleLoad', function () {
      wrapper.instance().handleLoad(clickProps);
      assert.equal(wrapper.state('loading'), false);
    });

    it('should load a wrapper when included', function () {
      assert.equal(wrapper.find('FrameAnnotator').length, 1);
    });
  });

  describe('if loading other subjects', function() {
    it('should load a video subject correctly', function () {
      const wrapper = mount(<FrameViewer subject={videoSubject} />);
      assert.equal(wrapper.find(VideoPlayer).length, 1);
    });

    it('should load an audio subject correctly', function () {
      const wrapper = mount(<FrameViewer subject={audioSubject} />);
      assert.equal(wrapper.find(AudioPlayer).length, 1);
    });

    it('should load nothing without a subject or wrapper present', function () {
      const wrapper = shallow(<FrameViewer />);
      assert.equal(wrapper.children().length, 0);
    });
  });
});
