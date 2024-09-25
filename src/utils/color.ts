// 随机十六进制颜色
const getRandomColor = (sign: string): string => {
  let hash = 0;
  for (let i = 0; i < sign.length; i += 1) {
    hash += sign.charCodeAt(i);
  }

  // eslint-disable-next-line no-bitwise
  return `#${((1 << 24) + (hash % 16777215)).toString(16).slice(1)}`;
};

export default getRandomColor;
