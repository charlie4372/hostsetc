// https://medium.com/coding-blocks/writing-vuex-modules-in-neat-typescript-classes-9bf7b505e7b5

import {Module, VuexModule, Mutation} from 'vuex-module-decorators'
import {AppView} from "./types";
import {createNewHosts, getEntryFromHosts, Hosts, HostsEntry} from "@common/hosts";

@Module({ namespaced: true })
export default class AppModule extends VuexModule {
  public selectedId: string | null = null;

  public view: AppView = "entry";

  public hosts: Hosts = createNewHosts();

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

  @Mutation setHosts(value: Hosts): void {
    this.hosts = value;
    this.view = 'entry';
    this.selectedId = value.categories[0].entries[0].id;
  }

  @Mutation updateEntry(value: HostsEntry): void {
    const currentEntry = getEntryFromHosts(this.hosts, value.id);
    // This should never happen.
    if (currentEntry === null) {
      this.hosts.categories[0].entries.push(value);
    } else {
      currentEntry.name = value.name;
      currentEntry.active = value.active;
      currentEntry.value = value.value;
    }
  }

  // @Mutation decrement(delta: number) {this.count-=delta}
  //
  // // action 'incr' commits mutation 'increment' when done with return value as payload
  // @Action({commit: 'increment'}) incr() {return 5}
  // // action 'decr' commits mutation 'decrement' when done with return value as payload
  // @Action({commit: 'decrement'}) decr() {return 5}
}
