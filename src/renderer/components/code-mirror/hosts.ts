import CodeMirror from 'codemirror';

CodeMirror.defineSimpleMode('hosts-file', {
  start: [
    { regex: /(?:[0-9]{1,3}\.){3}[0-9]{1,3}/, token: 'number' },
    { regex: /(?:[A-F0-9]{1,4}:){7}[A-F0-9]{1,4}/, token: 'number' },
    { regex: /#.*/, token: 'comment' }
  ],
  comment: [
    { regex: /#.*/, token: 'comment', next: 'start' }
  ]
});
