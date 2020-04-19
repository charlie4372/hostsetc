<template>
  <section
    class="w-100 h-100 d-flex flex-column">
    <div>
      <v-text-field
        v-show="showName"
        label="Name"
        required
        :value="internalName"
        @input="internalName = $event"
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
        @click="onSave"
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
    @Prop({type: Object, required: true})
    public readonly value!: HostsEntry;

    @Prop({type: Boolean, default: true})
    public readonly showName!: boolean;

    @Prop({type: Boolean})
    public readonly readonly !: boolean

    private internalName: string | null = null;
    private internalTextHtml: string = '';

    readonly $refs!: {
      editableDiv: HTMLElement;
    }

    public created(): void {
      this.setInternalValues(this.value);
    }

    @Watch('value')
    private onValueChange(newValue: HostsEntry): void {
      this.setInternalValues(newValue);
    }

    private onRevert(): void {
      this.setInternalValues(this.value);
    }

    private setInternalValues(entry: HostsEntry): void {
      this.internalName = entry.name || null;
      this.internalTextHtml = htmlEncode.encodeTextFileToHtml(entry.value);
      // internalTextHtml is never updated after the initial creation.
      // Setting back to itself doesn't trigger reactive binding.
      // So update it manually.
      if (this.$refs.editableDiv) {
        this.$refs.editableDiv.innerHTML = this.internalTextHtml
      }
    }

    private onSave(): void {
      this.$emit('input', {
        ...this.value,
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
