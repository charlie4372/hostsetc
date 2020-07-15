// https://medium.com/coding-blocks/writing-vuex-modules-in-neat-typescript-classes-9bf7b505e7b5

import {Module, VuexModule, Mutation, Action} from 'vuex-module-decorators'
import {EditorView} from "./types";
import {
  createNewCategory,
  createNewEntry,
  createNewHosts,
  getCategoryFromHosts,
  getCategoryWithEntryFromHosts,
  getEntryFromHosts,
  Hosts,
  HostsCategory,
  HostsEntry,
  isHostsCategory,
  isHostsEntry
} from "@common/hosts";
import {HostsFile} from "@common/hosts-file/HostsFile";
import HostsSerialiser from "@common/hosts-serialiser";
import log from "electron-log";

/*
The serialiser.
 */
const hostsSerialiser = new HostsSerialiser();

/*
Updates the hostsFileContent if the user is currently viewing it.
 */
function updateHostsFileContentIfBeingViewed(module: EditorModule): void {
  if (module.view === 'file') {
    module.hostsFileContent = hostsSerialiser.serialise(module.hosts);
  }
}

/*
Sets the current view to a given entry.
 */
function viewEntry(module: EditorModule, id: string): void {
  module.view = 'entry';
  module.selectedId = id;
}

/*
Sets the current view to a given category.
 */
function viewCategory(module: EditorModule, id: string): void {
  module.view = 'category'
  module.selectedId = id;
}

/*
Formats a value for logging.
 */
function formatForLog(value: HostsEntry | HostsCategory | HostsFile | null): string {
  if (value === null) {
   return '[null]';
  }

  if (isHostsCategory(value) || isHostsEntry(value)) {
    return `[${value.id}] ${value.name}`;
  }

  return value.path;
}

/*
Dumps the value to the log.
 */
function dumpToLog(value: Hosts): void {
  log.info('Dumping hosts.');
  for (const category of value.categories) {
    log.info(` Category: ${formatForLog(category)}`);

    for (const entry of category.entries) {
      log.info(`  Entry: ${formatForLog(entry)}`);
    }
  }
}

/*
Store for the editor data.
If the scope increases much more, this will need a rethink.
 */
@Module({ namespaced: true })
export default class EditorModule extends VuexModule {
  /*
  Determines if the application can be exited.
   */
  public isSaving = false;

  /*
  The selectedId.
   */
  public selectedId: string | null = null;

  /*
  The current view.
   */
  public view: EditorView = "entry";

  /*
  The hosts.
  This will always be the most current value.
   */
  public hosts: Hosts = createNewHosts();

  /*
  The hosts file content.
  This value is allowed to go stale if the user is not currently viewing the hosts file content.
  It will be kept current when the user is viewing the hosts file content.
   */
  public hostsFileContent = '';

  /*
  The path to the hosts file.
   */
  public hostsFilePath = '/etc/hosts';

  /*
  Sets the isSaving.
   */
  @Mutation
  public setIsSaving(value: boolean): void {
    this.isSaving = value;
  }

  /*
  Sets the hosts.
   */
  @Mutation
  public setHosts(value: Hosts): void {
    log.debug(`Settings hosts...`);

    this.hosts = value;
    this.hostsFileContent = hostsSerialiser.serialise(value);

    dumpToLog(value);
    log.info(`Set hosts.`);
  }

  /*
  Sets the current view to a given entry.
   */
  @Mutation
  public viewEntry(id: string): void {
    log.debug(`Viewing entry [${id}]...`);

    viewEntry(this, id);

    log.info(`Viewing entry [${id}].`);
  }

  /*
  Sets the current view to a given category.
   */
  @Mutation
  public viewCategory(id: string): void {
    log.debug(`Viewing category [${id}]...`);

    this.view = 'category'
    this.selectedId = id;

    log.info(`Viewing category [${id}].`);
  }

  /*
  Sets the current view to be the file.
   */
  @Mutation
  public viewFile(): void {
    log.debug('Viewing hosts file...');

    this.view = 'file';
    this.selectedId = null;

    // The hostsFileContent may be out of date, update it.
    this.hostsFileContent = hostsSerialiser.serialise(this.hosts);

    log.info('Viewing hosts file.');
  }

  /*
  Updates an entry.
  This will use value.id to locate the entry to be updated.
   */
  @Mutation
  public updateEntry(value: HostsEntry): void {
    log.debug(`Updating entry ${formatForLog(value)}...`);

    const currentEntry = getEntryFromHosts(this.hosts, value.id);
    if (currentEntry === null) {
      log.error(`Entry ${formatForLog(value)} not found.`);
      throw new Error('Entry not found.');
    }

    // Update the values.
    currentEntry.name = value.name;
    currentEntry.active = value.active;
    currentEntry.content = value.content;

    log.info(`Updated entry ${formatForLog(value)}.`);

    updateHostsFileContentIfBeingViewed(this);
  }

  /*
  Deletes an entry.
  This will use value.id to locate the entry to be deleted.
   */
  @Mutation
  public deleteEntry(value: HostsEntry): void {
    log.debug(`Deleting entry ${formatForLog(value)}...`);

    const category = getCategoryWithEntryFromHosts(this.hosts, value.id);
    if (category === null) {
      log.error(`Category containing entry ${formatForLog(value)} not found.`);
      throw new Error('Category containing entry not found.')
    } else if (category.entries.length === 1) {
      log.error(`Entry ${formatForLog(value)} cannot be deleted.`);
      throw new Error('Entry cannot be deleted.')
    }

    const index = category.entries.findIndex((entry): boolean => entry.id === value.id);
    // More for typescript happiness than anything else.
    if (index === -1) {
      log.error(`Entry ${formatForLog(value)} not found.`);
      throw new Error('Entry not found.');
    }

    category.entries.splice(index, 1);

    // Update the view to be the entry at the same index, or the last available entry for the category.
    const newIndex = index >= category.entries.length - 1 ? category.entries.length - 1 : index;

    log.info(`Deleted entry ${formatForLog(value)}.`);

    viewEntry(this, category.entries[newIndex].id);
  }

  /*
  Adds a new entry to the given category.
  Sets the view to the new entry so that the user can edit it.
   */
  @Mutation
  public addEntry(category: HostsCategory): void {
    log.debug(`Adding entry to ${formatForLog(category)}...`);
    const currentCategory = getCategoryFromHosts(this.hosts, category.id);
    if (currentCategory === null) {
      log.error(`Category ${formatForLog(category)} not found.`);
      throw new Error('Category not found.')
    }

    const newEntry = createNewEntry();
    currentCategory.entries.push(newEntry);

    log.info(`Add entry to ${formatForLog(category)}.`);

    viewEntry(this, newEntry.id);
  }

  /*
  Adds a category.
  Sets the view to the new category so that the user can edit it.
   */
  @Mutation
  public addCategory(): void {
    log.debug('Adding category...');

    const newCategory = createNewCategory();
    this.hosts.categories.push(newCategory);

    log.info('Added category.');

    viewCategory(this, newCategory.id);
  }

  /*
  Updates a category.
  This will use value.id to locate the category to be updated.
   */
  @Mutation
  public updateCategory(value: HostsCategory): void {
    log.debug(`Updating category ${formatForLog(value)}...`);

    const currentCategory = getCategoryFromHosts(this.hosts, value.id);
    if (currentCategory === null) {
      log.error(`Category ${formatForLog(value)} not found.`);
      throw new Error('Category not found.');
    }

    currentCategory.name = value.name;

    log.info(`Updated category ${formatForLog(value)}.`);

    updateHostsFileContentIfBeingViewed(this);
  }

  /*
  Deletes a category.
  This will use value.id to locate the category to be deleted.
   */
  @Mutation
  public deleteCategory(value: HostsCategory): void {
    log.debug(`Deleting category ${formatForLog(value)}...`);

    const index = this.hosts.categories.findIndex((category): boolean => category.id === value.id);
    if (index === -1) {
      log.error(`Category ${formatForLog(value)} not found.`);
      throw new Error('Category not found.');
    }

    this.hosts.categories.splice(index, 1);

    log.info(`Deleted category ${formatForLog(value)}.`);

    viewEntry(this, this.hosts.categories[0].entries[0].id)
  }

  /*
  Updates the hosts file.
  The hosts is also updated at the same time.
   */
  @Mutation
  public updateHostsFile(value: string): void {
    log.debug('Updating hosts file...');

    this.hosts = hostsSerialiser.deserialise(value);
    this.hostsFileContent = value;

    // Hosts must be kept up to date as soon as its changed.
    // Since the ids are not persisted, the items in the drawer and the hosts need to be in sync.
    // If hosts is updated when the view changes, the id of the  drawer item that is clicked on
    // will not be in the newly deserialised hosts.
    this.hosts = hostsSerialiser.deserialise(value);

    dumpToLog(this.hosts);
    log.info('Updated hosts file.');
  }

  @Mutation
  public setHostsFile(hostsFile: HostsFile): void {
    log.debug(`Setting hosts file ${formatForLog(hostsFile)}...`);

    this.hosts = hostsFile.hosts;
    this.hostsFilePath = hostsFile.path;
    this.hostsFileContent =  hostsFile.content;

    dumpToLog(this.hosts);
    log.info(`Set hosts file ${formatForLog(hostsFile)}.`);

    viewEntry(this, this.hosts.categories[0].entries[0].id);

    log.info(`Viewing [${this.selectedId}] ${this.hosts.categories[0].entries[0].name}.`);
  }

  /*
  Loads the hosts file from the system.
  The first entry will be set loaded as the current view.
   */
  // @MutationAction({ mutate: ['hosts', 'hostsFilePath', 'hostsFileContent', 'view', 'selectedId'] })
  // async loadHostsFile(): Promise<{ hosts: Hosts; hostsFilePath: string; hostsFileContent: string; view: AppView; selectedId: string }> {
  @Action
  public async loadHostsFile(): Promise<void> {
    log.debug(`Loading ${this.hostsFilePath}...`);

    const hostsFile = new HostsFile();
    await hostsFile.load(this.hostsFilePath);

    // This should never occur.
    if (hostsFile.hosts === null || hostsFile.content === null) {
      log.error(`Failed to load ${this.hostsFilePath}.`);
      throw new Error('Failed to load the hosts file.')
    }

    this.context.commit('setHostsFile', hostsFile);

    log.info(`Loaded ${this.hostsFilePath}.`);
  }

  /*
  Saves the current hosts to the system.
   */
  @Action
  public async saveHostsFile(): Promise<void> {
    log.debug(`Saving ${this.hostsFilePath}...`);

    this.context.commit('setIsSaving', true);

    try {
      const hostsFile = new HostsFile();
      await hostsFile.load(this.hostsFilePath);
      await hostsFile.save(this.hosts);
    } catch (e) {
      throw e;
    } finally {
      this.context.commit('setIsSaving', false);
    }

    log.info(`Saved ${this.hostsFilePath}.`);
  }

  /*
  Determines if module is doing something where the application cannot be closed.
   */
  public get canApplicationExit(): boolean {
    return !this.isSaving;
  }
}
