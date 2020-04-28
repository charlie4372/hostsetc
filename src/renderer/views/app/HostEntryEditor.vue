<template>
  <section class="w-100 h-100 d-flex flex-column">
    <div>
      <v-text-field
        v-model="internalName"
        label="Name"
        required
        :readonly="readonly || nameReadonly"
      />
    </div>
    <text-editor-input
      ref="textEditor"
      class="flex-grow-1 host-entry-editor__text"
      :readonly="readonly"
      :content="content"
    />
    <div>
      <v-btn>
        Delete
      </v-btn>
      <v-btn @click="onRevert">
        Revert
      </v-btn>
      <v-btn @click="onUpdate">
        Save
      </v-btn>
    </div>
  </section>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import {HostsEntry} from "@common/hosts";
  import { Prop, Watch } from 'vue-property-decorator';
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

    @Prop({type: Object})
    public readonly entry!: HostsEntry | null;

    @Prop({type: Boolean})
    public readonly nameReadonly!: boolean;

    @Prop({type: Boolean})
    public readonly readonly!: boolean

    @Prop({type: Boolean})
    public readonly adding!: boolean;

    protected internalName = '';

    protected get content(): string | null {
      if (this.entry === null) {
        return null;
      }
      return this.entry.value;
    }

    public created(): void {
      this.setInternalValues(this.entry || null);
    }

    @Watch('entry')
    protected onEntryChange(newValue: HostsEntry | null): void {
      this.setInternalValues(newValue);
    }

    @Watch('adding')
    protected onAddingChange(newValue: boolean): void {
      if (newValue) {
        this.setInternalValues(null);
      }
    }

    protected onRevert(): void {
      this.setInternalValues(this.entry);
      this.$refs.textEditor.revert();
    }

    protected setInternalValues(entry: HostsEntry | null): void {
      if (entry === null) {
        this.internalName = '';
        return;
      }

      this.internalName = entry.name;
    }

    protected onUpdate(): void {
      this.$emit('updated', {
        ...this.entry,
        name: this.internalName || undefined,
        value: this.$refs.textEditor.getContent()
      })
    }
  }
</script>

<style scoped lang="scss">
  .host-entry-editor__text {
    font-family: "Roboto Mono", monospace;
  }
</style>
