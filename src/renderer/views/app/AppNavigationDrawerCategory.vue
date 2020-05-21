<template>
  <div>
    <v-list-item
      v-if="showHeader"
      link
      :input-value="active"
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
        v-for="(entry, entryIndex) in category.entries"
        :key="getKey(categoryIndex, entryIndex, 'entry-view')"
        :active="selectedItem === getKey(categoryIndex, entryIndex, 'entry-view')"
        :category-index="categoryIndex"
        :entry-index="entryIndex"
        :entry="entry"
        @entry-view="$emit('entry-view', $event)"
        @entry-toggle-active="$emit('entry-toggle-active', $event)"
      />
    </draggable>

    <v-list-item
      link
      @click="onNewEntry"
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
      @click="onNewCategory"
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
  import { getKey } from './utils';
  import { NavigationDrawCategoryEvent } from './types';
  import AppNavigationDrawerEntry from "@renderer/views/app/AppNavigationDrawerEntry.vue";
  import Draggable from "vuedraggable";

  // The @Component decorator indicates the class is a Vue component
  @Component({
    components: {
      AppNavigationDrawerEntry,
      Draggable
    }
  })
  export default class AppNavigationDrawerCategory extends Vue {
    protected readonly getKey = getKey

    @Prop({ type: Object, required: true })
    protected readonly category!: HostsCategory;

    @Prop({ type: Boolean })
    protected readonly active!: boolean;

    @Prop({ type: Boolean })
    protected readonly showNewCategory!: boolean;

    @Prop({ type: Boolean, default: true })
    protected readonly showHeader!: boolean;

    @Prop({ type: Number, required: true })
    protected readonly categoryIndex!: number;

    @Prop({ type: String })
    protected readonly selectedItem!: string | null;

    protected onClick(): void {
      this.$emit('category-view', {
        categoryIndex: this.categoryIndex,
      } as NavigationDrawCategoryEvent)
    }

    protected onMoveEntry(): void {
      return
    }

    protected onNewEntry(): void {
      this.$emit('entry-new', {
        categoryIndex: this.categoryIndex,
      } as NavigationDrawCategoryEvent)
    }

    protected onNewCategory(): void {
      this.$emit('category-new', {
        categoryIndex: this.categoryIndex,
      } as NavigationDrawCategoryEvent)
    }
  }
</script>

<style scoped lang="scss">

</style>
