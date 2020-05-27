import {convertFileToHosts, convertHostsToFile, Hosts} from "@common/hosts";
import { v4 as uuidv4 } from 'uuid';

/*
Strip the IDs out of the categories nd entries.
Makes assertion easier.
 */
function stripIds(hosts: Hosts): Hosts {
  if (!hosts.categories) {
    return hosts
  }
  for (const cateogry of hosts.categories) {
    cateogry.id = '';

    if (cateogry.entries) {
      for (const entry of cateogry.entries) {
        entry.id = '';
      }
    }
  }

  return hosts;
}

test('Does convertHostsToFile create a valid file and convertFileToHosts converts it back', () => {
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
            value: '# Entry 1 A\n127.0.0.1 one.com\n127.0.0.2 two.com'
          },
          {
            id: uuidv4(),
            name: 'Entry1B',
            active: false,
            value: '# Entry 1 B\n127.0.1.1 one.com\n127.0.1.2 two.com'
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
            value: '127.0.3.1 one.com\n127.0.3.2 two.com'
          }
        ]
      }
    ]
  }

  const fileResult = convertHostsToFile(hosts);
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

  const hostResult = convertFileToHosts(fileResult);
  const hostResultWithoutIds = stripIds(hostResult);
  expect(hostResultWithoutIds).toEqual(stripIds(hosts));
});

test('Does convertFileToHosts read original file.', () => {
  const source = '# new file\n' +
    '127.0.0.1 localhost';

  const result = convertFileToHosts(source);
  const resultWithoutIds = stripIds(result);
  expect(resultWithoutIds).toEqual({
    "categories": [
      {
        "entries": [
          {
            "active": true,
            "id": "",
            "name": "Default",
            "value": "# new file\n127.0.0.1 localhost"
          }
        ],
        "id": "",
        "name": "Default"
      }
    ]
  });
});

test('Does convertFileToHosts read a file with a hosts header.', () => {
  const source = '####Entry:Entry1A####\n' +
    '# new file\n' +
    '127.0.0.1 localhost';

  const result = convertFileToHosts(source);
  const resultWithoutIds = stripIds(result);
  expect(resultWithoutIds).toEqual({
    "categories": [
      {
        "entries": [
          {
            "active": true,
            "id": "",
            "name": "Entry1A",
            "value": "# new file\n127.0.0.1 localhost"
          }
        ],
        "id": "",
        "name": "Default"
      }
    ]
  });
});

test('Does convertFileToHosts read a file with a category header.', () => {
  const source = '####Category:Cat1####\n' +
    '####Entry:Entry1A####\n' +
    '# new file\n' +
    '127.0.0.1 localhost';

  const result = convertFileToHosts(source);
  const resultWithoutIds = stripIds(result);
  expect(resultWithoutIds).toEqual({
    "categories": [
      {
        "entries": [
          {
            "active": true,
            "id": "",
            "name": "Entry1A",
            "value": "# new file\n127.0.0.1 localhost"
          }
        ],
        "id": "",
        "name": "Cat1"
      }
    ]
  });
});

test('Does convertFileToHosts detect an inactive entry.', () => {
  const source = '####Category:Cat1####\n' +
    '####Entry:Entry1A####\n' +
    '# new file\n' +
    '#127.0.0.1 localhost\n' +
    '#127.0.0.1 one.com';

  const result = convertFileToHosts(source);
  const resultWithoutIds = stripIds(result);
  expect(resultWithoutIds).toEqual({
    "categories": [
      {
        "entries": [
          {
            "active": false,
            "id": "",
            "name": "Entry1A",
            "value": "# new file\n127.0.0.1 localhost\n127.0.0.1 one.com"
          }
        ],
        "id": "",
        "name": "Cat1"
      }
    ]
  });
});

test('Does convertFileToHosts detect a partially active entry.', () => {
  const source = '####Category:Cat1####\n' +
    '####Entry:Entry1A####\n' +
    '# new file\n' +
    '127.0.0.1 localhost\n' +
    '#127.0.0.1 one.com';

  const result = convertFileToHosts(source);
  const resultWithoutIds = stripIds(result);
  expect(resultWithoutIds).toEqual({
    "categories": [
      {
        "entries": [
          {
            "active": true,
            "id": "",
            "name": "Entry1A",
            "value": "# new file\n127.0.0.1 localhost\n#127.0.0.1 one.com"
          }
        ],
        "id": "",
        "name": "Cat1"
      }
    ]
  });
});


test('Do convertHostsToFile and convertFileToHosts preserve line count (with new line at the end of the file).', () => {
  const source = '####Category:Cat1####\n' +
    '####Entry:Entry1A####\n' +
    '# Entry 1 A\n' +
    '127.0.0.1 one.com\n' +
    '127.0.0.2 two.com\n';

  const hostsResult = convertFileToHosts(source);
  const fileResult = convertHostsToFile(hostsResult);

  expect(fileResult).toEqual(source);
});

test('Do convertHostsToFile and convertFileToHosts preserve line count (with no new line at the end of the file).', () => {
  const source = '####Category:Cat1####\n' +
    '####Entry:Entry1A####\n' +
    '# Entry 1 A\n' +
    '127.0.0.1 one.com\n' +
    '127.0.0.2 two.com';

  const hostsResult = convertFileToHosts(source);
  const fileResult = convertHostsToFile(hostsResult);

  expect(fileResult).toEqual(source);
});
