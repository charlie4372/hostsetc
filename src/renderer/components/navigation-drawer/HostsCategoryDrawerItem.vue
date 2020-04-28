<template>
  <v-subheader>
    {{ category.name }}
  </v-subheader>
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
  export default class HostsEntryDrawerItem extends Vue {
    @Prop({ type: Object, required: true })
    public readonly category!: HostsCategory;
  }
</script>

<style scoped lang="scss">

</style>
