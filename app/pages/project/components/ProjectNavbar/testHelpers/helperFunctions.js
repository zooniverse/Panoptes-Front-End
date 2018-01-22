export function buildLinksWithLabels(navLinks) {
  return Object.keys(navLinks).map((linkName) => {
    return {
      isExternalLink: navLinks[linkName].isExternalLink || false,
      label: linkName,
      url: navLinks[linkName].url
    };
  })
}
