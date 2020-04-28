export class HtmlEncode {
  private element: HTMLElement;

  public constructor() {
    this.element = window
      .document
      .createElement('div');
  }

  public encodeHtml(text: string): string {
    this.element.innerText = text;
    return this.element.innerHTML;
  }

  public decodeHtml(value: string): string {
    this.element.innerHTML = value;

    let output = '';
    for (const node of this.element.childNodes) {
      const element = node as HTMLElement;
      if (element !== null && element.nodeName === 'div') {
        if (output.length === 0) {
          output += element.innerText;
        } else {
          output += '\r\n' + element.innerText;
        }
      }
    }

    return output;
  }

  public encodeTextFileToHtml(text: string): string {
    const textWithStandardLineBreaks = text
      .split('\n');

    return textWithStandardLineBreaks.map((line): string => {
      if (line.length === 0) {
        return '<div><br></div>';
      }
      return '<div>' + this.encodeHtml(line) + '</div>';
    })
      .reduce((accumulator, current): string => {
        return accumulator + current;
      });
  }

  public decodeHtmlToTextFile(value: string): string {
    this.element.innerHTML = value;

    let output = '';
    for (const node of this.element.childNodes) {
      if (node.nodeName === 'DIV') {
        const innerText = (node as HTMLElement).innerText

        if (output.length === 0) {
          output += innerText;
        } else {
          output += '\n' + innerText;
        }
      }
    }

    return output;
  }
}
