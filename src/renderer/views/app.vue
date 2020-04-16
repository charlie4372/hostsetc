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
        <v-navigation-drawer
          permanent
        >
          <v-list dense>
            <hosts-entry-drawer-item
              name="Main"
              :value="hosts.main"
              @click="onHostEntryClick(hosts.main)"
            >
            </hosts-entry-drawer-item>
            <div
              v-for="(category, index) in hosts.categories"
              :key="index"
              >
              <hosts-category-drawer-item
                :value="category"
                >
              </hosts-category-drawer-item>
              <hosts-entry-drawer-item
                v-for="(entry, index) in category.entries"
                :key="index"
                :value="entry"
                @click="onHostEntryClick(entry)"
              >
              </hosts-entry-drawer-item>
            </div>
          </v-list>

          <template v-slot:append>
            <div class="pa-2 psy-2">
              <div>
                <v-btn block>Reload</v-btn>
              </div>
              <div>
                <v-btn block>Save</v-btn>
              </div>
            </div>
          </template>
        </v-navigation-drawer>
        <v-container
          class="fill-height align-start justify-start flex-column"
          fluid
        >
          <host-entry-editor
            v-model="currentEntry"
            :show-name="showNameOnHostedEditor"
            >
          </host-entry-editor>
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
  import {Hosts, HostsEntry, HostsRecord} from '@common/hosts';
  import HostEntryEditor from "@renderer/components/editors/HostEntryEditor.vue";
  import HostsEntryDrawerItem from "@renderer/components/navigation-drawer/HostsEntryDrawerItem.vue";
  import HostsCategoryDrawerItem from "@renderer/components/navigation-drawer/HostsCategoryDrawerItem.vue";

  // The @Component decorator indicates the class is a Vue component
  @Component({
    components: {
      HostEntryEditor,
      HostsEntryDrawerItem,
      HostsCategoryDrawerItem
    }
  })
  export default class App extends Vue {
    private hosts: Hosts = {
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

    private currentEntry: HostsEntry = this.hosts.main;

    private showNameOnHostedEditor = false

    private onHostEntryClick(newEntry: HostsEntry): void {
      this.currentEntry = newEntry;
      // TODO work out when the Main item is selected
      this.showNameOnHostedEditor = true;
    }

    private onAddHostsRecord(newRecord: HostsRecord): void {
      this.currentEntry.records.push(newRecord)
    }
  }
</script>

<style scoped lang="scss">
</style>
