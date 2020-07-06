<template>
  <v-app id="inspire">
    <v-app-bar
      app
      color="blue"
      dark
    >
      <v-toolbar-title>Host Etc</v-toolbar-title>
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

          <confirm-dialog
            :visible="showQuitDialog"
            content="Are you sure you want to exit the application?"
            @click="onConfirmQuit"
          />

          <v-dialog
            v-model="quitWhenReady"
            persistent
            max-width="500"
          >
            <v-card>
              <v-card-title class="headline">
                Quitting
              </v-card-title>
              <v-card-text>
                <slot>
                  The application will quit when the current operation completes.
                </slot>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn @click="quitWhenReady = false">
                  Cancel
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-container>
      </div>
    </v-content>
    <v-footer
      color="blue"
      app
    >
      <span class="white--text">v{{version}}</span>
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
  import {ConfirmButton, ConfirmDialog} from "@renderer/components/confirm";
  import {EditorView} from "@renderer/store/modules/editor/types";
  import {Mutation, State, Action, Getter} from 'vuex-class';
  import { ipcRenderer } from 'electron';
  import {Messages} from "@common/messages";
  import { Watch } from 'vue-property-decorator';

  // The @Component decorator indicates the class is a Vue component
  @Component({
    components: {
      ConfirmButton,
      ConfirmDialog,
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
    protected version = process.env.PACKAGE_VERSION;
    protected showQuitDialog = false;
    protected quitWhenReady = false;

    @State('view', { namespace: 'editor' })
    protected view!: EditorView;

    @State('hosts', { namespace: 'editor' })
    protected hosts!: Hosts;

    @State('hostsFilePath', { namespace: 'editor' })
    protected hostsFilePath!: string;

    @State('hostsFileContent', { namespace: 'editor' })
    protected hostsFileContent!: string;

    @Mutation('viewEntry', { namespace: 'editor' })
    protected viewEntry!: (id: string) => void;

    @Action('loadHostsFile', { namespace: 'editor' })
    protected loadHostsFile!: () => Promise<void>;

    @Mutation('updateHostsFile', { namespace: 'editor' })
    protected updateHostsFile!: (value: string) => void;

    @Getter('canApplicationExit')
    protected canApplicationExit!: boolean;

    public constructor() {
      super();
    }

    public created(): void {
      ipcRenderer.on(Messages.promptQuit, (): void => {
        this.promptQuit();
      });
    }

    public async mounted(): Promise<void> {
      try {
        await this.loadHostsFile();
      } catch (e) {
        console.log(e);
        this.$toast.error('Failed to load the hosts file.', {queueable: true});
      }
    }

    protected promptQuit(): void {
      this.showQuitDialog = true;
    }

    protected onConfirmQuit(value: boolean): void {
      if (value) {
        // If the user wants to quit, and the store is in a place where it can quit, then send the quit message.
        if (this.canApplicationExit) {
          ipcRenderer.send(Messages.quit);
        } else {
          // Otherwise queue the quit for when canApplicationExit becomes true.
          this.quitWhenReady = true;
        }
      }

      this.showQuitDialog = false;
    }

    @Watch('canApplicationExit')
    protected onCanApplicationExitChanged(newValue: boolean): void {
      // If canApplicationExit becomes true, and there is a queued quit, then quit.
      if (this.quitWhenReady && newValue) {
        ipcRenderer.send(Messages.quit);
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
