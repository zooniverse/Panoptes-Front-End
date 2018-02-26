export function buildLinksWithLabels(navLinks) {
  return Object.keys(navLinks).map((linkName) => {
    return {
      disabled: navLinks[linkName].disabled || false,
      isExternalLink: navLinks[linkName].isExternalLink || false,
      label: linkName,
      url: navLinks[linkName].url
    };
  });
}
