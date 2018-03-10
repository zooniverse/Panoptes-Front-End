/* eslint-disable class-methods-use-this */
class TestModel {
  constructor(canvas, metadata, eventHandlers) {
    eventHandlers.resizeCanvas({ width: 100, height: 100 });
    setTimeout(eventHandlers.onLoad, 0);
  }
  update() {
    return null;
  }
}

export default TestModel;
