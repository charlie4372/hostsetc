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
          :show-header="categoryIndex !== 0"
        />

        <v-divider />
      </draggable>

      <v-list-item
        link
        @click="$emit('view-hosts-file')"
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
            @click="onReload"
          >
            Reload
          </v-btn>
        </div>
        <div>
          <confirm-button
            :button-block="true"
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
  import {Hosts, HostsCategory} from "@common/hosts";
  import ConfirmButton from "@renderer/components/confirm-button/ConfirmButton.vue";
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
    @State('hosts', { namespace: 'app' })
    protected hosts!: Hosts;

    @Mutation('setHosts', { namespace: 'app' })
    protected setHosts!: (value: Hosts) => void;

    @Action('loadHostsFile', { namespace: 'app' })
    protected loadHostsFile!: () => Promise<void>;

    @Action('saveHostsFile', { namespace: 'app' })
    protected saveHostsFile!: () => Promise<void>;

    @Mutation('add', { namespace: 'notifications' })
    protected addNotification!: (notification: Notification) => void;

    protected get categories(): HostsCategory[] {
      return this.hosts.categories;
    }

    protected set categories(value: HostsCategory[]) {
      this.setHosts({
        ...this.hosts,
        categories: value
      });
    }

    protected async onReload(): Promise<void> {
      try {
        await this.loadHostsFile();
        this.$toast.success('Loaded the hosts file.', { queueable: true });
      } catch (e) {
        console.log(e);
        this.$toast.error('Failed to load the hosts file.', { queueable: true });
      }
    }

    protected async onSave(): Promise<void> {
      try {
        await this.saveHostsFile()
        this.$toast.success('Saved the hosts file.', { queueable: true });
      } catch (e) {
        console.log(e);
        this.$toast.error('Failed to save the hosts file.', { queueable: true });
      }
    }
  }
</script>

<style scoped lang="scss">

</style>
