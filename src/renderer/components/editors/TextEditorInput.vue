<template>
  <div
    ref="editableDiv"
    :contenteditable="readonly ? 'false' : 'true'"
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

    @Prop({type: String})
    public readonly content!: string | null;

    @Prop({type: String})
    public readonly label!: string | null;

    readonly $refs!: {
      editableDiv: HTMLElement;
    }

    protected mounted(): void {
      this.$refs.editableDiv.innerHTML = htmlEncode.encodeTextFileToHtml(this.content || '');
    }

    @Watch('content')
    protected onContentChange(newValue: string | null): void {
      this.$refs.editableDiv.innerHTML = htmlEncode.encodeTextFileToHtml(newValue || '');
    }

    public getContent(): string {
      return htmlEncode.decodeHtmlToTextFile(this.$refs.editableDiv.innerHTML)
    }

    public revert(): void {
      this.$refs.editableDiv.innerHTML = htmlEncode.encodeTextFileToHtml(this.content || '');
    }
  }
</script>

<style scoped lang="scss">

</style>
