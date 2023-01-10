import { useEffect, useState } from 'react';

async function fetchURL(url) {
  if (url) {
    const response = await fetch(url);
    if (!response.ok) {
      const error = new Error(response.statusText);
      error.status = response.status;
      throw error;
    }
    const body = await response.json();
    return body;
  }
  return null;
}

export default function useManifest(url) {
  const [manifest, setManifest] = useState(null);
  const [error, setError] = useState(null);

  async function loadManifest(url) {
    setError(null);
    setManifest(null);
    try {
      const _manifest = await fetchURL(url);
      setManifest(_manifest);
    } catch (error) {
      setError(error);
      console.error(error);
    }
  }

  useEffect(() => loadManifest(url), [url]);

  return { manifest, error };
}
