<template>
  <v-card>
    <v-card-title v-if="category && category.name">
      {{ category.name }}
    </v-card-title>
    <v-card-text class="h-100 d-flex flex-column">
      <div>
        <v-text-field
          v-model="internalName"
          label="Name"
          required
          :readonly="readonly || nameReadonly"
          @change="onChange"
        />
      </div>
      <text-editor-input
        ref="textEditor"
        class="flex-grow-1 host-entry-editor__text"
        label="Content"
        :readonly="readonly"
        :content="content"
        @change="onChange"
      />
      <div class="align-self-end mt-4">
        <confirm-button
          v-if="adding"
          button-text="Cancel"
          content="Are you sure you want to discard these changes?"
          @click="onCancelAdding"
        />
        <confirm-button
          v-else
          button-text="Delete"
          content="Are you sure you want to delete this entry?"
          :disabled="!changed"
        />
        <v-btn
          v-if="!adding"
          :disabled="!changed"
          @click="onRevert"
        >
          Revert
        </v-btn>
        <v-btn
          color="primary"
          :disabled="!changed"
          @click="onUpdate"
        >
          Update
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import {HostsCategory, HostsEntry} from "@common/hosts";
  import { Prop, Watch } from 'vue-property-decorator';
  import TextEditorInput from '@renderer/components/editors/TextEditorInput.vue';
  import ConfirmButton from "@renderer/components/confirm-button/ConfirmButton.vue";

  // The @Component decorator indicates the class is a Vue component
  @Component({
    components: {
      TextEditorInput,
      ConfirmButton
    }
  })
  export default class HostEntryEditor extends Vue {
    readonly $refs!: {
      textEditor: TextEditorInput;
    }

    @Prop({type: Object, default: null })
    public readonly entry!: HostsEntry | null;

    @Prop({type: Object, default: null })
    public readonly category!: HostsCategory | null;

    @Prop({type: Boolean})
    public readonly nameReadonly!: boolean;

    @Prop({type: Boolean})
    public readonly readonly!: boolean

    @Prop({type: Boolean})
    public readonly adding!: boolean;

    protected internalName = '';
    protected changed = false;

    protected get content(): string | null {
      if (this.entry === null) {
        return '# 127.0.0.1 localhost';
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
      this.changed = false;
    }

    protected onUpdate(): void {
      this.$emit('updated', {
        ...this.entry,
        name: this.internalName || undefined,
        value: this.$refs.textEditor.getContent()
      })
    }

    protected onCancelAdding(): void {
      this.$emit('cancel-adding');
    }

    protected onChange(): void {
      this.changed = true;
    }
  }
</script>

<style scoped lang="scss">
  .host-entry-editor__text {
    font-family: "Roboto Mono", monospace;
  }
</style>
