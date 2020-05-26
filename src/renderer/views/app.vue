<template>
  <v-app id="inspire">
    <v-app-bar
      app
      color="indigo"
      dark
    >
      <v-app-bar-nav-icon />
      <v-toolbar-title>Host Etc - Beta</v-toolbar-title>
    </v-app-bar>

    <v-content
      class="app__content"
    >
      <div class="d-flex h-100">
        <app-navigation-drawer />
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
            :hosts-path="hostsFilePath"
            :value="hostsFileContent"
            @input="updateHostsFile"
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
      <span class="white--text">v0.0.6</span>
      <span class="white--text ml-4">&copy; 2020 Charlie Broad</span>
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
  import HostCategoryEditor from "@renderer/views/app/HostCategoryEditor.vue";
  import AppNavigationDrawer from "@renderer/views/app/hosts-navigation-drawer/AppNavigationDrawer.vue";
  import HostFileEditor from "@renderer/views/app/HostFileEditor.vue";
  import ConfirmButton from "@renderer/components/confirm-button/ConfirmButton.vue";
  import {AppView} from "@renderer/store/modules/types";
  import {Mutation, State, Action} from 'vuex-class';

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
    protected notificationVisible = false;
    protected notificationText = '';
    protected notificationColor = 'success';

    @State('view', { namespace: 'app' })
    protected view!: AppView;

    @State('hosts', { namespace: 'app' })
    protected hosts!: Hosts;

    @State('hostsFilePath', { namespace: 'app' })
    protected hostsFilePath!: string;

    @State('hostsFileContent', { namespace: 'app' })
    protected hostsFileContent!: string;

    @Mutation('viewEntry', { namespace: 'app' })
    protected viewEntry!: (id: string) => void;

    @Action('loadHostsFile', { namespace: 'app' })
    protected loadHostsFile!: () => Promise<void>;

    @Mutation('updateHostsFile', { namespace: 'app' })
    protected updateHostsFile!: (value: string) => void;

    public constructor() {
      super();
    }

    public async mounted(): Promise<void> {
      try {
        await this.loadHostsFile();
      } catch (e) {
        console.log(e);
        this.$toast.error('Failed to load the hosts file.', {queueable: true});
      }
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
