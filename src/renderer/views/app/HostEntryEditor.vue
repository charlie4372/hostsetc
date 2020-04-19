<template>
  <section
    class="w-100 h-100 d-flex flex-column">
    <div>
      <v-text-field
        v-show="showName"
        label="Name"
        required
        v-model="internalName"
        :readonly="readonly"
      >
      </v-text-field>
    </div>
    <div
      ref="editableDiv"
      class="flex-grow-1 host-entry-editor__text"
      :contenteditable="readonly ? 'false' : 'true'"
      v-html="internalTextHtml"
    >
    </div>
    <div>
      <v-btn
      >
        Delete
      </v-btn>
      <v-btn
        @click="onRevert"
      >
        Revert
      </v-btn>
      <v-btn
        @click="onUpdate"
      >Save</v-btn>
    </div>
  </section>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import {HostsEntry} from "@common/hosts";
  import { Prop, Watch } from 'vue-property-decorator';
  import { HtmlEncode} from "@common/html-encode";

  const htmlEncode = new HtmlEncode();

  // The @Component decorator indicates the class is a Vue component
  @Component({
    components: {
    }
  })
  export default class HostEntryEditor extends Vue {
    @Prop({type: Object})
    public readonly entry!: HostsEntry | null;

    @Prop({type: Boolean, default: true})
    public readonly showName!: boolean;

    @Prop({type: Boolean})
    public readonly readonly!: boolean

    @Prop({type: Boolean})
    public readonly adding!: Boolean;

    private internalName: string | null = null;
    private internalTextHtml: string = '';

    readonly $refs!: {
      editableDiv: HTMLElement;
    }

    public created(): void {
      this.setInternalValues(this.entry || null);
    }

    @Watch('entry')
    private onEntryChange(newValue: HostsEntry | null): void {
      this.setInternalValues(newValue);
    }

    @Watch('adding')
    private onAddingChange(newValue: boolean): void {
      if (newValue) {
        this.setInternalValues(null);
      }
    }

    private onRevert(): void {
      this.setInternalValues(this.entry);
    }

    private setInternalValues(entry: HostsEntry | null): void {
      if (entry === null) {
        this.internalName = '';
        this.internalTextHtml = '';
        return;
      }

      this.internalName = entry.name || null;
      this.internalTextHtml = htmlEncode.encodeTextFileToHtml(entry.value);
      // internalTextHtml is never updated after the initial creation.
      // Setting back to itself doesn't trigger reactive binding.
      // So update it manually.
      if (this.$refs.editableDiv) {
        this.$refs.editableDiv.innerHTML = this.internalTextHtml
      }
    }

    private onUpdate(): void {
      this.$emit('updated', {
        ...this.entry,
        name: this.internalName || undefined,
        value: htmlEncode.decodeHtmlToTextFile(this.$refs.editableDiv.innerHTML)
      })
    }
  }
</script>

<style scoped lang="scss">
  .host-entry-editor__text {
    font-family: "Roboto Mono";
  }
</style>
