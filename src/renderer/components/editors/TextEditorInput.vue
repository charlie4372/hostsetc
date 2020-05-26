<template>
  <codemirror
    :value="value"
    :options="{ mode: 'javascript' }"
  />
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import {Prop} from 'vue-property-decorator';
  import { codemirror } from 'vue-codemirror';
  import 'codemirror/lib/codemirror.css';
  import CodeMirror from 'codemirror/lib/codemirror';

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

    public created(): void {
      console.log('CodeMirror.modes', CodeMirror.modes)
    }
  }
</script>

<style scoped lang="scss">
  @import "~vuetify/src/styles/settings/colors";

  .text-editor-input {
    outline: none;
    font-family: "Roboto Mono", monospace;
    overflow: auto;
    white-space: nowrap;
  }

  .text-editor-input::-webkit-scrollbar-track
  {
    // -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    border-radius: 10px;
    background-color: #fff;
  }

  .text-editor-input::-webkit-scrollbar
  {
    width: 12px;
    background-color: map_get($grey, 'lighten-4');
  }

  .text-editor-input::-webkit-scrollbar-thumb
  {
    border-radius: 10px;
    // -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    background-color: map_get($grey, 'lighten-2');
  }
</style>
