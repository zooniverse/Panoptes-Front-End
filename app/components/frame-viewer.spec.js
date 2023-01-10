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

describe('FrameViewer', () => {
  describe('if loading an image subject', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallow(<FrameViewer frameWrapper={FrameAnnotator} subject={subject} />);
    });

    it('should render without crashing', () => {
    });

    it('should load an image subject correctly', () => {
      assert.equal(wrapper.find('FileViewer').props().type, 'image');
    });

    it('should setState correctly in handleLoad', () => {
      wrapper.instance().handleLoad(clickProps);
      assert.equal(wrapper.state('loading'), false);
    });

    it('should load a wrapper when included', () => {
      assert.equal(wrapper.find('FrameAnnotator').length, 1);
    });
  });

  describe('if loading other subjects', () => {
    it('should load a video subject correctly', () => {
      const wrapper = mount(<FrameViewer subject={videoSubject} />);
      assert.equal(wrapper.find(VideoPlayer).length, 1);
    });

    it('should load an audio subject correctly', () => {
      const wrapper = mount(<FrameViewer subject={audioSubject} />);
      assert.equal(wrapper.find(AudioPlayer).length, 1);
    });

    it('should load nothing without a subject or wrapper present', () => {
      const wrapper = shallow(<FrameViewer />);
      assert.equal(wrapper.children().length, 0);
    });
  });
});
