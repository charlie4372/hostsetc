import {HtmlEncode} from "@common/html-encode";

test('Does createHtmlEncode override encodeHtml correctly.', () => {
  const htmlEncode = new HtmlEncode();
  const source = 'This has <some> special characters.';

  const encodedResult = htmlEncode.encodeHtml(source);
  expect(encodedResult).toEqual('This has &lt;some&gt; special characters.');

  const decodedResult = htmlEncode.decodeHtmlToTextFile(encodedResult);
  expect(decodedResult).toEqual(source);
});

test('Does encodeTextFileToHtml convert empty string', () => {
  const htmlEncode = new HtmlEncode();
  const source = '';

  const encodedResult = htmlEncode.encodeTextFileToHtml(source);
  expect(encodedResult).toEqual('');

  const decodedResult = htmlEncode.decodeHtmlToTextFile(encodedResult);
  expect(decodedResult).toEqual(source);
});

test('Does encodeTextFileToHtml convert single empty line', () => {
  const htmlEncode = new HtmlEncode();
  const source = '\n';

  const encodedResult = htmlEncode.encodeTextFileToHtml(source);
  expect(encodedResult).toEqual('<div><br></div>');

  const decodedResult = htmlEncode.decodeHtmlToTextFile(encodedResult);
  expect(decodedResult).toEqual(source);
});

test('Does encodeTextFileToHtml convert single line of text', () => {
  const htmlEncode = new HtmlEncode();
  const source = 'First line';

  const encodedResult = htmlEncode.encodeTextFileToHtml(source);
  expect(encodedResult).toEqual('<div>First line</div>');

  const decodedResult = htmlEncode.decodeHtmlToTextFile(encodedResult);
  expect(decodedResult).toEqual('First line\n');
});

test('Does encodeTextFileToHtml convert single line of text, followed by an empty line', () => {
  const htmlEncode = new HtmlEncode();
  const source = 'First line\n';

  const encodedResult = htmlEncode.encodeTextFileToHtml(source);
  expect(encodedResult).toEqual('<div>First line</div>');

  const decodedResult = htmlEncode.decodeHtmlToTextFile(encodedResult);
  expect(decodedResult).toEqual(source);
});

test('Does encodeTextFileToHtml convert two lines of text', () => {
  const htmlEncode = new HtmlEncode();
  const source = 'First line\nSecond line\n';

  const encodedResult = htmlEncode.encodeTextFileToHtml(source);
  expect(encodedResult).toEqual('<div>First line</div><div>Second line</div>');

  const decodedResult = htmlEncode.decodeHtmlToTextFile(encodedResult);
  expect(decodedResult).toEqual(source);
});

test('Does encodeTextFileToHtml convert two lines of text with a single line in between', () => {
  const htmlEncode = new HtmlEncode();
  const source = 'First line\n\nSecond line\n';

  const encodedResult = htmlEncode.encodeTextFileToHtml(source);
  expect(encodedResult).toEqual('<div>First line</div><div><br></div><div>Second line</div>');

  const decodedResult = htmlEncode.decodeHtmlToTextFile(encodedResult);
  expect(decodedResult).toEqual(source);
});

test('Does decodeHtmlToTextFile ignore <spans>', () => {
  const htmlEncode = new HtmlEncode();
  const source = '<div>First <span>line</span></div>';

  const decodedResult = htmlEncode.decodeHtmlToTextFile(source);
  expect(decodedResult).toEqual('First line\n');
});

test('Does decodeHtmlToTextFile process nested line breaks', () => {
  const htmlEncode = new HtmlEncode();
  const source = '<div>First line<br>Second line</div>';

  const decodedResult = htmlEncode.decodeHtmlToTextFile(source);
  expect(decodedResult).toEqual('First line\nSecond line\n');
});

test('Does decodeHtmlToTextFile handle <br> and end of <div>', () => {
  const htmlEncode = new HtmlEncode();
  const source = '<div>First line<br>Second line<br></div><div>Third line</div>';

  const decodedResult = htmlEncode.decodeHtmlToTextFile(source);
  expect(decodedResult).toEqual('First line\nSecond line\nThird line\n');
});
