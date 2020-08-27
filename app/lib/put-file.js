module.exports = function (location, file, headers = {}) {
  const azureHeader = {
    'x-ms-blob-type': 'BlockBlob'
  };
  const allHeaders = Object.assign({}, headers, azureHeader);
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = (e) => {
      let ref;
      if (e.target.readyState === e.target.DONE) {
        if ((200 <= (ref = e.target.status) && ref < 300)) {
          return resolve(e.target);
        } else {
          return reject(e.target);
        }
      }
    };
    xhr.open('PUT', location);
    Object.keys(allHeaders).forEach((header) =>  {
      const value = allHeaders[header];
      xhr.setRequestHeader(header, value);
    })
    return xhr.send(file);
  });
};