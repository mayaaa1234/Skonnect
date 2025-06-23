const html = (
  strings: TemplateStringsArray,
  ...values: (string | number)[]
): string =>
  strings.reduce((result, str, i) => result + str + (values[i] ?? ""), "");

export default html;
