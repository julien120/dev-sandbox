export const joinBasePath = (base: string, path: string): string => {
  const normalizedBase = base.replace(/\/+$/, '');
  const keepTrailing = path.endsWith('/');
  const normalizedPath = path.replace(/^\/+/, '').replace(/\/+$/, '');
  const joined = `${normalizedBase}/${normalizedPath}`;
  return keepTrailing ? `${joined}/` : joined;
};

export const formatInteger = (value: number, digits = 2): string => {
  return Math.floor(value).toString().padStart(digits, '0');
};
