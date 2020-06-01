import {Hosts} from "@common/hosts";
import {stripIds} from "../utils";
import HostsSerialiser from "@common/hosts-serialiser";
import {v4 as uuidv4} from "uuid";

test('Does deserialise read file with no headers.', () => {
  const source = '# new file\n' +
    '127.0.0.1 localhost';

  const result = new HostsSerialiser().deserialise(source);
  const resultWithoutIds = stripIds(result);
  expect(resultWithoutIds).toEqual({
    "categories": [
      {
        "entries": [
          {
            "active": true,
            "id": "",
            "name": "Default",
            "content": "# new file\n127.0.0.1 localhost"
          }
        ],
        "id": "",
        "name": "Default"
      }
    ]
  });
});

test('Does deserialise read a file with a hosts header.', () => {
  const source = '####Entry:Entry1A####\n' +
    '# new file\n' +
    '127.0.0.1 localhost';

  const result = new HostsSerialiser().deserialise(source);
  const resultWithoutIds = stripIds(result);
  expect(resultWithoutIds).toEqual({
    "categories": [
      {
        "entries": [
          {
            "active": true,
            "id": "",
            "name": "Entry1A",
            "content": "# new file\n127.0.0.1 localhost"
          }
        ],
        "id": "",
        "name": "Default"
      }
    ]
  });
});

test('Does deserialise read a file with a category header.', () => {
  const source = '####Category:Cat1####\n' +
    '####Entry:Entry1A####\n' +
    '# new file\n' +
    '127.0.0.1 localhost';

  const result = new HostsSerialiser().deserialise(source);
  const resultWithoutIds = stripIds(result);
  expect(resultWithoutIds).toEqual({
    "categories": [
      {
        "entries": [
          {
            "active": true,
            "id": "",
            "name": "Entry1A",
            "content": "# new file\n127.0.0.1 localhost"
          }
        ],
        "id": "",
        "name": "Cat1"
      }
    ]
  });
});

test('Does deserialise detect an active entry.', () => {
  const source = '####Category:Cat1####\n' +
    '####Entry:Entry1A####\n' +
    '# new file\n' +
    '127.0.0.1 localhost\n' +
    '127.0.0.1 one.com';

  const result = new HostsSerialiser().deserialise(source);
  const resultWithoutIds = stripIds(result);
  expect(resultWithoutIds).toEqual({
    "categories": [
      {
        "entries": [
          {
            "active": true,
            "id": "",
            "name": "Entry1A",
            "content": "# new file\n127.0.0.1 localhost\n127.0.0.1 one.com"
          }
        ],
        "id": "",
        "name": "Cat1"
      }
    ]
  });
});

test('Does serialise preserve an active entry.', () => {
  const source = {
    "categories": [
      {
        "entries": [
          {
            "active": true,
            "id": "",
            "name": "Entry1A",
            "content": "# new file\n127.0.0.1 localhost\n127.0.0.1 one.com"
          }
        ],
        "id": "",
        "name": "Cat1"
      }
    ]
  };

  const result = new HostsSerialiser().serialise(source);
  expect(result).toEqual('####Category:Cat1####\n' +
    '####Entry:Entry1A####\n' +
    '# new file\n' +
    '127.0.0.1 localhost\n' +
    '127.0.0.1 one.com');
});

test('Does deserialise detect an inactive entry.', () => {
  const source = '####Category:Cat1####\n' +
    '####Entry:Entry1A####\n' +
    '# new file\n' +
    '#127.0.0.1 localhost\n' +
    '#127.0.0.1 one.com';

  const result = new HostsSerialiser().deserialise(source);
  const resultWithoutIds = stripIds(result);
  expect(resultWithoutIds).toEqual({
    "categories": [
      {
        "entries": [
          {
            "active": false,
            "id": "",
            "name": "Entry1A",
            "content": "# new file\n127.0.0.1 localhost\n127.0.0.1 one.com"
          }
        ],
        "id": "",
        "name": "Cat1"
      }
    ]
  });
});

test('Does serialise preserve an inactive entry.', () => {
  const source = {
    "categories": [
      {
        "entries": [
          {
            "active": false,
            "id": "",
            "name": "Entry1A",
            "content": "# new file\n127.0.0.1 localhost\n127.0.0.1 one.com"
          }
        ],
        "id": "",
        "name": "Cat1"
      }
    ]
  };

  const result = new HostsSerialiser().serialise(source);
  expect(result).toEqual('####Category:Cat1####\n' +
    '####Entry:Entry1A####\n' +
    '# new file\n' +
    '#127.0.0.1 localhost\n' +
    '#127.0.0.1 one.com');
});

test('Does deserialise detect a partially active entry (entry was active).', () => {
  const source = '####Category:Cat1####\n' +
    '####Entry:Entry1A####\n' +
    '# new file\n' +
    '#127.0.0.1 localhost\n' +
    '127.0.0.1 one.com';

  const result = new HostsSerialiser().deserialise(source);
  const resultWithoutIds = stripIds(result);
  expect(resultWithoutIds).toEqual({
    "categories": [
      {
        "entries": [
          {
            "active": true,
            "id": "",
            "name": "Entry1A",
            "content": "# new file\n#127.0.0.1 localhost\n127.0.0.1 one.com"
          }
        ],
        "id": "",
        "name": "Cat1"
      }
    ]
  });
});

test('Does serialise preserve a partially active entry (entry is active).', () => {
  const source = {
    "categories": [
      {
        "entries": [
          {
            "active": true,
            "id": "",
            "name": "Entry1A",
            "content": "# new file\n#127.0.0.1 localhost\n127.0.0.1 one.com"
          }
        ],
        "id": "",
        "name": "Cat1"
      }
    ]
  };

  const result = new HostsSerialiser().serialise(source);
  expect(result).toEqual('####Category:Cat1####\n' +
    '####Entry:Entry1A####\n' +
    '# new file\n' +
    '#127.0.0.1 localhost\n' +
    '127.0.0.1 one.com');
});

test('Does deserialise detect a partially active entry (entry was inactive).', () => {
  const source = '####Category:Cat1####\n' +
    '####Entry:Entry1A####\n' +
    '# new file\n' +
    '##127.0.0.1 localhost\n' +
    '#127.0.0.1 one.com';

  const result = new HostsSerialiser().deserialise(source);
  const resultWithoutIds = stripIds(result);
  expect(resultWithoutIds).toEqual({
    "categories": [
      {
        "entries": [
          {
            "active": false,
            "id": "",
            "name": "Entry1A",
            "content": "# new file\n#127.0.0.1 localhost\n127.0.0.1 one.com"
          }
        ],
        "id": "",
        "name": "Cat1"
      }
    ]
  });
});

test('Does serialise preserve a partially active entry (entry is inactive).', () => {
  const source = {
    "categories": [
      {
        "entries": [
          {
            "active": false,
            "id": "",
            "name": "Entry1A",
            "content": "# new file\n#127.0.0.1 localhost\n127.0.0.1 one.com"
          }
        ],
        "id": "",
        "name": "Cat1"
      }
    ]
  };

  const result = new HostsSerialiser().serialise(source);
  expect(result).toEqual('####Category:Cat1####\n' +
    '####Entry:Entry1A####\n' +
    '# new file\n' +
    '##127.0.0.1 localhost\n' +
    '#127.0.0.1 one.com');
});


test('Does serialise create a valid file and deserialise converts it back', () => {
  const hosts: Hosts = {
    categories: [
      {
        id: uuidv4(),
        name: 'Cat1',
        entries: [
          {
            id: uuidv4(),
            name: 'Entry1A',
            active: true,
            content: '# Entry 1 A\n127.0.0.1 one.com\n127.0.0.2 two.com'
          },
          {
            id: uuidv4(),
            name: 'Entry1B',
            active: false,
            content: '# Entry 1 B\n127.0.1.1 one.com\n127.0.1.2 two.com'
          }
        ]
      },
      {
        id: uuidv4(),
        name: 'Cat2',
        entries: [
          {
            id: uuidv4(),
            name: 'Entry2A',
            active: true,
            content: '127.0.3.1 one.com\n127.0.3.2 two.com'
          }
        ]
      }
    ]
  }

  const fileResult = new HostsSerialiser().serialise(hosts);
  expect(fileResult).toEqual('####Category:Cat1####\n' +
    '####Entry:Entry1A####\n' +
    '# Entry 1 A\n' +
    '127.0.0.1 one.com\n' +
    '127.0.0.2 two.com\n' +
    '####Entry:Entry1B####\n' +
    '# Entry 1 B\n' +
    '#127.0.1.1 one.com\n' +
    '#127.0.1.2 two.com\n' +
    '####Category:Cat2####\n' +
    '####Entry:Entry2A####\n' +
    '127.0.3.1 one.com\n' +
    '127.0.3.2 two.com');

  const hostResult = new HostsSerialiser().deserialise(fileResult);
  const hostResultWithoutIds = stripIds(hostResult);
  expect(hostResultWithoutIds).toEqual(stripIds(hosts));
});

test('Do serialise and deserialise preserve line count (with new line at the end of the file).', () => {
  const source = '####Category:Cat1####\n' +
    '####Entry:Entry1A####\n' +
    '# Entry 1 A\n' +
    '127.0.0.1 one.com\n' +
    '127.0.0.2 two.com\n';

  const serialiser = new HostsSerialiser();
  const hostsResult = serialiser.deserialise(source);
  const fileResult = serialiser.serialise(hostsResult);

  expect(fileResult).toEqual(source);
});

test('Do serialise and deserialise preserve line count (with no new line at the end of the file).', () => {
  const source = '####Category:Cat1####\n' +
    '####Entry:Entry1A####\n' +
    '# Entry 1 A\n' +
    '127.0.0.1 one.com\n' +
    '127.0.0.2 two.com';

  const serialiser = new HostsSerialiser();
  const hostsResult = serialiser.deserialise(source);
  const fileResult = serialiser.serialise(hostsResult);

  expect(fileResult).toEqual(source);
});
