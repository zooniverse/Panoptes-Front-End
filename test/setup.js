import { JSDOM } from 'jsdom';
import { URL } from 'whatwg-url';
import { globalAgent } from 'http';

// Set up fake DOM for use by Enzyme's mount() method.
const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;

function copyProps(src, target) {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === 'undefined')
    .map(prop => Object.getOwnPropertyDescriptor(src, prop));
  Object.defineProperties(target, props);
}

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js'
};
global.screen = window.screen;
global.pageXOffset = window.pageXOffset;
global.pageYOffset = window.pageYOffset;
global.URL = URL;
global.HTMLElement = window.HTMLElement; // to get chai's deep equality to work
global.addEventListener = window.addEventListener;
global.removeEventListener = window.removeEventListener;
global.getComputedStyle = window.getComputedStyle;
global.innerHeight = window.innerHeight;

copyProps(window, global);
