<template>
  <v-card>
    <v-card-title v-if="category && category.name">
      {{ category.name }}
    </v-card-title>
    <v-card-text class="host-entry-editor__content d-flex flex-column">
      <div>
        <v-text-field
          :value="value ? value.name : ''"
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
        :value="value ? value.value : ''"
        @input="onUpdateEditor"
      />
      <div class="align-self-end mt-4">
        <confirm-button
          button-text="Delete"
          content="Are you sure you want to delete this entry?"
          :button-disabled="!canDelete"
          @click="onDelete"
        />
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import {HostsCategory, HostsEntry} from "@common/hosts";
  import { Prop } from 'vue-property-decorator';
  import TextEditorInput from '@renderer/components/editors/TextEditorInput.vue';
  import ConfirmButton from "@renderer/components/confirm-button/ConfirmButton.vue";

  // The @Component decorator indicates the class is a Vue component
  @Component({
    components: {
      TextEditorInput,
      ConfirmButton
    }
  })
  export default class HostEntryEditor extends Vue {
    @Prop({type: Object, default: null })
    public readonly value!: HostsEntry | null;

    @Prop({type: Object, default: null })
    public readonly category!: HostsCategory | null;

    @Prop({type: Boolean})
    public readonly nameReadonly!: boolean;

    @Prop({type: Boolean})
    public readonly canDelete!: boolean;

    protected onUpdateName(value: string): void {
      this.$emit('input', {
        ...this.value,
        name: value
      })
    }

    protected onUpdateEditor(value: string): void {
      this.$emit('input', {
        ...this.value,
        value: value
      })
    }

    protected onDelete(): void {
      this.$emit('deleted');
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
