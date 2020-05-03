<template>
  <v-app id="inspire">
    <v-app-bar
      app
      color="indigo"
      dark
    >
      <v-app-bar-nav-icon />
      <v-toolbar-title>Hosted Editor</v-toolbar-title>
    </v-app-bar>

    <v-content>
      <div class="d-flex h-100">
        <app-navigation-drawer
          :hosts="hosts"
          @select-entry="selectEntry($event)"
          @add-entry="startAddingEntry($event)"
          @view-file="onViewFile"
        />
        <v-container
          class="fill-height align-start justify-start flex-column"
          fluid
        >
          <host-entry-editor
            v-if="mode === 'view-entry'"
            class="w-100 h-100 d-flex flex-column"
            :entry="currentEntry"
            :name-readonly="currentEntry === hosts.main"
            :readonly="hosts.readonly"
            @updated="onUpdateEntry"
          />

          <host-entry-editor
            v-else-if="mode === 'add-entry'"
            class="w-100 h-100 d-flex flex-column"
            :adding="true"
            :show-name="true"
            @updated="addEntry"
            @cancel-adding="onCancelAdding"
          />

          <host-category-editor
            v-else-if="mode === 'view-category'"
            class="w-100 h-100 d-flex flex-column"
            :category="currentCategory"
            @updated="updateCategory"
          />

          <host-file-editor
            v-else-if="mode === 'view-file'"
            class="w-100 h-100 d-flex flex-column"
            :content="hostsContent"
            :readonly="hosts.readonly"
            @updated="updateHostsFile"
          />
        </v-container>
      </div>
    </v-content>
    <v-footer
      color="indigo"
      app
    >
      <span class="white--text">&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import {convertFileToHosts, convertHostsToFile, Hosts, HostsCategory, HostsEntry} from '@common/hosts';
  import HostEntryEditor from "@renderer/views/app/HostEntryEditor.vue";
  import {HostsFile} from "@common/hosts-file/HostsFile";
  import HostCategoryEditor from "@renderer/views/app/HostCategoryEditor.vue";
  import AppNavigationDrawer from "@renderer/views/app/AppNavigationDrawer.vue";
  import sampleData from "@renderer/views/app/SampleData";
  import HostFileEditor from "@renderer/views/app/HostFileEditor.vue";

  type viewMode = 'view-entry'|'view-category'|'add-entry'|'add-category'|'view-file';

  // The @Component decorator indicates the class is a Vue component
  @Component({
    components: {
      HostFileEditor,
      HostCategoryEditor,
      HostEntryEditor,
      AppNavigationDrawer
    }
  })
  export default class App extends Vue {
    private sampleData: Hosts = sampleData;

    protected mode: viewMode = "view-entry";
    protected currentCategory: HostsCategory | null = null;
    protected currentEntry: HostsEntry | null = null;
    protected hosts: Hosts = this.sampleData;
    protected hostsFile: HostsFile = new HostsFile();
    protected hostsContent = '';

    public constructor() {
      super();

      // The TS defaults kick in after the constructor.
      // But if they're not there, then they don't register with vue.
      this.$nextTick(() => {
        this.hosts = this.sampleData;
        this.selectEntry(this.hosts.main);
      });
    }

    protected onReload(): void {
      this.hostsFile.load();

      this.hosts = this.hostsFile.hosts;
      this.selectEntry(this.hosts.main);
    }

    protected onUpdateEntry(entry: HostsEntry): void {
      if (this.currentEntry != null) {
        this.currentEntry.name = entry.name;
        this.currentEntry.value = entry.value;
      }
    }

    protected setCurrentCategory(category: HostsCategory): void {
      this.currentCategory = category;
      this.currentEntry = null;
      this.mode = 'view-category';
    }

    protected selectEntry(entry: HostsEntry): void {
      this.mode = 'view-entry';
      this.$nextTick(() => {
        this.currentCategory = null;
        this.currentEntry = entry;
      });
    }

    protected startAddingEntry(category: HostsCategory): void {
      this.mode = 'add-entry';
      this.$nextTick(() => {
        this.currentCategory = category;
        this.currentEntry = null;
      });
    }

    protected addEntry(entry: HostsEntry): void {
      if (this.currentCategory === null) {
        this.hosts.entries.push(entry);
      } else {
        this.currentCategory.entries.push(entry);
      }
    }

    protected updateCategory(category: HostsCategory): void {
      if (this.currentCategory === null) {
        // TODO handle the error
        throw new Error('currentCategory is not set.')
      }
      this.currentCategory.name = category.name;
    }

    protected addCategory(category: HostsCategory): void {
      this.hosts.categories.push(category);
    }

    protected onCancelAdding(): void {
      this.mode = 'view-entry';
      this.$nextTick(() => {
        this.currentCategory = null;
        this.currentEntry = this.hosts.main;
      });
    }

    protected onViewFile(): void {
      this.mode = 'view-file';
      this.$nextTick(() => {
        this.hostsContent = convertHostsToFile(this.hosts);
      });
    }

    protected updateHostsFile(content: string): void {
      this.hosts = convertFileToHosts(content);
    }
  }
</script>

<style scoped lang="scss">
</style>
