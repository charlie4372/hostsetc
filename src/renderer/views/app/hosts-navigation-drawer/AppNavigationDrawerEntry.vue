<template>
  <v-list-item
    link
    :input-value="entry.id === selectedId"
    @click="onClick"
  >
    <v-list-item-content>
      <v-list-item-title>
        {{ entry.name }}
      </v-list-item-title>
    </v-list-item-content>
    <v-list-item-action>
      <v-switch
        :input-value="entry.active"
        @change="onChangeEntryActive"
      />
    </v-list-item-action>
  </v-list-item>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import {HostsEntry} from "@common/hosts";
  import {Prop} from "vue-property-decorator";
  import {Mutation, State} from 'vuex-class';

  @Component({
    components: {
    }
  })
  export default class AppNavigationDrawerEntry extends Vue {
    @State('selectedId', { namespace: 'editor' })
    protected readonly selectedId!: string | null;

    @Prop({ type: Object, required: true })
    protected readonly entry!: HostsEntry;

    @Prop({ type: Boolean, default: true })
    protected readonly visible!: boolean;

    @Mutation('viewEntry', { namespace: 'editor' })
    protected viewEntry!: (id: string) => void;

    @Mutation('updateEntry', { namespace: 'editor' })
    protected updateEntry!: (value: HostsEntry) => void;

    protected onChangeEntryActive(newValue: boolean): void {
      if (newValue !== this.entry.active) {
        this.updateEntry({
          ...this.entry,
          active: newValue
        });
      }
    }

    protected onClick(): void {
      try {
        this.viewEntry(this.entry.id);
      } catch (e) {
        console.log(e);
        this.$toast.error('Select failed.')
      }
    }
  }
</script>
