<template>
  <section>
    <text-editor-input
      ref="textEditor"
      class="flex-grow-1 host-entry-editor__text"
      label="Content"
      :readonly="readonly"
      :content="content"
    />
    <div class="align-self-end mt-4">
      <v-btn @click="onRevert">
        Revert
      </v-btn>
      <v-btn
        color="primary"
        @click="onUpdate"
      >
        Update
      </v-btn>
    </div>
  </section>
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
    public readonly content!: string;

    @Prop({type: Boolean})
    public readonly readonly!: boolean

    protected onRevert(): void {
      this.$refs.textEditor.revert();
    }

    protected onUpdate(): void {
      this.$emit('updated',
        this.$refs.textEditor.getContent()
      )
    }
  }
</script>

<style scoped lang="scss">
  .host-entry-editor__text {
    font-family: "Roboto Mono", monospace;
  }
</style>
