// 随机十六进制颜色
const getRandomColor = (sign: string): string => {
  let hash = 0;
  for (let i = 0; i < sign.length; i += 1) {
    hash = sign.charCodeAt(i) + hash * 31;
  }

  // 生成高亮色
  const r = (Math.abs(hash % 256) + 128) % 256; // 保证亮度较高
  const g = (Math.abs((hash * 3) % 256) + 128) % 256; // 保证亮度较高
  const b = (Math.abs((hash * 5) % 256) + 128) % 256; // 保证亮度较高

  // eslint-disable-next-line no-bitwise
  return `#${((1 << 24) | (r << 16) | (g << 8) | b)
    .toString(16)
    .slice(1)
    .toUpperCase()}`;
};

export default getRandomColor;
