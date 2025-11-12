export const downloadSvg = (svg: SVGSVGElement, filename: string) => {
  const serializer = new XMLSerializer();
  let source = serializer.serializeToString(svg);
  if (!source.match(/^<svg[^>]+xmlns=/)) {
    source = source.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
  triggerDownload(blob, `${filename}.svg`);
};

export const downloadPng = async (svg: SVGSVGElement, filename: string) => {
  const serializer = new XMLSerializer();
  const source = serializer.serializeToString(svg);
  const image = new Image();
  const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  const padding = 40;
  const width = svg.viewBox.baseVal?.width || svg.clientWidth;
  const height = svg.viewBox.baseVal?.height || svg.clientHeight;

  image.src = url;
  await image.decode();

  const canvas = document.createElement('canvas');
  canvas.width = width + padding;
  canvas.height = height + padding;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    URL.revokeObjectURL(url);
    throw new Error('Canvas context not available');
  }
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, padding / 2, padding / 2, width, height);
  URL.revokeObjectURL(url);

  return new Promise<void>((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        triggerDownload(blob, `${filename}.png`);
      }
      resolve();
    });
  });
};

const triggerDownload = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
