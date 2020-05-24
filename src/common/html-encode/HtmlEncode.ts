export class HtmlEncode {
  private readonly element: HTMLElement;

  public constructor() {
    this.element = window
      .document
      .createElement('div');
  }

  public encodeHtml(text: string): string {
    this.element.textContent = text;
    return this.element.innerHTML;
  }

  public encodeTextFileToHtml(text: string): string {
    if (text.length === 0) {
      return '';
    }

    // This only needs to be rendered in one rendering engine. Keep it simple.
    const lines = text
      .split('\n');

    let output = '';
    const lastLineIndex = lines.length - 1;
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex];

      if (line.length === 0) {
        // Do not write out a line break for the last line break in the file.
        if (lineIndex !== lastLineIndex) {
          output += '<div><br></div>';
        }
      } else {
        output += '<div>' + this.encodeHtml(line) + '</div>';
      }
    }

    return output;
  }

  public decodeHtmlToTextFile(value: string): string {
    this.element.innerHTML = value;
    return this.decodeElementToTextFile(this.element);
  }

  private decodeElementToTextFile(element: HTMLElement): string {
    let output = '';
    for (const node of element.childNodes) {
      if (node.nodeName) {
        const nodeName = node.nodeName.toLowerCase();

        if (nodeName === '#text') {
          // Copy the text directly over
          output += (node as HTMLObjectElement).data;
        } else if (nodeName === 'br') {
          // Copy the line breaks over
          output += '\n';
        } else if (node.childNodes.length > 0) {
          // This is not a node with text that we care about.
          // Recurse into the children to convert them to text.
          output += this.decodeElementToTextFile(node as HTMLElement);

          // The following nodes are considered line breaks,
          // however, if the output ends in a line break, ignore it.
          // This is to protect against a bunch of line breaks getting added
          // as all the tags close.
          if (!output.endsWith('\n')) {
            if (nodeName === 'div') {
              output += '\n';
            }
          }
        }
      }
    }

    return output;
  }
}
