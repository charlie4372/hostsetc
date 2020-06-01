import 'regenerator-runtime/runtime';

import {TestFileSystemAdapter} from "./TestFileSystemAdapter";
import HostsFile from "@common/hosts-file";
import {stripIds} from "../utils";

test('Does load read the file.', async () => {
  const fileSystem = new TestFileSystemAdapter();
  await fileSystem.writeFile('/etc/hosts', '127.0.0.1 localhost');

  const hostFile = new HostsFile(fileSystem);
  await hostFile.load();
  expect(hostFile.path).toEqual('/etc/hosts');
  expect(hostFile.content).toEqual('127.0.0.1 localhost');
  expect(stripIds(hostFile.hosts)).toEqual({
    categories: [{
      name: 'Default',
      id: '',
      entries: [{
        id: '',
        name: 'Default',
        content: '127.0.0.1 localhost',
        active: true
      }]
    }]
  });
});

test('Does save write content to a file.', async () => {
  const fileSystem = new TestFileSystemAdapter();
  await fileSystem.writeFile('/etc/hosts', '127.0.0.1 localhost');

  const hostFile = new HostsFile(fileSystem);
  await hostFile.load();

  await hostFile.save('192.168.0.1 test.com');

  expect(hostFile.path).toEqual('/etc/hosts');
  expect(hostFile.content).toEqual('192.168.0.1 test.com');
  expect(stripIds(hostFile.hosts)).toEqual({
    categories: [{
      name: 'Default',
      id: '',
      entries: [{
        id: '',
        name: 'Default',
        content: '192.168.0.1 test.com',
        active: true
      }]
    }]
  });
});

test('Does save write hosts entity to a file.', async () => {
  const fileSystem = new TestFileSystemAdapter();
  await fileSystem.writeFile('/etc/hosts', '127.0.0.1 localhost');

  const hostFile = new HostsFile(fileSystem);
  await hostFile.load();

  await hostFile.save({
    categories: [{
      name: 'Cat1',
      id: '',
      entries: [{
        id: '',
        name: 'Entry1',
        content: '192.168.0.1 test.com',
        active: true
      }]
    }]
  });

  expect(hostFile.path).toEqual('/etc/hosts');
  expect(hostFile.content).toEqual('####Category:Cat1####\n' +
    '####Entry:Entry1####\n' +
    '192.168.0.1 test.com');
  expect(stripIds(hostFile.hosts)).toEqual({
    categories: [{
      name: 'Cat1',
      id: '',
      entries: [{
        id: '',
        name: 'Entry1',
        content: '192.168.0.1 test.com',
        active: true
      }]
    }]
  });
});
