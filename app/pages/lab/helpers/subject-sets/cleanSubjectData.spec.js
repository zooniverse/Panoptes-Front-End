import { expect } from 'chai';
import cleanSubjectData from './cleanSubjectData';

describe('cleanSubjectData', () => {
  const rawData = {
    id: 23,
    '%indexedID': 25,
    ' %title': 'a title ',
    description: 'a description',
    '%creator': ' someone ',
    ' date ': ' 2nd March 1888 ',
    ' %bits%bobs': ' some random text '
  };

  let cleanData;

  before(() => {
    cleanData = cleanSubjectData(rawData);
  });

  it('should not alter the subject data', () => {
    expect(rawData).to.deep.equal({
      id: 23,
      '%indexedID': 25,
      ' %title': 'a title ',
      description: 'a description',
      '%creator': ' someone ',
      ' date ': ' 2nd March 1888 ',
      ' %bits%bobs': ' some random text '
    });
  });

  it('should pass through numerical fields', () => {
    expect(cleanData.id).to.equal(23);
  });

  it('should trim whitespace', () => {
    expect(cleanData.date).to.equal('2nd March 1888');
  });

  it('should trim leading percent signs', () => {
    expect(cleanData.indexedID).to.equal(25);
    expect(cleanData.title).to.equal('a title');
    expect(cleanData.creator).to.equal('someone');
  });

  it('should ignore other percent signs', () => {
    expect(cleanData['bits%bobs']).to.equal('some random text');
  });
});
