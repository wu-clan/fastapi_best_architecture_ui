function convertToCamelCase(input: string): string {
  // 去除开头的下划线或连字符
  let camelCase = input.replace(/^[_-]+/, '');
  // 将字符串切片并转换为小写字母开头的驼峰式命名
  camelCase = camelCase.replace(/[-_](.)/g, (_, char) => char.toUpperCase());
  // 将首字母转换为小写字母
  camelCase = camelCase.charAt(0).toLowerCase() + camelCase.slice(1);
  return camelCase;
}

export default convertToCamelCase;
