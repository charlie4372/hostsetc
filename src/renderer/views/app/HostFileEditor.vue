<template>
  <v-card>
    <v-card-title>
      Hosts File
    </v-card-title>
    <v-card-subtitle>
      {{ hostsPath }}
    </v-card-subtitle>
    <v-card-text class="d-flex flex-column h-100">
      <text-editor-input
        ref="textEditor"
        class="flex-grow-1 host-entry-editor__text"
        label="Content"
        :readonly="readonly"
        :content="content"
        @change="onChanged"
      />
      <div class="align-self-end mt-4">
        <v-btn
          :disabled="!changed"
          @click="onRevert"
        >
          Revert
        </v-btn>
        <v-btn
          color="primary"
          :disabled="!changed"
          @click="onUpdate"
        >
          Update
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import { Prop, Watch } from 'vue-property-decorator';
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
    public readonly content!: string;

    @Prop({type: String})
    public readonly hostsPath!: string;

    @Prop({type: Boolean})
    public readonly readonly!: boolean

    protected changed = false;

    @Watch('content')
    protected onContentChanged(newValue: string): void {
      if (newValue) {
        this.changed = false;
      }
    }

    protected onRevert(): void {
      this.$refs.textEditor.revert();
      this.changed = false;
    }

    protected onUpdate(): void {
      this.$emit('updated',
        this.$refs.textEditor.getContent()
      )
    }

    protected onChanged(): void {
      this.changed = true;
    }
  }
</script>

<style scoped lang="scss">
  .host-entry-editor__text {
    font-family: "Roboto Mono", monospace;
  }
</style>
