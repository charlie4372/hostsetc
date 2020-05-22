// https://medium.com/coding-blocks/writing-vuex-modules-in-neat-typescript-classes-9bf7b505e7b5

import {Module, VuexModule, Mutation, MutationAction, Action} from 'vuex-module-decorators'
import {AppView} from "./types";
import {
  convertHostsToFile,
  createNewEntry,
  createNewHosts, getCategoryFromHosts,
  getCategoryWithEntryFromHosts,
  getEntryFromHosts,
  Hosts,
  HostsCategory,
  HostsEntry
} from "@common/hosts";
import {HostsFile} from "@common/hosts-file/HostsFile";

@Module({ namespaced: true })
export default class AppModule extends VuexModule {
  public selectedId: string | null = null;

  public view: AppView = "entry";

  public hosts: Hosts = createNewHosts();

  public hostsFilePath = '/etc/hosts';

  public hostsFileContent = '';

  @Mutation setSelectedId(id: string | null): void {
    this.selectedId = id;
  }

  @Mutation viewEntry(id: string): void {
    this.view = 'entry';
    this.selectedId = id;
  }

  @Mutation viewCategory(id: string): void {
    this.view = 'category'
    this.selectedId = id;
  }

  @Mutation updateEntry(value: HostsEntry): void {
    const currentEntry = getEntryFromHosts(this.hosts, value.id);
    if (currentEntry !== null) {
      currentEntry.name = value.name;
      currentEntry.active = value.active;
      currentEntry.value = value.value;
    }

    this.hostsFileContent = convertHostsToFile(this.hosts);
  }

  @Mutation deleteEntry(value: HostsEntry): void {
    const category = getCategoryWithEntryFromHosts(this.hosts, value.id);
    if (category === null || category.entries.length === 1) {
      return;
    }

    const index = category.entries.findIndex((entry): boolean => entry.id === value.id);
    if (index !== -1) {
      category.entries.splice(index, 1);

      this.view = 'entry';
      const newIndex = index >= category.entries.length - 1 ? category.entries.length - 1 : index;
      this.selectedId = category.entries[newIndex].id;
    }

    this.hostsFileContent = convertHostsToFile(this.hosts);
  }

  @Mutation addEntry(category: HostsCategory): void {
    const currentCategory = getCategoryFromHosts(this.hosts, category.id);
    if (currentCategory !== null) {
      const newEntry = createNewEntry();
      currentCategory.entries.push(newEntry);

      this.view = 'entry';
      this.selectedId = newEntry.id;
    }

    this.hostsFileContent = convertHostsToFile(this.hosts);
  }

  @MutationAction({ mutate: ['hosts', 'hostsFilePath', 'hostsFileContent', 'selectedId'] })
  async loadHostsFile(): Promise<{ hosts: Hosts; hostsFilePath: string; hostsFileContent: string; selectedId: string }> {
    const hostsFile = new HostsFile();
    await hostsFile.load();
    return {
      hosts: hostsFile.hosts || this.hosts,
      hostsFilePath: hostsFile.path,
      hostsFileContent: hostsFile.content || this.hostsFileContent,
      selectedId: hostsFile.hosts ? hostsFile.hosts.categories[0].entries[0].id : this.hosts.categories[0].entries[0].id
    };
  }

  @Action
  async saveHostsFile(): Promise<void> {
    const hostsFile = new HostsFile();
    hostsFile.hosts = this.hosts;
    await hostsFile.save();
  }


  // @Mutation decrement(delta: number) {this.count-=delta}
  //
  // // action 'incr' commits mutation 'increment' when done with return value as payload
  // @Action({commit: 'increment'}) incr() {return 5}
  // // action 'decr' commits mutation 'decrement' when done with return value as payload
  // @Action({commit: 'decrement'}) decr() {return 5}
}
