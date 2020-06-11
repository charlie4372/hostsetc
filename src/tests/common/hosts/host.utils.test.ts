import {
  createNewCategory,
  createNewEntry,
  createNewHosts,
  getCategoryFromHosts,
  getCategoryWithEntryFromHosts,
  getEntryFromHosts,
  Hosts,
  isHostsCategory,
  isHostsEntry,
} from "@common/hosts";

test('Does createNewHosts create a valid hosts entity.', () => {
  const hosts = createNewHosts();
  expect(hosts).toBeTruthy();
  expect(hosts.categories).toBeTruthy();
  expect(hosts.categories.length).toBe(1);

  const category = hosts.categories[0];
  expect(category).toBeTruthy();
  expect(category.name).toBeTruthy();
  expect(category.id).toBeTruthy();
  expect(category.entries).toBeTruthy();
  expect(category.entries.length).toBe(1);

  const entry = category.entries[0];
  expect(entry).toBeTruthy();
  expect(entry.name).toBeTruthy();
  expect(entry.id).toBeTruthy();
  expect(entry.content).toBeDefined();
  expect(entry.active).toBeDefined();
});

test('Does createNewCategory create a valid category.', () => {
  const category = createNewCategory();
  expect(category).toBeTruthy();
  expect(category.name).toBeTruthy();
  expect(category.id).toBeTruthy();
  expect(category.entries).toBeTruthy();
  expect(category.entries.length).toBe(1);

  const entry = category.entries[0];
  expect(entry).toBeTruthy();
  expect(entry.name).toBeTruthy();
  expect(entry.id).toBeTruthy();
  expect(entry.content).toBeDefined();
  expect(entry.active).toBeDefined();
});

test('Does createNewEntry create a valid entry.', () => {
  const entry = createNewEntry();
  expect(entry).toBeTruthy();
  expect(entry.name).toBeTruthy();
  expect(entry.id).toBeTruthy();
  expect(entry.content).toBeDefined();
  expect(entry.active).toBeDefined();
});

test('Does getCategoryFromHosts find the category when it exists.', () =>{
  const categoryToFind = createNewCategory();

  const hosts: Hosts = {
    categories: [
      createNewCategory(),
      categoryToFind
    ]
  };

  const foundCategory = getCategoryFromHosts(hosts, categoryToFind.id);
  expect(foundCategory).toEqual(categoryToFind);
});

test('Does getCategoryFromHosts return null when the category does not exist.', () =>{
  const categoryToFind = createNewCategory();

  const hosts: Hosts = {
    categories: [
      createNewCategory(),
      createNewCategory()
    ]
  };

  const foundCategory = getCategoryFromHosts(hosts, categoryToFind.id);
  expect(foundCategory).toBeNull();
});

test('Does getEntryFromHosts find the entry when it exists.', () =>{
  const entryToFind = createNewEntry();

  const hosts: Hosts = {
    categories: [
      createNewCategory(),
      createNewCategory()
    ]
  };

  hosts.categories[1].entries.push(entryToFind);

  const foundEntry = getEntryFromHosts(hosts, entryToFind.id);
  expect(foundEntry).toEqual(entryToFind);
});

test('Does getEntryFromHosts return null when the entry does not exist.', () =>{
  const entryToFind = createNewEntry();

  const hosts: Hosts = {
    categories: [
      createNewCategory(),
      createNewCategory()
    ]
  };

  const foundEntry = getEntryFromHosts(hosts, entryToFind.id);
  expect(foundEntry).toBeNull();
});

test('Does getCategoryWithEntryFromHosts find the entry when it exists.', () =>{
  const entryToFind = createNewEntry();
  const categoryToFind = createNewCategory();
  categoryToFind.entries.push(entryToFind);

  const hosts: Hosts = {
    categories: [
      createNewCategory(),
      categoryToFind
    ]
  };

  const foundCategory = getCategoryWithEntryFromHosts(hosts, entryToFind.id);
  expect(foundCategory).toEqual(categoryToFind);
});

test('Does getCategoryWithEntryFromHosts return null when the entry does not exist.', () =>{
  const entryToFind = createNewEntry();
  const categoryToFind = createNewCategory();
  categoryToFind.entries.push(entryToFind);

  const hosts: Hosts = {
    categories: [
      createNewCategory(),
      createNewCategory()
    ]
  };

  const foundCategory = getCategoryWithEntryFromHosts(hosts, entryToFind.id);
  expect(foundCategory).toBeNull();
});

test.each([
  ['valid', createNewEntry(), true],
  ['null', null, false],
  ['undefined', undefined, false],
  ['missing active', { id: '', name: '', content: '' }, false],
  ['missing content', { id: '', name: '', active: false }, false],
  ['missing name', { id: '', content: '', active: false }, false],
  ['missing id', { name: '', content: '', active: false }, false]
])('Does isHostsEntry: %s', (_label: string, entry: any, expected: boolean) => {
  expect(isHostsEntry(entry)).toBe(expected);
});

test.each([
  ['valid', createNewCategory(), true],
  ['null', null, false],
  ['undefined', undefined, false],
  ['missing entries', { id: '', name: '' }, false],
  ['missing name', { id: '', content: '', entries: [] }, false],
  ['missing id', { name: '', content: '', entries: [] }, false]
])('Does isHostsCategory: %s', (_label: string, entry: any, expected: boolean) => {
  expect(isHostsCategory(entry)).toBe(expected);
});
