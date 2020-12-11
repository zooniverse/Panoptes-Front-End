import { expect } from 'chai';
import cleanSubjectData from './cleanSubjectData';

describe('cleanSubjectData', function () {
  const rawData = {
    ' &title': 'a title ',
    description: 'a description',
    '&creator': ' someone ',
    ' date ': ' 2nd March 1888 ',
    ' &bits&bobs': ' some random text '
  };

  let cleanData;

  before(function () {
    cleanData = cleanSubjectData(rawData);
  });

  it('should not alter the subject data', function () {
    expect(rawData).to.deep.equal({
      ' &title': 'a title ',
      description: 'a description',
      '&creator': ' someone ',
      ' date ': ' 2nd March 1888 ',
      ' &bits&bobs': ' some random text '
    });
  });

  it('should trim whitespace', function () {
    expect(cleanData.date).to.equal('2nd March 1888');
  });

  it('should trim leading ampersands', function () {
    expect(cleanData.title).to.equal('a title');
    expect(cleanData.creator).to.equal('someone');
  });

  it('should ignore other ampersands', function () {
    expect(cleanData['bits&bobs']).to.equal('some random text');
  });
});
