<template>
  <div
    ref="editableDiv"
    :contenteditable="readonly ? 'false' : 'true'"
    :html="internalTextHtml"
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

    @Prop({type: Boolean})
    public readonly readonly!: boolean

    @Prop({type: String, required: true})
    public readonly content!: string | null;

    protected internalTextHtml = '';

    readonly $refs!: {
      editableDiv: HTMLElement;
    }

    protected created(): void {
       this.internalTextHtml = htmlEncode.encodeTextFileToHtml(this.content || '');
    }

    @Watch('input')
    protected onInputChange(newValue: string | null): void {
      this.internalTextHtml = htmlEncode.encodeTextFileToHtml(newValue || '');
    }

    public getContent(): string {
      return htmlEncode.decodeHtmlToTextFile(this.$refs.editableDiv.innerHTML)
    }

    public revert(): void {
      this.internalTextHtml = htmlEncode.encodeTextFileToHtml(this.content || '');
    }
  }
</script>

<style scoped lang="scss">

</style>
