<template>
  <div>
    <v-list-item
      v-if="showHeader"
      link
      :input-value="category.id === selectedId"
      @click="onClick"
    >
      <v-list-item-content>
        <v-list-item-title class="font-weight-bold">
          {{ category.name }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <draggable
      v-model="category.entries"
      @input="$emit('input', category)"
    >
      <app-navigation-drawer-entry
        v-for="entry in category.entries"
        :key="entry.id"
        :entry="entry"
      />
    </draggable>

    <v-list-item
      link
    >
      <v-list-item-content>
        <v-list-item-title class="text--secondary">
          New Entry
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-list-item
      v-if="showNewCategory"
      link
    >
      <v-list-item-content>
        <v-list-item-title class="text--secondary">
          New Category
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-divider />
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import {Prop} from "vue-property-decorator";
  import {HostsCategory} from "@common/hosts";
  import AppNavigationDrawerEntry from "@renderer/views/app/hosts-navigation-drawer/AppNavigationDrawerEntry.vue";
  import Draggable from "vuedraggable";
  import {Mutation, State} from "vuex-class";

  // The @Component decorator indicates the class is a Vue component
  @Component({
    components: {
      AppNavigationDrawerEntry,
      Draggable
    }
  })
  export default class AppNavigationDrawerCategory extends Vue {
    @State('hosts-navigation-drawer/selectedId')
    protected readonly selectedId!: string | null;

    @Prop({ type: Object, required: true })
    protected readonly category!: HostsCategory;

    @Prop({ type: Boolean })
    protected readonly active!: boolean;

    @Prop({ type: Boolean })
    protected readonly showNewCategory!: boolean;

    @Prop({ type: Boolean, default: true })
    protected readonly showHeader!: boolean;

    @Mutation('app/viewCategory')
    protected viewCategory!: (id: string) => void;

    protected onClick(): void {
      this.viewCategory(this.category.id);
    }
  }
</script>

<style scoped lang="scss">

</style>
