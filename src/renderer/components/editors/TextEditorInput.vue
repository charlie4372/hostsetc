<template>
  <codemirror
    ref="codeMirror"
    class="text-editor-input"
    :value="value"
    :options="codeMirrorOptions"
    @input="$emit('input', $event)"
  />
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import {Prop} from 'vue-property-decorator';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  import { codemirror } from 'vue-codemirror';

  // The @Component decorator indicates the class is a Vue component
  @Component({
    components: {
      codemirror
    }
  })
  export default class TextEditorInput extends Vue {
    @Prop({type: String})
    public readonly value!: string | null | undefined;

    @Prop({type: String})
    public readonly label!: string | null | undefined;

    protected codeMirrorOptions = {
      mode: 'hosts-file',
      lineNumbers: true,
      lineSeparator: '\n'
    }
  }
</script>

<style lang="scss">
  .text-editor-input {
    display: flex;
    flex-direction: column;

    .CodeMirror {
      flex: 1 1 auto;
    }
  }
</style>
