<template>
  <section
    class="w-100 h-100">
    <v-text-field
      v-if="showName"
      label="Name"
      required
      :value="value.name"
      @input="onNameUpdated"
    >

    </v-text-field>
    <v-textarea
      class="w-100"
      :auto-grow="true"
      :value="value.value"
      @input="onValueUpdated"
    ></v-textarea>
  </section>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import {HostsEntry} from "@common/hosts";
  import { Prop } from 'vue-property-decorator';

  // The @Component decorator indicates the class is a Vue component
  @Component({
    components: {
    }
  })
  export default class HostEntryEditor extends Vue {
    @Prop({ type: Object, required: true })
    public readonly value!: HostsEntry;

    @Prop({ type: Boolean, default: true })
    public readonly showName!: boolean;

    private onNameUpdated(newValue: string): void {
      this.$emit('input', {
        ...this.value,
        name: newValue
      })
    }

    private onValueUpdated(newValue: string): void {
      this.$emit('input', {
        ...this.value,
        value: newValue
      })
    }
  }
</script>

<style scoped lang="scss">

</style>
