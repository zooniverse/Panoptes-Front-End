/* eslint func-names: off, prefer-arrow-callback: off */
import { expect } from 'chai';

import mockPanoptesResource from '../../../../../../../test/mock-panoptes-resource';
import getCompleteness from './getCompleteness';

const mockProject = mockPanoptesResource('projects', {
  completeness: 0.9
});

const mockWorkflowWithRetirementCompleteness = mockPanoptesResource('workflows', {
  completeness: 0.8,
  configuration: {
    stats_completeness_type: 'retirement'
  }
});

const mockWorfklowWithClassificationCompleteness = mockPanoptesResource('workflows', {
  classifications_count: 10500,
  configuration: {
    stats_completeness_type: 'classification'
  },
  retirement: {
    options: {
      count: 3
    }
  },
  subjects_count: 5000
});

const mockWorkflowWithMoreClassificationsThanTotalCount = mockPanoptesResource('workflows', {
  classifications_count: 16000,
  configuration: {
    stats_completeness_type: 'classification'
  },
  retirement: {
    options: {
      count: 3
    }
  },
  subjects_count: 5000
});

const mockCompleteWorkflow = mockPanoptesResource('workflows', {
  completeness: 1
});

describe('getCompleteness', function () {
  it('should return project completeness property', function () {
    expect(getCompleteness(mockProject)).to.equal(0.9);
  });

  it('with workflow with stats by retirement, return workflow completeness property', function () {
    expect(getCompleteness(mockWorkflowWithRetirementCompleteness)).to.equal(0.8);
  });

  it('with workflow with stats by classification, should return workflow calculated completeness accordingly', function () {
    expect(getCompleteness(mockWorfklowWithClassificationCompleteness)).to.equal(0.7);
  });

  it('with workflow with more classifications than totalCount, should return 1', function () {
    expect(getCompleteness(mockWorkflowWithMoreClassificationsThanTotalCount)).to.equal(1);
  });

  it('with complete workflow, should return 1', function () {
    expect(getCompleteness(mockCompleteWorkflow)).to.equal(1);
  });
});
