import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import Fan from './fan';

describe('Fan Tool', function () {
  let mark;
  const x = 200;
  const y = 400;
  const cursors = [
    {
      x: 250,
      y: 350
    },
    {
      x: 250,
      y: 450
    },
    {
      x: 150,
      y: 350
    },
    {
      x: 150,
      y: 450
    }
  ];
  const rotations = [-45, 45, -135, 135];
  before(function () {
    mark = Fan.initStart({ x, y });
  });
  it('should create a mark at a given position', function () {
    expect(mark.x).to.equal(x);
    expect(mark.y).to.equal(y);
    expect(mark._inProgress).to.be.true;
  });
  it('should update mark rotation after a cursor move', function () {
    cursors.forEach(function (cursor, i) {
      const newMark = Fan.initMove(cursor, mark);
      expect(newMark.rotation).to.equal(rotations[i]);
    });
  });
  it('should update mark radius after a cursor move', function () {
    const cursor = {
      x: 170,
      y: 360
    };
    const newMark = Fan.initMove(cursor, mark);
    expect(newMark.radius).to.equal(50);
  });
  it('should finish drawing on initial release', function () {
    const newMark = Fan.initRelease();
    expect(newMark._inProgress).to.be.false;
  });
});