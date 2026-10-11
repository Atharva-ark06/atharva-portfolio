
/**
 * Use the browser's image loading to load an image and
 * grab the src it chooses from a srcSet.
 */
export async function loadImageFromSrcSet({ src, srcSet, sizes }) {
  return new Promise((resolve, reject) => {
    let tempImage;

    try {
      if (!src && !srcSet) {
        throw new Error('No image src or srcSet provided');
      }

      tempImage = new Image();

      const onLoad = () => {
        const source = tempImage.currentSrc || tempImage.src;

        tempImage.removeEventListener('load', onLoad);
        tempImage.removeEventListener('error', onError);
        tempImage = null;

        resolve(source);
      };

      const onError = () => {
        tempImage.removeEventListener('load', onLoad);
        tempImage.removeEventListener('error', onError);
        tempImage = null;

        reject(new Error(`Failed to load image: ${src || srcSet}`));
      };

      tempImage.addEventListener('load', onLoad);
      tempImage.addEventListener('error', onError);

      if (sizes) {
        tempImage.sizes = sizes;
      }

      if (srcSet) {
        tempImage.srcset = srcSet;
      }

      if (src) {
        tempImage.src = src;
      }
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Generate a transparent PNG of a given width and height.
 */
export async function generateImage(width = 1, height = 1) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');

    if (!ctx) {
      canvas.remove();
      reject(new Error('Could not create canvas context'));
      return;
    }

    ctx.clearRect(0, 0, width, height);

    canvas.toBlob(blob => {
      canvas.remove();

      if (!blob) {
        reject(new Error('Failed to generate transparent image'));
        return;
      }

      resolve(URL.createObjectURL(blob));
    }, 'image/png');
  });
}

/**
 * Resolve the image URL selected by the browser from a srcSet.
 * Also supports ordinary URLs such as /static/ocean-ai.png.
 */
export async function resolveSrcFromSrcSet({ srcSet, sizes }) {
  if (!srcSet || typeof srcSet !== 'string') {
    throw new Error('A valid srcSet is required to resolve an image URL');
  }

  const entries = srcSet
    .split(',')
    .map(entry => entry.trim())
    .filter(Boolean);

  if (entries.length === 0) {
    throw new Error('The srcSet contains no image sources');
  }

  // A normal URL is not a responsive srcSet.
  // Return it directly instead of trying to read a missing width.
  if (entries.length === 1 && !/\s+\d+w$/.test(entries[0])) {
    return entries[0];
  }

  const sources = await Promise.all(
    entries.map(async entry => {
      const match = entry.match(/^(\S+)\s+(\d+)w$/);

      if (!match) {
        throw new Error(`Invalid responsive srcSet entry: ${entry}`);
      }

      const [, src, widthText] = match;
      const width = Number(widthText);
      const image = await generateImage(width);

      return {
        src,
        image,
        width: `${width}w`,
      };
    })
  );

  try {
    const fakeSrcSet = sources
      .map(({ image, width }) => `${image} ${width}`)
      .join(', ');

    const fakeSrc = await loadImageFromSrcSet({
      srcSet: fakeSrcSet,
      sizes,
    });

    const output = sources.find(source => source.image === fakeSrc);

    if (!output) {
      throw new Error('Could not resolve an image from the provided srcSet');
    }

    return output.src;
  } finally {
    // Release temporary images created for responsive source selection.
    sources.forEach(({ image }) => URL.revokeObjectURL(image));
  }
}
