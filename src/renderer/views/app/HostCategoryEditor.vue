<template>
  <section
    class="w-100 h-100 d-flex flex-column">
    <div>
      <v-text-field
        label="Name"
        required
        v-model"internalName"
        :readonly="readonly"
      >
      </v-text-field>
    </div>
    <div></div>
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
      >Update</v-btn>
    </div>
  </section>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import {HostsCategory} from "@common/hosts";
  import {Prop} from "vue-property-decorator";

  // The @Component decorator indicates the class is a Vue component
  @Component({
    components: {
    }
  })
  export default class HostsCategoryEditor extends Vue {
    @Prop({ type: Object, required: false })
    public readonly category!: HostsCategory;

    @Prop({ type: Boolean })
    public readonly readonly!: boolean;

    private internalName: string;

    public constructor() {
      super();

      this.internalName = this.category.name;
    }

    private onUpdate(): void {
      this.$emit('updated', {
        ...this.category,
        name: this.internalName
      });
    }

    private onRevert(): void {
      this.internalName = this.category.name;
    }
  }
</script>

<style scoped lang="scss">

</style>
