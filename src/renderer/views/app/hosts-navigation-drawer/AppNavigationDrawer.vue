<template>
  <v-navigation-drawer
    permanent
  >
    <v-list dense>
      <draggable
        v-model="categories"
      >
        <app-navigation-drawer-category
          v-for="(category, categoryIndex) in hosts.categories"
          :key="category.id"
          :category="category"
          :show-new-category="categoryIndex === 0"
          @entries-updated="onEntriesUpdated(categoryIndex, $event)"
        />

        <v-divider />
      </draggable>

      <v-list-item
        link
        @click="onViewFile"
      >
        <v-list-item-content>
          <v-list-item-title class="font-weight-bold">
            Hosts File
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <template v-slot:append>
      <div class="pa-2 psy-2">
        <div>
          <v-btn
            block
            :disabled="isLoading"
            @click="onReload"
          >
            Reload
          </v-btn>
        </div>
        <div>
          <confirm-button
            :button-block="true"
            :disabled="isSaving"
            button-color="primary"
            button-text="Save"
            content="This will update your hosts file."
            @click="onSave"
          />
        </div>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import {Hosts, HostsCategory, HostsEntry} from "@common/hosts";
  import { ConfirmButton } from "@renderer/components/confirm";
  import draggable from 'vuedraggable';
  import AppNavigationDrawerCategory from "@renderer/views/app/hosts-navigation-drawer/AppNavigationDrawerCategory.vue";
  import {Action, Mutation, State} from "vuex-class";

  // The @Component decorator indicates the class is a Vue component
  @Component({
    components: {
      AppNavigationDrawerCategory,
      ConfirmButton,
      draggable
    }
  })
  export default class AppNavigationDrawer extends Vue {
    @State('hosts', { namespace: 'editor' })
    protected hosts!: Hosts;

    @Mutation('setHosts', { namespace: 'editor' })
    protected setHosts!: (value: Hosts) => void;

    @Action('loadHostsFile', { namespace: 'editor' })
    protected loadHostsFile!: () => Promise<void>;

    @Action('saveHostsFile', { namespace: 'editor' })
    protected saveHostsFile!: () => Promise<void>;

    @Mutation('add', { namespace: 'notifications' })
    protected addNotification!: (notification: Notification) => void;

    @Mutation('viewFile', { namespace: 'editor' })
    protected viewFile!: () => void;

    protected isLoading = false;

    protected isSaving = false;

    protected get categories(): HostsCategory[] {
      return this.hosts.categories;
    }

    protected set categories(value: HostsCategory[]) {
      try {
        this.setHosts({
          ...this.hosts,
          categories: value
        });
      } catch (e) {
        console.log(e);
        this.$toast.error('Failed to update.');
      }
    }

    protected onEntriesUpdated(categoryIndex: number, entries: HostsEntry[]): void {
      this.hosts.categories[categoryIndex].entries.length = 0;
      for (const entry of entries) {
        this.hosts.categories[categoryIndex].entries.push(entry)
      }

      this.setHosts(this.hosts);
    }

    protected async onReload(): Promise<void> {
      this.isLoading = true;
      try {
        await this.loadHostsFile();
        this.$toast.success('Reload succeeded.');
      } catch (e) {
        console.log(e);
        this.$toast.error('Reload failed.');
      } finally {
        this.isLoading = false;
      }
    }

    protected async onSave(): Promise<void> {
      this.isSaving = true;
      try {
        await this.saveHostsFile()
        this.$toast.success('Saved succeeded.');
      } catch (e) {
        console.log(e);
        this.$toast.error('Save failed.');
      } finally {
        this.isSaving = false;
      }
    }

    protected onViewFile(): void {
      try {
        this.viewFile();
      } catch (e) {
        console.log(e);
        this.$toast.error('View file failed.');
      }
    }
  }
</script>
