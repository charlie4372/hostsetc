<template>
  <section
    class="d-flex w-100"
  >
    <v-checkbox
      :input-value="value.enabled"
      @input="onEnableUpdated"
      hide-details="true"
    >
    </v-checkbox>
    <v-text-field
      :value="value.value"
      @input="onValueUpdated"
      :placeholder="placeholder"
      hide-details="true"
      clearable
    ></v-text-field>
  </section>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import { Prop } from 'vue-property-decorator';

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
    public readonly value!: HostsRecordInput

    @Prop({ type: String })
    private readonly placeholder?: string;

    private onEnableUpdated(newValue: boolean): void {
      this.$emit('input', {
        ...this.value,
        enabled: newValue
      })
    }

    private onValueUpdated(newValue: boolean): void {
      this.$emit('input', {
        ...this.value,
        value: newValue
      })
    }
  }
</script>

<style scoped lang="scss">

</style>
