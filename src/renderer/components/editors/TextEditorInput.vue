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
  .text-editor-input {
    outline: none;
  }
</style>
