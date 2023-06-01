export default function loadImage(src) {
  function preloadImage(resolve, reject) {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (error) => reject(error);
    img.src = src;
  }
  return new Promise(preloadImage);
}