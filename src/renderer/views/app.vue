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
            <v-list-item link
              @click="onHostEntryClick(hosts.main)"
            >
              <v-list-item-action>
                <v-icon>mdi-home</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Main</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <div
              v-for="(category, index) in hosts.categories"
              :key="index"
              >
              <v-subheader>{{category.name}}</v-subheader>
              <v-list-item
                v-for="(entry, index) in category.entries"
                :key="index"
                link
                @click="onHostEntryClick(entry)"
              >
                <v-list-item-action>
                  <v-icon>mdi-contact-mail</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>{{entry.name}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </div>
          </v-list>
        </v-navigation-drawer>
        <v-container
          class="fill-height align-start justify-start flex-column"
          fluid
        >
          <v-textarea
            class="w-100"
            :auto-grow="true"
            v-model="currentEntry.value"
            ></v-textarea>
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
  import HostsRecordInput from "@renderer/components/HostsRecordInput.vue";

  // The @Component decorator indicates the class is a Vue component
  @Component({
    components: {
      HostsRecordInput
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

    private onHostEntryClick(newEntry: HostsEntry): void {
      this.currentEntry = newEntry;
    }

    private onAddHostsRecord(newRecord: HostsRecord): void {
      this.currentEntry.records.push(newRecord)
    }
  }
</script>

<style scoped lang="scss">
</style>
