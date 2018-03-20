function getAllLinked(resource, link, query) {
  if (!resource || !link) {
    return Promise.reject(new Error('getAllLinked: resource and link not specified'));
  }

  query = query || {};

  let allLinked = [];

  function getLinkedResource(resource, link, query, page) {
    return resource.get(link, Object.assign({}, query, { page }))
      .then((linked) => {
        allLinked = allLinked.concat(linked);
        const meta = linked[0] ? linked[0].getMeta() : null;
        if (meta && meta.next_page) {
          return getLinkedResource(resource, link, query, meta.next_page);
        }
      })
      .catch((error) => {
        console.info(error);
      })
      .then(() => Promise.resolve(allLinked));
  }

  return getLinkedResource(resource, link, query, 1);
}

export default getAllLinked;
