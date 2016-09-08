function getColorFromString(string) {
  const characters = string.split('');
  let hue = characters.reduce((code, character) => {
    // Square the number so that e.g. "a" and "b" aren't so close.
    return code + Math.pow(character.charCodeAt(0), 2);
  }, 0);
  const saturation = 50 + (hue % 50);
  hue %= 360;
  return `hsl(${hue}, ${saturation}%, 50%)`;
}

export default getColorFromString;
