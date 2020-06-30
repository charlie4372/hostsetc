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
  HostsEntry
} from "@common/hosts";
import {HostsFile} from "@common/hosts-file/HostsFile";
import HostsSerialiser from "@common/hosts-serialiser";

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
  Sets the selectedId.
   */
  @Mutation
  public setSelectedId(id: string | null): void {
    this.selectedId = id;
  }

  /*
  Sets the hosts.
   */
  @Mutation
  public setHosts(value: Hosts): void {
    this.hosts = value;
    this.hostsFileContent = hostsSerialiser.serialise(value);
  }

  /*
  Sets the current view to a given entry.
   */
  @Mutation
  public viewEntry(id: string): void {
    viewEntry(this, id);
  }

  /*
  Sets the current view to a given category.
   */
  @Mutation
  public viewCategory(id: string): void {
    this.view = 'category'
    this.selectedId = id;
  }

  /*
  Sets the current view to be the file.
   */
  @Mutation
  public viewFile(): void {
    this.view = 'file';
    this.selectedId = null;

    // The hostsFileContent may be out of date, update it.
    this.hostsFileContent = hostsSerialiser.serialise(this.hosts);
  }

  /*
  Updates an entry.
  This will use value.id to locate the entry to be updated.
   */
  @Mutation
  public updateEntry(value: HostsEntry): void {
    const currentEntry = getEntryFromHosts(this.hosts, value.id);
    if (currentEntry === null) {
      throw new Error('Entry not found.');
    }

    // Update the values.
    currentEntry.name = value.name;
    currentEntry.active = value.active;
    currentEntry.content = value.content;

    updateHostsFileContentIfBeingViewed(this);
  }

  /*
  Deletes an entry.
  This will use value.id to locate the entry to be deleted.
   */
  @Mutation
  public deleteEntry(value: HostsEntry): void {
    const category = getCategoryWithEntryFromHosts(this.hosts, value.id);
    if (category === null) {
      throw new Error('Entry not found.')
    } else if (category.entries.length === 1) {
      throw new Error('Entry cannot be deleted.')
    }

    const index = category.entries.findIndex((entry): boolean => entry.id === value.id);
    // More for typescript happiness than anything else.
    if (index === -1) {
      throw new Error('Entry not found.');
    }

    category.entries.splice(index, 1);

    // Update the view to be the entry at the same index, or the last available entry for the category.
    const newIndex = index >= category.entries.length - 1 ? category.entries.length - 1 : index;

    viewEntry(this, category.entries[newIndex].id);
  }

  /*
  Adds a new entry to the given category.
  Sets the view to the new entry so that the user can edit it.
   */
  @Mutation
  public addEntry(category: HostsCategory): void {
    const currentCategory = getCategoryFromHosts(this.hosts, category.id);
    if (currentCategory === null) {
      throw new Error('Category not found.')
    }

    const newEntry = createNewEntry();
    currentCategory.entries.push(newEntry);

    viewEntry(this, newEntry.id);
  }

  /*
  Adds a category.
  Sets the view to the new category so that the user can edit it.
   */
  @Mutation
  public addCategory(): void {
    const newCategory = createNewCategory();
    this.hosts.categories.push(newCategory);

    viewCategory(this, newCategory.id);
  }

  /*
  Updates a category.
  This will use value.id to locate the category to be updated.
   */
  @Mutation
  public updateCategory(value: HostsCategory): void {
    const currentCategory = getCategoryFromHosts(this.hosts, value.id);
    if (currentCategory === null) {
      throw new Error('Category not found.');
    }

    currentCategory.name = value.name;

    updateHostsFileContentIfBeingViewed(this);
  }

  /*
  Deletes a category.
  This will use value.id to locate the category to be deleted.
   */
  @Mutation
  public deleteCategory(value: HostsCategory): void {
    const index = this.hosts.categories.findIndex((category): boolean => category.id === value.id);
    if (index === -1) {
      throw new Error('Category not found.');
    }

    this.hosts.categories.splice(index, 1);

    viewEntry(this, this.hosts.categories[0].entries[0].id)
  }

  /*
  Updates the hosts file.
  The hosts is also updated at the same time.
   */
  @Mutation
  public updateHostsFile(value: string): void {
    this.hosts = hostsSerialiser.deserialise(value);
    this.hostsFileContent = value;

    // Hosts must be kept up to date as soon as its changed.
    // Since the ids are not persisted, the items in the drawer and the hosts need to be in sync.
    // If hosts is updated when the view changes, the id of the  drawer item that is clicked on
    // will not be in the newly deserialised hosts.
    this.hosts = hostsSerialiser.deserialise(value);
  }

  @Mutation
  public setHostsFile(hostsFile: HostsFile): void {
    this.hosts = hostsFile.hosts;
    this.hostsFilePath = hostsFile.path;
    this.hostsFileContent =  hostsFile.content;
    this.view = 'entry';
    this.selectedId = this.hosts.categories[0].entries[0].id;
  }

  /*
  Loads the hosts file from the system.
  The first entry will be set loaded as the current view.
   */
  // @MutationAction({ mutate: ['hosts', 'hostsFilePath', 'hostsFileContent', 'view', 'selectedId'] })
  // async loadHostsFile(): Promise<{ hosts: Hosts; hostsFilePath: string; hostsFileContent: string; view: AppView; selectedId: string }> {
  @Action
  public async loadHostsFile(): Promise<void> {
    const hostsFile = new HostsFile();
    await hostsFile.load(this.hostsFilePath);

    // This should never occur.
    if (hostsFile.hosts === null || hostsFile.content === null) {
      throw new Error('Failed to load the hosts file.')
    }

    this.context.commit('setHostsFile', hostsFile);
  }

  /*
  Saves the current hosts to the system.
   */
  @Action
  public async saveHostsFile(): Promise<void> {
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
  }

  /*
  Determines if module is doing something where the application cannot be closed.
   */
  public get canApplicationExit(): boolean {
    return !this.isSaving;
  }
}
