<template>
  <v-list-item
    link
    @click="$emit('click', value)"
  >
    <v-list-item-action>
      <v-icon>mdi-contact-mail</v-icon>
    </v-list-item-action>
    <v-list-item-content>
      <v-list-item-title v-if="name" >{{name}}</v-list-item-title>
      <v-list-item-title v-else >{{value.name}}</v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import {HostsEntry} from "@common/hosts";
  import {Prop} from "vue-property-decorator";

  // The @Component decorator indicates the class is a Vue component
  @Component({
    components: {
    }
  })
  export default class HostsEntryDrawerItem extends Vue {
    @Prop({ type: Object, required: true })
    public readonly value!: HostsEntry;

    @Prop({ type: String })
    public readonly name?: string;
  }
</script>

<style scoped lang="scss">

</style>
