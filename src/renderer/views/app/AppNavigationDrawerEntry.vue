<template>
  <v-list-item
    link
    :input-value="active"
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
        @change="onToggleEntryActive"
      />
    </v-list-item-action>
  </v-list-item>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import {HostsEntry} from "@common/hosts";
  import {Prop} from "vue-property-decorator";
  import {getKey} from "@renderer/views/app/utils";
  import {NavigationDrawEntryEvent} from './types';

  @Component({
    components: {
    }
  })
  export default class AppNavigationDrawerEntry extends Vue {
    protected readonly getKey = getKey

    @Prop({ type: Object, required: true })
    protected readonly entry!: HostsEntry;

    @Prop({ type: Boolean, default: true })
    protected readonly visible!: boolean;

    @Prop({ type: Boolean })
    protected readonly active!: boolean;

    @Prop({ type: Number, required: true })
    protected readonly categoryIndex!: number;

    @Prop({ type: Number, required: true })
    protected readonly entryIndex!: number;

    protected onClick(): void {
      this.$emit('entry-view', {
        categoryIndex: this.categoryIndex,
        entryIndex: this.entryIndex
      } as NavigationDrawEntryEvent)
    }

    protected onToggleEntryActive(): void {
      this.$emit('entry-toggle-active', {
        categoryIndex: this.categoryIndex,
        entryIndex: this.entryIndex
      } as NavigationDrawEntryEvent);
    }
  }
</script>

<style scoped lang="scss">

</style>
