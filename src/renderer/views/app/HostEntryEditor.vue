<template>
  <v-card>
    <v-card-title v-if="category && category.name">
      {{ category.name }}
    </v-card-title>
    <v-card-text class="host-entry-editor__content d-flex flex-column">
      <div>
        <v-text-field
          :value="entry ? entry.name : ''"
          label="Name"
          required
          :readonly="nameReadonly"
          @input="onUpdateName"
        />
      </div>
      <text-editor-input
        ref="textEditor"
        class="flex-grow-1 host-entry-editor__text"
        label="Content"
        :value="entry ? entry.value : ''"
        @input="onUpdateValue"
      />
      <div class="align-self-end mt-4">
        <confirm-button
          button-text="Delete"
          content="Are you sure you want to delete this entry?"
          :button-disabled="!canDelete"
        />
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import { Prop } from 'vue-property-decorator';
  import TextEditorInput from '@renderer/components/editors/TextEditorInput.vue';
  import ConfirmButton from "@renderer/components/confirm-button/ConfirmButton.vue";
  import {
    getCategoryWithEntryFromHosts,
    getEntryFromHosts,
    Hosts,
    HostsCategory,
    HostsEntry
  } from "@common/hosts";
  import {Mutation, State} from "vuex-class";

  // The @Component decorator indicates the class is a Vue component
  @Component({
    components: {
      TextEditorInput,
      ConfirmButton
    }
  })
  export default class HostEntryEditor extends Vue {
    @State('hosts', { namespace: 'app' })
    protected hosts!: Hosts;

    @State('selectedId', { namespace: 'app' })
    protected readonly selectedId!: string | null;

    @Prop({type: Boolean})
    public readonly nameReadonly!: boolean;

    @Prop({type: Boolean})
    public readonly canDelete!: boolean;

    @Mutation('updateEntry', { namespace: 'app' })
    protected updateEntry!: (value: HostsEntry) => void;

    protected get category(): HostsCategory | null {
      if (this.selectedId === null) {
        return null;
      }
      return getCategoryWithEntryFromHosts(this.hosts, this.selectedId);
    }

    protected get entry(): HostsEntry | null {
      if (this.selectedId === null) {
        return null;
      }

      return getEntryFromHosts(this.hosts, this.selectedId);
    }

    protected onUpdateName(value: string): void {
      if (this.entry === null) {
        return;
      }

      this.updateEntry({
        ...this.entry,
        name: value
      });
    }

    protected onUpdateValue(value: string): void {
      if (this.entry === null) {
        return;
      }

      this.updateEntry({
        ...this.entry,
        value: value
      });
    }
  }
</script>

<style scoped lang="scss">
  .host-entry-editor {
    &__content {
      height: calc(100% - 4rem);
    }
  }
</style>
