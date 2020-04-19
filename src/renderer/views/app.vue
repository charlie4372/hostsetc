<template>
  <v-app id="inspire">
    <v-app-bar
      app
      color="indigo"
      dark
    >
      <v-app-bar-nav-icon />
      <v-toolbar-title>Application</v-toolbar-title>
    </v-app-bar>

    <v-content>
      <div class="d-flex h-100">
        <app-navigation-drawer
          :hosts="hosts"
          @select-entry="selectEntry($event)"
          @add-entry="addEntry($event)"
        ></app-navigation-drawer>
        <v-container
          class="fill-height align-start justify-start flex-column"
          fluid
        >
          <host-entry-editor
            v-if="mode === 'view-entry'"
            :entry="currentEntry"
            @updated="onUpdateEntry"
            :show-name="showNameOnHostedEditor"
            :readonly="hosts.readonly"
            >
          </host-entry-editor>

          <host-entry-editor
            v-else-if="mode === 'add-entry'"
            :adding="true"
            @updated="onAddEntry"
            :show-name="true"
          >
          </host-entry-editor>

          <host-category-editor
            v-else-if="mode === 'view-category'"
            :category="currentCategory"
            @updated="onUpdateCategory"
            ></host-category-editor>
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
  import {Hosts, HostsCategory, HostsEntry} from '@common/hosts';
  import HostEntryEditor from "@renderer/views/app/HostEntryEditor.vue";
  import {HostsFile} from "@common/hosts-file/HostsFile";
  import HostCategoryEditor from "@renderer/views/app/HostCategoryEditor.vue";
  import AppNavigationDrawer from "@renderer/views/app/AppNavigationDrawer.vue";

  type viewMode = 'view-entry'|'view-category'|'add-entry'|'add-category';

  // The @Component decorator indicates the class is a Vue component
  @Component({
    components: {
      HostCategoryEditor,
      HostEntryEditor,
      AppNavigationDrawer
    }
  })
  export default class App extends Vue {
    private sampleData: Hosts = {
      readonly: false,
      main: {
        value: '127.0.0.1  localhost\r\n127.0.0.1  www.hosts-editor.com.au\r\n127.0.0.1  api.hosts-editor.com.au'
      },
      categories: [
        {
          name: 'Staging',
          entries: [
            {
              name: 'VM1',
              value: '10.0.51.1  www.hosts-editor.com.au\r\n10.0.51.2  api.hosts-editor.com.au'
            },
            {
              name: 'VM2',
              value: '10.0.52.1  www.hosts-editor.com.au\r\n10.0.52.2  api.hosts-editor.com.au'
            }
          ]
        },
        {
          name: 'AWS',
          entries: [
            {
              name: 'Australia East',
              value: '192.168.51.1  www.hosts-editor.com.au\r\n192.168.51.2  api.hosts-editor.com.au'
            },
            {
              name: 'US West',
              value: '192.168.52.1  www.hosts-editor.com.au\r\n192.168.52.2  api.hosts-editor.com.au'
            }
          ]
        },
        {
          name: 'Azure',
          entries: [
            {
              name: 'Australia East',
              value: '192.168.50.1  staging.hosts-editor.com.au'
            },
            {
              name: 'US West',
              value: '192.168.50.2  staging.hosts-editor.com.au'
            }
          ]
        }
      ]
    }

    private mode: viewMode = "view-entry";
    private currentCategory: HostsCategory | null = null;
    private currentEntry: HostsEntry | null = null;
    private hosts: Hosts = this.sampleData;

    private hostsFile: HostsFile = new HostsFile();

    private showNameOnHostedEditor: boolean = false

    public constructor() {
      super();

      // The TS defaults kick in after the constructor.
      // But if they're not there, then they don't register with vue.
      this.$nextTick(() => {
        this.hosts = this.sampleData;
        this.selectEntry(this.hosts.main);
      });
    }

    private onHostEntryClick(entry: HostsEntry): void {
      this.selectEntry(entry);
    }

    private onHostCategoryClick(category: HostsCategory): void {
      this.setCurrentCategory(category);
    }

    private onReload(): void {
      this.hostsFile.load();

      this.hosts = this.hostsFile.hosts;
      this.selectEntry(this.hosts.main);
    }

    private onUpdateEntry(entry: HostsEntry): void {
      if (this.currentEntry != null) {
        this.currentEntry.name = entry.name;
        this.currentEntry.value = entry.value;
      }
    }

    private setCurrentCategory(category: HostsCategory): void {
      this.currentCategory = category;
      this.currentEntry = null;
      this.mode = 'view-category';
    }

    private selectEntry(entry: HostsEntry): void {
      this.mode = 'view-entry';
      this.currentCategory = null;
      this.currentEntry = entry;

      // TODO work out when the Main item is selected
      this.showNameOnHostedEditor = entry.name !== undefined;
    }

    private addEntry(category: HostsCategory): void {
      this.currentEntry = null;
      this.currentCategory = category;
      this.mode = 'add-entry';
    }

    private onAddEntry(category: HostsCategory): void {
    }

    private onUpdateCategory(category: HostsCategory): void {

    }
  }
</script>

<style scoped lang="scss">
</style>
