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

    assert.strictEqual(rows.length, 3, 'the number of rows should equal the number of links');

    for (const idx of [0, 1, 2]) {
      const inputLabel = wrapper.find(`input[name="urls.${idx}.label"]`).get(0).attribs.value;
      const inputUrl = wrapper.find(`input[name="urls.${idx}.url"]`).get(0).attribs.value;
      const testUrl = testProject.urls[idx];
      assert.strictEqual(inputLabel, testUrl.label, 'the label should match the one passed in');
      assert.strictEqual(inputUrl, testUrl.url, 'the url should match the one passed in');
    }
  });

  it('should not render a table if there are no URLs', () => {
    const wrapper = shallow(<ExternalLinksEditor project={{ urls: [] }} />);
    assert.equal(wrapper.contains('table'), false, `there shouldn't be a table if there are no links`);
  });
});
