module.exports = (location, file, headers = {}) ->
  new Promise (resolve, reject) =>
    xhr = new XMLHttpRequest
    xhr.onreadystatechange = (e) =>
      if e.target.readyState is e.target.DONE
        if 200 <= e.target.status < 300
          resolve e.target
        else
          reject e.target
    xhr.open 'PUT', location
    xhr.setRequestHeader header, value for header, value of headers
    xhr.send file
