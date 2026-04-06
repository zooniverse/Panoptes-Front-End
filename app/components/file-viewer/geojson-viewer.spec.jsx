// "Passing arrow functions ("lambdas") to Mocha is discouraged" - https://mochajs.org/#arrow-functions
/* eslint prefer-arrow-callback: 0, func-names: 0 */
/* global describe, it */
import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import GeoJSONViewer from './geojson-viewer';

const geoJSONData = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [0, 0]
      },
      properties: {
        uncertainty_radius: 500
      }
    }
  ],
  reference_data: {
    site: 'test site',
    observer: 'test observer'
  }
};

describe('GeoJSONViewer', function () {
  it('renders map and layer components', function () {
    const wrapper = shallow(
      <GeoJSONViewer jsonData={geoJSONData} style={{ height: '300px' }} />
    );
    const map = wrapper.findWhere(function (node) {
      return node.prop('className') === 'ol-map';
    });

    assert.equal(wrapper.hasClass('geojson-viewer'), true);
    assert.equal(map.length, 1);
    assert.equal(React.Children.count(map.prop('children')), 2);
  });

  it('renders reference data when provided', function () {
    const wrapper = shallow(
      <GeoJSONViewer jsonData={geoJSONData} style={{ height: '300px' }} />
    );

    assert.equal(wrapper.find('ReferenceData').length, 1);
    assert.deepEqual(wrapper.find('ReferenceData').prop('data'), geoJSONData.reference_data);
  });

  it('does not render reference data when it is not provided', function () {
    const wrapper = shallow(
      <GeoJSONViewer
        jsonData={{
          type: 'FeatureCollection',
          features: geoJSONData.features
        }}
      />
    );

    assert.equal(wrapper.find('ReferenceData').length, 0);
  });
});