<template>
  <section
    class="d-flex w-100"
  >
    <v-checkbox
      :input-value="value.active"
      :hide-details="true"
      @input="onEnableUpdated"
    />
    <v-text-field
      :value="value.value"
      :placeholder="placeholder"
      :hide-details="true"
      clearable
      @input="onValueUpdated"
    />
  </section>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import { Prop } from 'vue-property-decorator';
  import {HostsEntry} from "@common/hosts";

  // The @Component decorator indicates the class is a Vue component
  @Component({
    components: {
    }
  })
  export default class HostsRecordInput extends Vue {
    @Prop({
      type: Object,
      default: () => ({ enabled: true, value: '' })
    })
    public readonly value!: HostsEntry

    @Prop({ type: String })
    protected readonly placeholder?: string;

    protected onEnableUpdated(newValue: boolean): void {
      this.$emit('input', {
        ...this.value,
        enabled: newValue
      })
    }

    protected onValueUpdated(newValue: boolean): void {
      this.$emit('input', {
        ...this.value,
        value: newValue
      })
    }
  }
</script>

<style scoped lang="scss">

</style>
