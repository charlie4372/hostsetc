<template>
  <div
    ref="editableDiv"
    class="text-editor-input"
    contenteditable="true"
    @blur="onChange"
  />
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import {Prop, Watch} from "vue-property-decorator";
  import { HtmlEncode } from "@common/html-encode";

  const htmlEncode = new HtmlEncode();

  // The @Component decorator indicates the class is a Vue component
  @Component({
    components: {
    }
  })
  export default class TextEditorInput extends Vue {
    readonly $refs!: {
      editableDiv: HTMLElement;
    }

    @Prop({type: String})
    public readonly value!: string | null | undefined;

    @Prop({type: String})
    public readonly label!: string | null | undefined;

    protected mounted(): void {
      this.$refs.editableDiv.innerHTML = htmlEncode.encodeTextFileToHtml(this.value || '');

      this.$refs.editableDiv.addEventListener('paste', function (event: ClipboardEvent) {
        event.preventDefault();

        if (!event.clipboardData) {
          return
        }

        const content = event.clipboardData.getData('text/plain');

        document.execCommand('inserttext', false, content);
      });
    }

    @Watch('value')
    protected onContentChange(newValue: string | null): void {
      this.$refs.editableDiv.innerHTML = htmlEncode.encodeTextFileToHtml(newValue || '');
    }

    protected onChange(): void {
      this.$emit('input', htmlEncode.decodeHtmlToTextFile(this.$refs.editableDiv.innerHTML));
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
