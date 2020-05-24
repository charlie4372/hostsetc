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
      @click="onAddEntry"
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
      @click="onAddCategory"
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
  import {Hosts, HostsCategory} from "@common/hosts";
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
    @State('selectedId', { namespace: 'app' })
    protected readonly selectedId!: string | null;

    @State('hosts', { namespace: 'app' })
    protected readonly hosts!: Hosts;

    @Prop({ type: Boolean })
    protected readonly showNewCategory!: boolean;

    @Prop({ type: Boolean, default: true })
    protected readonly showHeader!: boolean;

    @Prop({ type: Object, default: true })
    protected readonly category!: HostsCategory;

    @Mutation('viewCategory', { namespace: 'app' })
    protected viewCategory!: (id: string) => void;

    @Mutation('addEntry', { namespace: 'app' })
    protected addEntry!: (category: HostsCategory) => void;

    @Mutation('addCategory', { namespace: 'app' })
    protected addCategory!: () => void;

    protected onClick(): void {
      try {
        this.viewCategory(this.category.id);
      } catch (e) {
        console.log(e);
        this.$toast.error('Select failed.')
      }
    }

    protected onAddEntry(): void {
      try {
        this.addEntry(this.category);
      } catch (e) {
        console.log(e);
        this.$toast.error('Add failed.');
      }
    }

    protected onAddCategory(): void {
      try {
        this.addCategory();
      } catch (e) {
        console.log(e);
        this.$toast.error('Add failed.');
      }
    }
  }
</script>

<style scoped lang="scss">

</style>
