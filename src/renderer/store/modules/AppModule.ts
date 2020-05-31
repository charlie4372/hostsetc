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

@Module({ namespaced: true })
export default class AppModule extends VuexModule {
  public selectedId: string | null = null;

  public view: AppView = "entry";

  public hosts: Hosts = createNewHosts();

  public hostsFilePath = '/etc/hosts';

  public hostsFileContent = '';

  private readonly hostsFile = new HostsFile();

  private readonly hostsSerialiser = new HostsSerialiser();

  @Mutation setSelectedId(id: string | null): void {
    this.selectedId = id;
  }

  @Mutation setHosts(value: Hosts): void {
    this.hosts = value;
    this.hostsFileContent = this.hostsSerialiser.serialise(value);
  }

  @Mutation viewEntry(id: string): void {
    this.view = 'entry';
    this.selectedId = id;
  }

  @Mutation viewCategory(id: string): void {
    this.view = 'category'
    this.selectedId = id;
  }

  @Mutation viewFile(): void {
    this.view = 'file';
    this.selectedId = null;
  }

  @Mutation updateEntry(value: HostsEntry): void {
    const currentEntry = getEntryFromHosts(this.hosts, value.id);
    if (currentEntry === null) {
      throw new Error('Entry not found.');
    }

    currentEntry.name = value.name;
    currentEntry.active = value.active;
    currentEntry.content = value.content;

    this.hostsFileContent = this.hostsSerialiser.serialise(this.hosts);
  }

  @Mutation deleteEntry(value: HostsEntry): void {
    const category = getCategoryWithEntryFromHosts(this.hosts, value.id);
    if (category === null || category.entries.length === 1) {
      throw new Error('Entry not found.')
    }

    const index = category.entries.findIndex((entry): boolean => entry.id === value.id);
    if (index === -1) {
      throw new Error('Entry not found.');
    }

    category.entries.splice(index, 1);

    this.view = 'entry';
    const newIndex = index >= category.entries.length - 1 ? category.entries.length - 1 : index;
    this.selectedId = category.entries[newIndex].id;

    this.hostsFileContent = this.hostsSerialiser.serialise(this.hosts);
  }

  @Mutation addEntry(category: HostsCategory): void {
    const currentCategory = getCategoryFromHosts(this.hosts, category.id);
    if (currentCategory === null) {
      throw new Error('Category not found.')
    }

    const newEntry = createNewEntry();
    currentCategory.entries.push(newEntry);

    this.view = 'entry';
    this.selectedId = newEntry.id;

    this.hostsFileContent = this.hostsSerialiser.serialise(this.hosts);
  }

  @Mutation addCategory(): void {
    const newCategory = createNewCategory();
    this.hosts.categories.push(newCategory);

    this.view = 'category';
    this.selectedId = newCategory.id;

    this.hostsFileContent = this.hostsSerialiser.serialise(this.hosts);
  }

  @Mutation updateCategory(value: HostsCategory): void {
    const currentCategory = getCategoryFromHosts(this.hosts, value.id);
    if (currentCategory === null) {
      throw new Error('Category not found.');
    }

    currentCategory.name = value.name;

    this.hostsFileContent = this.hostsSerialiser.serialise(this.hosts);
  }

  @Mutation deleteCategory(value: HostsCategory): void {
    const index = this.hosts.categories.findIndex((category): boolean => category.id === value.id);
    if (index === -1) {
      throw new Error('Category not found.');
    }

    this.hosts.categories.splice(index, 1);

    this.view = 'entry';
    this.selectedId = this.hosts.categories[0].entries[0].id;

    this.hostsFileContent = this.hostsSerialiser.serialise(this.hosts);
  }

  @Mutation updateHostsFile(value: string): void {
    this.hosts = this.hostsSerialiser.deserialise(value);
    this.hostsFileContent = value;
  }

  @MutationAction({ mutate: ['hosts', 'hostsFilePath', 'hostsFileContent', 'selectedId'] })
  async loadHostsFile(): Promise<{ hosts: Hosts; hostsFilePath: string; hostsFileContent: string; selectedId: string }> {
    await this.hostsFile.load();
    // This should never occur.
    if (this.hostsFile.hosts === null || this.hostsFile.content === null) {
      throw new Error('Failed to load the hosts file.')
    }

    return {
      hosts: this.hostsFile.hosts,
      hostsFilePath: this.hostsFile.path,
      hostsFileContent: this.hostsFile.content,
      selectedId: this.hostsFile.hosts.categories[0].entries[0].id
    };
  }

  @Action
  async saveHostsFile(): Promise<void> {
    const hostsFile = new HostsFile();
    await hostsFile.save(this.hosts);
  }


  // @Mutation decrement(delta: number) {this.count-=delta}
  //
  // // action 'incr' commits mutation 'increment' when done with return value as payload
  // @Action({commit: 'increment'}) incr() {return 5}
  // // action 'decr' commits mutation 'decrement' when done with return value as payload
  // @Action({commit: 'decrement'}) decr() {return 5}
}
