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
            <v-list-item link>
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
                link>
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
          <div
            v-for="(hostsRecord, index) in currentEntry.records"
            :key="index"
            class="d-flex w-100"
          >
            <v-checkbox
              class="mt-0"
              v-model="hostsRecord.enabled"
              dense
              hide-details="true"
            >
            </v-checkbox>
            <v-text-field
              v-model="hostsRecord.value"
              dense
              hide-details="true"
              clearable
            ></v-text-field>
          </div>
          <div class="d-flex w-100">
            <v-checkbox
              class="mt-0"
              dense
              hide-details="true"
            >
            </v-checkbox>
            <v-text-field
              placeholder="New record"
              dense
              hide-details="true"
              clearable
            ></v-text-field>
          </div>
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
  import {Hosts, HostsEntry} from '@common/hosts';

  // The @Component decorator indicates the class is a Vue component
  @Component({
    components: {
    }
  })
  export default class App extends Vue {
    private hosts: Hosts = {
      main: {
        records: [
          { enabled: true, value: '127.0.0.1  localhost' }
        ]
      },
      categories: [
        {
          name: 'Staging',
          entries: [
            {
              name: 'VM1',
              records: [
                { enabled: true, value: '192.168.50.1  staging.hosts-editor.com.au' }
              ]
            },
            {
              name: 'VM2',
              records: [
                { enabled: true, value: '192.168.50.2  staging.hosts-editor.com.au' }
              ]
            }
          ]
        },
        {
          name: 'AWS',
          entries: [
            {
              name: 'Australia East',
              records: [
                { enabled: true, value: '192.168.50.1  staging.hosts-editor.com.au' }
              ]
            },
            {
              name: 'US West',
              records: [
                { enabled: true, value: '192.168.50.2  staging.hosts-editor.com.au' }
              ]
            }
          ]
        },
        {
          name: 'Azure',
          entries: [
            {
              name: 'Australia East',
              records: [
                { enabled: true, value: '192.168.50.1  staging.hosts-editor.com.au' }
              ]
            },
            {
              name: 'US West',
              records: [
                { enabled: true, value: '192.168.50.2  staging.hosts-editor.com.au' }
              ]
            }
          ]
        }
      ]
    }

    private currentEntry: HostsEntry = this.hosts.main;
  }
</script>

<style scoped lang="scss">
  .h-100 {
    height: 100%;
  }

  .w-100 {
    width: 100%;
  }
</style>
