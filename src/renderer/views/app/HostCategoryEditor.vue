<template>
  <v-card>
    <v-card-text class="h-100 d-flex flex-column">
      <div>
        <v-text-field
          label="Name"
          required
          :value="value ? value.name : ''"
          @input="onUpdateName"
        />
      </div>
      <div class="align-self-end mt-4">
        <confirm-button
          button-text="Delete"
          content="Are you sure you want to delete this category?"
          :button-disabled="!canDelete"
          @click="onDelete"
        />
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import {HostsCategory} from "@common/hosts";
  import {Prop} from "vue-property-decorator";
  import ConfirmButton from "@renderer/components/confirm-button/ConfirmButton.vue";

  // The @Component decorator indicates the class is a Vue component
  @Component({
    components: {
      ConfirmButton
    }
  })
  export default class HostsCategoryEditor extends Vue {
    @Prop({ type: Object, default: null })
    public readonly value!: HostsCategory | null;

    @Prop({type: Boolean})
    public readonly canDelete!: boolean;

    protected onUpdateName(value: string): void {
      this.$emit('input', {
        ...this.value,
        name: value
      });
    }

    protected onDelete(): void {
      this.$emit('deleted');
    }
  }
</script>

<style scoped lang="scss">

</style>
