<template>
  <v-card>
    <v-card-title>
      Hosts File
    </v-card-title>
    <v-card-subtitle>
      {{ hostsPath }}
    </v-card-subtitle>
    <v-card-text class="d-flex flex-column host-file-editor__content">
      <text-editor-input
        ref="textEditor"
        class="flex-grow-1 host-entry-editor__text"
        label="Content"
        :value="value"
        @input="onUpdateEditor"
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import { Prop } from 'vue-property-decorator';
  import TextEditorInput from '@renderer/components/editors/TextEditorInput.vue';

  // The @Component decorator indicates the class is a Vue component
  @Component({
    components: {
      TextEditorInput
    }
  })
  export default class HostEntryEditor extends Vue {
    readonly $refs!: {
      textEditor: TextEditorInput;
    }

    @Prop({type: String})
    public readonly value!: string;

    @Prop({type: String})
    public readonly hostsPath!: string;

    protected onUpdateEditor(value: string): void {
      this.$emit('input',
        value
      )
    }
  }
</script>

<style scoped lang="scss">
  .host-file-editor {
    &__content {
      height: calc(100% - 5.5rem);
    }
  }
</style>
