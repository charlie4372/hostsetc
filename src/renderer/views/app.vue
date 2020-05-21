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
          @reload="onReload"
          @save="onSave"
        />
        <v-container
          class="fill-height align-start justify-start flex-column app__container"
          fluid
        >
          <host-entry-editor
            v-if="view === 'entry'"
            class="w-100 h-100 d-flex flex-column"
          />

          <host-category-editor
            v-else-if="view === 'category'"
            class="w-100 d-flex flex-column"
          />

          <host-file-editor
            v-else-if="view === 'file'"
            class="w-100 h-100 d-flex flex-column"
            :hosts-path="hostsFile.path"
            :value="hostsContent"
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
  } from '@common/hosts';
  import HostEntryEditor from "@renderer/views/app/HostEntryEditor.vue";
  import {HostsFile} from "@common/hosts-file/HostsFile";
  import HostCategoryEditor from "@renderer/views/app/HostCategoryEditor.vue";
  import AppNavigationDrawer from "@renderer/views/app/hosts-navigation-drawer/AppNavigationDrawer.vue";
  import HostFileEditor from "@renderer/views/app/HostFileEditor.vue";
  import ConfirmButton from "@renderer/components/confirm-button/ConfirmButton.vue";
  import {AppView} from "@renderer/store/modules/types";
  import {Mutation, State} from 'vuex-class';

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
    protected hostsFile: HostsFile = new HostsFile();
    protected hostsContent = '';

    protected notificationVisible = false;
    protected notificationText = '';
    protected notificationColor = 'success';

    @State('view', { namespace: 'app' })
    protected view!: AppView;

    @State('hosts', { namespace: 'app' })
    protected hosts!: Hosts;

    @Mutation('viewEntry', { namespace: 'app' })
    protected viewEntry!: (id: string) => void;

    @Mutation('setHosts', { namespace: 'app' })
    protected setHosts!: (value: Hosts) => void;

    public constructor() {
      super();

      this.hostsFile.load();
      this.setHosts(this.hostsFile.hosts)

      // The TS defaults kick in after the constructor.
      // But if they're not there, then they don't register with vue.
      this.$nextTick(() => {
        this.setHosts(this.hostsFile.hosts);
      });
    }

    protected onReload(): void {
      this.hostsFile.load();
      this.setHosts(this.hostsFile.hosts);

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
