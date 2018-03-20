function getAllLinked(resource, link, query) {
  if (!resource || !link) {
    return;
  }

  query = query || {};

  let allLinked = [];
  return getLinkedResource(resource, link, query, 1);

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
}

export default getAllLinked;
