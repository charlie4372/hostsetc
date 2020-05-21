<template>
  <v-app id="inspire">
    <v-app-bar
      app
      color="indigo"
      dark
    >
      <v-app-bar-nav-icon />
      <v-toolbar-title>Host Etc</v-toolbar-title>
    </v-app-bar>

    <v-content
      class="app__content"
    >
      <div class="d-flex h-100">
        <app-navigation-drawer
          v-model="hosts"
          :changed="changed"
          :current-category-index="currentCategoryIndex"
          :current-entry-index="currentEntryIndex"
          :current-action="currentAction"
          @entry-view="onViewEntry"
          @entry-new="onAddEntry"
          @toggle-entry-active="onToggleEntryActive"
          @category-view="onViewCategory"
          @category-new="onAddCategory"
          @view-hosts-file="onViewHostsFile"
          @reload="onReload"
          @save="onSave"
        />
        <v-container
          class="fill-height align-start justify-start flex-column app__container"
          fluid
        >
          <host-entry-editor
            v-if="currentAction === 'entry-view'"
            class="w-100 h-100 d-flex flex-column"
            :category="currentCategory"
            :name-readonly="currentEntryIndex === 0 && currentCategoryIndex === 0"
            :can-delete="currentCategory.entries.length > 1"
            :value="currentEntry"
            @input="onUpdateEntry"
            @deleted="onDeleteEntry"
          />

          <host-category-editor
            v-else-if="currentAction === 'category-view'"
            class="w-100 d-flex flex-column"
            :can-delete="currentCategoryIndex !== 0"
            :value="currentCategory"
            @input="onUpdateCategory"
            @deleted="onDeleteCategory"
          />

          <host-file-editor
            v-else-if="currentAction === 'file-view'"
            class="w-100 h-100 d-flex flex-column"
            :hosts-path="hostsFile.path"
            :value="hostsContent"
            @input="onUpdateHostsFile"
          />

          <v-snackbar
            v-model="notificationVisible"
            bottom
            right
            multi-line
            :color="notificationColor"
            :timeout="3000"
          >
            {{ notificationText }}
          </v-snackbar>
        </v-container>
      </div>
    </v-content>
    <v-footer
      color="indigo"
      app
    >
      <span class="white--text">&copy; 2020 Charlie Broad</span>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import {
    Hosts,
    HostsCategory,
    HostsEntry,
    convertHostsToFile,
    convertFileToHosts,
    createNewCategory, createNewEntry
  } from '@common/hosts';
  import HostEntryEditor from "@renderer/views/app/HostEntryEditor.vue";
  import {HostsFile} from "@common/hosts-file/HostsFile";
  import HostCategoryEditor from "@renderer/views/app/HostCategoryEditor.vue";
  import AppNavigationDrawer from "@renderer/views/app/AppNavigationDrawer.vue";
  import HostFileEditor from "@renderer/views/app/HostFileEditor.vue";
  import {
    NavigationDrawAction,
    NavigationDrawCategoryEvent,
    NavigationDrawEntryEvent
  } from './app/types';
  import ConfirmButton from "@renderer/components/confirm-button/ConfirmButton.vue";

  // The @Component decorator indicates the class is a Vue component
  @Component({
    components: {
      ConfirmButton,
      HostFileEditor,
      HostCategoryEditor,
      HostEntryEditor,
      AppNavigationDrawer
    }
  })
  export default class App extends Vue {
    protected currentAction: NavigationDrawAction = 'entry-view';
    protected currentCategoryIndex = 0;
    protected currentEntryIndex = 0;
    protected hosts!: Hosts;
    protected hostsFile: HostsFile = new HostsFile();
    protected hostsContent = '';
    protected changed = false;

    protected notificationVisible = false;
    protected notificationText = '';
    protected notificationColor = 'success';

    protected get currentCategory(): HostsCategory {
      return this.hosts.categories[this.currentCategoryIndex];
    }

    protected get currentEntry(): HostsEntry {
      return this.currentCategory.entries[this.currentEntryIndex];
    }

    public constructor() {
      super();

      this.hostsFile.load();
      this.hosts = this.hostsFile.hosts;

      // The TS defaults kick in after the constructor.
      // But if they're not there, then they don't register with vue.
      this.$nextTick(() => {
        this.hosts = this.hostsFile.hosts;
        this.viewEntry(0, 0);
      });
    }

    protected onReload(): void {
      this.hostsFile.load();

      this.hosts = this.hostsFile.hosts;
      this.viewEntry(0, 0);
      this.changed = false;

      this.showNotification('success', 'Reloaded hosts file.');
    }

    protected onSave(): void {
      this.hostsFile.hosts = this.hosts;

      try {
        this.hostsFile.save();
        this.changed = false;
        this.showNotification('success', 'Saved hosts file.');
      } catch (e) {
        console.log(e);
        this.showNotification('error', 'Failed to save hosts file.');
      }
    }

    protected showNotification(color: string, text: string): void {
      this.$nextTick(() => {
        this.notificationText = text;
        this.notificationColor = color;
        this.notificationVisible = true;
      });
    }

    protected onUpdateEntry(entry: HostsEntry): void {
      this.currentEntry.name = entry.name;
      this.currentEntry.value = entry.value;
      this.currentEntry.active = entry.active;
    }

    protected viewEntry(categoryIndex: number, entryIndex: number): void {
      this.currentAction = 'entry-view';
      this.$nextTick(() => {
        this.currentCategoryIndex = categoryIndex;
        this.currentEntryIndex = entryIndex;
      });
    }

    protected onViewEntry(value: NavigationDrawEntryEvent): void {
      this.viewEntry(value.categoryIndex, value.entryIndex);
    }

    protected onToggleEntryActive(value: NavigationDrawEntryEvent): void {
      this.hosts.categories[value.categoryIndex].entries[value.entryIndex].active = !this.hosts.categories[value.categoryIndex].entries[value.entryIndex].active;
      this.changed = true;
    }

    protected onAddEntry(value: NavigationDrawEntryEvent): void {
      this.hosts.categories[value.categoryIndex].entries.push(createNewEntry());
      this.changed = true;

      this.viewEntry(value.categoryIndex, this.hosts.categories[value.categoryIndex].entries.length - 1);
    }

    protected onDeleteEntry(): void {
      const entryIndexToDelete = this.currentEntryIndex;

      if (this.currentEntryIndex === this.currentCategory.entries.length - 1) {
        this.viewEntry(this.currentCategoryIndex, this.currentEntryIndex - 1);
      }
      this.$nextTick(() => {
        this.currentCategory.entries.splice(entryIndexToDelete, 1);
        this.changed = true;
      });
    }

    protected viewCategory(categoryIndex: number): void {
      this.currentAction = 'category-view';
      this.$nextTick(() => {
        this.currentCategoryIndex = categoryIndex;
        this.currentEntryIndex = 0;
      });
    }

    protected onViewCategory(value: NavigationDrawCategoryEvent): void {
      this.viewCategory(value.categoryIndex);
    }

    protected onUpdateCategory(value: HostsCategory): void {
      this.currentCategory.name = value.name;
      this.changed = true;
    }

    protected onAddCategory(): void {
      this.hosts.categories.push(createNewCategory());

      this.viewCategory(this.hosts.categories.length - 1);
    }

    protected onDeleteCategory(): void {
      const categoryIndexToDelete = this.currentCategoryIndex;

      if (this.currentCategoryIndex === this.hosts.categories.length - 1) {
        this.viewCategory(this.currentCategoryIndex - 1);
      }
      this.$nextTick(() => {
        this.hosts.categories.splice(categoryIndexToDelete, 1);
        this.changed = true;
      });
    }

    protected onViewHostsFile(): void {
      this.currentAction = 'file-view';
      this.$nextTick(() => {
        this.hostsContent = convertHostsToFile(this.hosts);
      });
    }

    protected onUpdateHostsFile(content: string): void {
      this.hosts = convertFileToHosts(content);
      this.changed = true;
    }
  }
</script>

<style scoped lang="scss">
  @import "~vuetify/src/styles/settings/colors";

  .app {
    &__content {
      height: 100vh;
    }

    &__container {
      background-color: map_get($grey, 'lighten-1');
      max-width: calc(100vw - 15rem);
    }
  }
</style>
