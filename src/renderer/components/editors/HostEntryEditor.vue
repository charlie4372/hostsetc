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
      >
      </v-text-field>
    </div>
    <div
      ref="editableDiv"
      class="flex-grow-1"
      contenteditable="true"
      v-html="convertToHtml(internalText)"
    >
    </div>
    <div>
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

    private internalName: string | null = null;
    private internalText: string = '';

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
      this.internalText = entry.value;
    }

    private onSave(): void {
      this.$emit('input', {
        ...this.value,
        name: this.internalName || undefined,
        value: this.$refs.editableDiv.innerText
      })
    }

    private convertToHtml(text: string): string {
      const textWithStandardLineBreaks = text
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n');

      const element = window
        .document
        .createElement('div')
        .appendChild(document.createTextNode(textWithStandardLineBreaks));

      const lines = (element.parentNode as any)
        .innerHTML
        .split('\n');

      return lines
        .map((line: string): string => {
          return `<div>${line}</div>\n`
        })
        .reduce((accumulator: string, currentValue: string): string => {
          return accumulator + currentValue
        });
    }
  }
</script>

<style scoped lang="scss">

</style>
