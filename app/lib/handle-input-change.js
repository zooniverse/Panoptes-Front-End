import DOMPurify from 'dompurify';

export default function handleInputChange(e) {
  /*
  Using this module is a little odd.
  Ensure that it's called in the context of a JSON-API Model instance.
  */
  if (typeof this.update !== 'function' || typeof this.emit !== 'function') {
    throw new Error('Bind the handleInputChange function to a json-api-client Model instance')
  }

  let valueProperty = 'value';
  switch (e.target.type) {
    case 'checkbox': {
      valueProperty = 'checked';
      break;
    }
    case 'file': {
      valueProperty = 'files';
      break;
    }
  }

  const value = e.target[valueProperty];

  if (e.target.dataset?.jsonValue) {
    value = JSON.parse(value);
  }

  const changes = {};
  const isString = typeof value === 'string';
  const sanitizedValue = isString ? DOMPurify.sanitize(value) : value;
  changes[e.target.name] = sanitizedValue;
  this.update(changes);
}
