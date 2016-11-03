import React from 'react';
import assert from 'assert';
import ExternalLinksEditor from './external-links-editor';
import { shallow, render } from 'enzyme';

const testProject = {
  urls: [
    {
      label: 'Example1',
      url: 'https://example.com/1',
    },
    {
      label: 'Example2',
      url: 'https://example.com/2',
    },
    {
      label: 'Example3',
      url: 'https://example.com/3',
    },
  ],
};

describe('ExternalLinksEditor', () => {
  it('should render without crashing', () => {
    shallow(<ExternalLinksEditor project={testProject} />);
  });

  it('should contain 3 table rows', () => {
    const wrapper = render(<ExternalLinksEditor project={testProject} />);
    const rows = wrapper.find('tbody > tr');
    // assert there are the right number of rows
    assert(rows.length, 3);
    // assert the rows have the correct values
    for (const idx of [0, 1, 2]) {
      const inputLabel = wrapper.find(`input[name="urls.${idx}.label"]`);
      const inputUrl = wrapper.find(`input[name="urls.${idx}.url"]`);
      assert(inputLabel.get(0).attribs.value, testProject.urls[idx].label);
      assert(inputUrl.get(0).attribs.value, testProject.urls[idx].url);
    }
  });
});
