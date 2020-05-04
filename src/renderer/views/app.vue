<template>
  <v-app id="inspire">
    <v-app-bar
      app
      color="indigo"
      dark
    >
      <v-app-bar-nav-icon />
      <v-toolbar-title>Host File Editor</v-toolbar-title>
    </v-app-bar>

    <v-content>
      <div class="d-flex h-100">
        <app-navigation-drawer
          :hosts="hosts"
          :changed="changed"
          :current-category-index="currentCategoryIndex"
          :current-entry-index="currentEntryIndex"
          :current-action="currentAction"
          @view-entry="onViewEntry"
          @add-entry="onAddEntry"
          @toggle-entry-active="onToggleEntryActive"
          @view-category="onViewCategory"
          @add-category="onAddCategory"
          @view-hosts-file="onViewHostsFile"
          @reload="onReload"
          @save="onSave"
        />
        <v-container
          class="fill-height align-start justify-start flex-column app-container"
          fluid
        >
          <host-entry-editor
            v-if="currentAction === 'view-entry'"
            class="w-100 h-100 d-flex flex-column"
            :category="currentCategory"
            :entry="currentEntry"
            :name-readonly="currentEntryIndex === 0 && currentCategoryIndex === 0"
            :readonly="hosts.readonly"
            :can-delete="currentEntryIndex !== 0"
            @updated="onEntryUpdated"
            @deleted="onEntryDeleted"
          />

          <host-entry-editor
            v-else-if="currentAction === 'add-entry'"
            class="w-100 h-100 d-flex flex-column"
            :category="currentCategory"
            :adding="true"
            :show-name="true"
            @updated="onEntryAdded"
            @cancel-adding="onEntryCancelAdding"
          />

          <host-category-editor
            v-else-if="currentAction === 'view-category'"
            class="w-100 d-flex flex-column"
            :category="currentCategory"
            :can-delete="currentCategoryIndex !== 0"
            @updated="onCategoryUpdated"
            @deleted="onCategoryDeleted"
          />

          <host-category-editor
            v-else-if="currentAction === 'add-category'"
            class="w-100 d-flex flex-column"
            :adding="true"
            @updated="onCategoryAdded"
            @cancel-adding="onCategoryCancelAdding"
          />

          <host-file-editor
            v-else-if="currentAction === 'view-file'"
            class="w-100 h-100 d-flex flex-column"
            :content="hostsContent"
            :readonly="hosts.readonly"
            :hosts-path="hostsFile.path"
            @updated="onUpdateHostsFile"
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
  import {Hosts, HostsCategory, HostsEntry, convertHostsToFile, convertFileToHosts} from '@common/hosts';
  import HostEntryEditor from "@renderer/views/app/HostEntryEditor.vue";
  import {HostsFile} from "@common/hosts-file/HostsFile";
  import HostCategoryEditor from "@renderer/views/app/HostCategoryEditor.vue";
  import AppNavigationDrawer from "@renderer/views/app/AppNavigationDrawer.vue";
  import HostFileEditor from "@renderer/views/app/HostFileEditor.vue";
  import {NavigationDrawAction, NavigationDrawSelection} from './app/types';
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
    protected currentAction: NavigationDrawAction = 'view-entry';
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

    protected onEntryUpdated(entry: HostsEntry): void {
      this.currentEntry.name = entry.name;
      this.currentEntry.value = entry.value;
      this.currentEntry.active = entry.active;
      this.changed = true;
    }

    protected onEntryAdded(entry: HostsEntry): void {
      this.currentCategory.entries.push(entry);
      this.viewEntry(this.currentCategoryIndex, this.currentCategory.entries.length - 1);
      this.changed = true;
    }

    protected viewEntry(categoryIndex: number, entryIndex: number): void {
      this.currentAction = 'view-entry';
      this.$nextTick(() => {
        this.currentCategoryIndex = categoryIndex;
        this.currentEntryIndex = entryIndex;
      });
    }

    protected onViewEntry(value: NavigationDrawSelection): void {
      this.viewEntry(value.categoryIndex, value.entryIndex);
    }

    protected onToggleEntryActive(value: NavigationDrawSelection): void {
      this.hosts.categories[value.categoryIndex].entries[value.entryIndex].active = !this.hosts.categories[value.categoryIndex].entries[value.entryIndex].active;
      this.changed = true;
    }

    protected onAddEntry(value: NavigationDrawSelection): void {
      this.currentAction = 'add-entry';
      this.$nextTick(() => {
        this.currentCategoryIndex = value.categoryIndex;
        this.currentEntryIndex = value.entryIndex;
      });
    }

    protected onEntryDeleted(): void {
      this.currentCategory.entries.splice(this.currentEntryIndex, 1);
      this.currentEntryIndex--;
    }

    protected onEntryCancelAdding(): void {
      this.viewEntry(this.currentEntryIndex, 0);
    }

    protected onViewCategory(value: NavigationDrawSelection): void {
      this.currentAction = 'view-category';
      this.$nextTick(() => {
        this.currentCategoryIndex = value.categoryIndex;
        this.currentEntryIndex = value.entryIndex;
      });
    }

    protected onCategoryUpdated(value: HostsCategory): void {
      this.currentCategory.name = value.name;
      this.changed = true;
    }

    protected onAddCategory(): void {
      this.currentAction = 'add-category';
      this.$nextTick(() => {
        this.currentCategoryIndex = 0;
        this.currentEntryIndex = 0;
      });
    }

    protected onCategoryAdded(value: HostsCategory): void {
      if (value.entries.length === 0) {
        value.entries.push({
          name: 'Default',
          value: '127.0.0.1 localhost',
          active: false
        });
      }
      this.hosts.categories.push(value);

      this.viewEntry(this.hosts.categories.length - 1, 0);
    }

    protected onCategoryDeleted(): void {
      this.hosts.categories.splice(this.currentCategoryIndex, 1);
      this.currentEntryIndex--;
    }

    protected onCategoryCancelAdding(): void {
      this.viewEntry(0, 0);
    }

    // protected startAddingEntry(categoryIndex: number | null): void {
    //   this.mode = 'add-entry';
    //   this.$nextTick(() => {
    //     this.selectEntry(categoryIndex, null);
    //   });
    // }

    // protected addEntry(entry: HostsEntry): void {
    //   this.currentCategory.entries.push(entry);
    //   this.selectEntry(this.currentCategoryIndex, this.hosts.entries.length - 1);
    // }

    // protected updateCategory(category: HostsCategory): void {
    //   if (this.currentCategory === null) {
    //     // TODO handle the error
    //     throw new Error('currentCategory is not set.')
    //   }
    //   this.currentCategory.name = category.name;
    //   this.changed = true;
    // }

    // protected onCancelAdding(): void {
    //   this.mode = 'view-entry';
    //   this.$nextTick(() => {
    //     this.selectEntry(null, 0);
    //   });
    // }

    protected onViewHostsFile(): void {
      this.currentAction = 'view-file';
      this.$nextTick(() => {
        this.hostsContent = convertHostsToFile(this.hosts);
      });
    }

    protected onUpdateHostsFile(content: string): void {
      this.hosts = convertFileToHosts(content);
      this.changed = true;

      this.$nextTick(() => {
        this.hostsContent = convertHostsToFile(this.hosts);
      });
    }
  }
</script>

<style scoped lang="scss">
  .app-container {
    background-color: #ddd;
  }
</style>
