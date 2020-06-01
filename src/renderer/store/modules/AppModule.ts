// https://medium.com/coding-blocks/writing-vuex-modules-in-neat-typescript-classes-9bf7b505e7b5

import {Module, VuexModule, Mutation, MutationAction, Action} from 'vuex-module-decorators'
import {AppView} from "./types";
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
Store for the app data.
If the scope increases much more, this will need a rethink.
 */
@Module({ namespaced: true })
export default class AppModule extends VuexModule {
  /*
  The selectedId.
   */
  public selectedId: string | null = null;

  /*
  The current view.
   */
  public view: AppView = "entry";

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
  The HostsFile.
   */
  private readonly hostsFile = new HostsFile();

  /*
  The serialiser.
   */
  private readonly hostsSerialiser = new HostsSerialiser();

  /*
  Sets the selectedId.
   */
  @Mutation setSelectedId(id: string | null): void {
    this.selectedId = id;
  }

  /*
  Sets the hosts.
   */
  @Mutation setHosts(value: Hosts): void {
    this.hosts = value;
    this.hostsFileContent = this.hostsSerialiser.serialise(value);
  }

  /*
  Sets the current view to a given entry.
   */
  @Mutation viewEntry(id: string): void {
    this.view = 'entry';
    this.selectedId = id;
  }

  /*
  Sets the current view to a given category.
   */
  @Mutation viewCategory(id: string): void {
    this.view = 'category'
    this.selectedId = id;
  }

  /*
  Sets the current view to be the file.
   */
  @Mutation viewFile(): void {
    this.view = 'file';
    this.selectedId = null;

    // The hostsFileContent may be out of date, update it.
    this.hostsFileContent = this.hostsSerialiser.serialise(this.hosts);
  }

  /*
  Updates the hostsFileContent if the user is currently viewing it.
   */
  private updateHostsFileContentIfBeingViewed(): void {
    if (this.view === 'file') {
      this.hostsFileContent = this.hostsSerialiser.serialise(this.hosts);
    }
  }

  /*
  Updates an entry.
  This will use value.id to locate the entry to be updated.
   */
  @Mutation updateEntry(value: HostsEntry): void {
    const currentEntry = getEntryFromHosts(this.hosts, value.id);
    if (currentEntry === null) {
      throw new Error('Entry not found.');
    }

    // Update the values.
    currentEntry.name = value.name;
    currentEntry.active = value.active;
    currentEntry.content = value.content;

    this.updateHostsFileContentIfBeingViewed();
  }

  /*
  Deletes an entry.
  This will use value.id to locate the entry to be deleted.
   */
  @Mutation deleteEntry(value: HostsEntry): void {
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
    this.viewEntry(category.entries[newIndex].id);
  }

  /*
  Adds a new entry to the given category.
  Sets the view to the new entry so that the user can edit it.
   */
  @Mutation addEntry(category: HostsCategory): void {
    const currentCategory = getCategoryFromHosts(this.hosts, category.id);
    if (currentCategory === null) {
      throw new Error('Category not found.')
    }

    const newEntry = createNewEntry();
    currentCategory.entries.push(newEntry);

    this.viewEntry(newEntry.id);
  }

  /*
  Adds a category.
  Sets the view to the new category so that the user can edit it.
   */
  @Mutation addCategory(): void {
    const newCategory = createNewCategory();
    this.hosts.categories.push(newCategory);

    this.viewCategory(newCategory.id);
  }

  /*
  Updates a category.
  This will use value.id to locate the category to be updated.
   */
  @Mutation updateCategory(value: HostsCategory): void {
    const currentCategory = getCategoryFromHosts(this.hosts, value.id);
    if (currentCategory === null) {
      throw new Error('Category not found.');
    }

    currentCategory.name = value.name;

    this.updateHostsFileContentIfBeingViewed();
  }

  /*
  Deletes a category.
  This will use value.id to locate the category to be deleted.
   */
  @Mutation deleteCategory(value: HostsCategory): void {
    const index = this.hosts.categories.findIndex((category): boolean => category.id === value.id);
    if (index === -1) {
      throw new Error('Category not found.');
    }

    this.hosts.categories.splice(index, 1);

    this.viewEntry(this.hosts.categories[0].entries[0].id)
  }

  /*
  Updates the hosts file.
  The hosts is also updated at the same time.
   */
  @Mutation updateHostsFile(value: string): void {
    this.hosts = this.hostsSerialiser.deserialise(value);
    this.hostsFileContent = value;

    // Hosts must be kept up to date as soon as its changed.
    // Since the ids are not persisted, the items in the drawer and the hosts need to be in sync.
    // If hosts is updated when the view changes, the id of the  drawer item that is clicked on
    // will not be in the newly deserialised hosts.
    this.hosts = this.hostsSerialiser.deserialise(value);
  }


  /*
  Loads the hosts file from the system.
  The first entry will be set loaded as the current view.
   */
  @MutationAction({ mutate: ['hosts', 'hostsFilePath', 'hostsFileContent', 'view', 'selectedId'] })
  async loadHostsFile(): Promise<{ hosts: Hosts; hostsFilePath: string; hostsFileContent: string; view: AppView; selectedId: string }> {
    await this.hostsFile.load();
    // This should never occur.
    if (this.hostsFile.hosts === null || this.hostsFile.content === null) {
      throw new Error('Failed to load the hosts file.')
    }

    return {
      hosts: this.hostsFile.hosts,
      hostsFilePath: this.hostsFile.path,
      hostsFileContent: this.hostsFile.content,
      'entry',
      selectedId: this.hostsFile.hosts.categories[0].entries[0].id
    };
  }

  /*
  Saves the current hosts to the system.
   */
  @Action
  async saveHostsFile(): Promise<void> {
    await this.hostsFile.save(this.hosts);
  }
}
