// 转换为小字母开头的驼峰命名
function convertToCamelCase(input: string): string {
  let camelCase = input.replace(/^[_-]+/, '');
  camelCase = camelCase.replace(/[-_](.)/g, (_, char) => char.toUpperCase());
  camelCase = camelCase.charAt(0).toLowerCase() + camelCase.slice(1);
  return camelCase;
}

export default convertToCamelCase;
