<template>
  <v-navigation-drawer
    permanent
  >
    <v-list dense>
      <draggable
        v-model="value.categories"
      >
        <app-navigation-drawer-category
          v-for="(category, categoryIndex) in value.categories"
          :key="getKey(categoryIndex, null, 'category-view')"
          :active="selectedItem === getKey(categoryIndex, null, 'category-view')"
          :category-index="categoryIndex"
          :category="category"
          :show-new-category="categoryIndex === 0"
          :show-header="categoryIndex !== 0"
          :selected-item="selectedItem"
          @entry-view="$emit('entry-view', $event)"
          @entry-new="$emit('entry-new', $event)"
          @entry-toggle-active="$emit('entry-toggle-active', $event)"

          @category-view="$emit('category-view', $event)"
          @category-new="$emit('category-new', $event)"
        />

        <v-divider />
      </draggable>

      <v-list-item
        link
        @click="$emit('view-hosts-file')"
      >
        <v-list-item-content>
          <v-list-item-title class="font-weight-bold">
            Hosts File
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <template v-slot:append>
      <div class="pa-2 psy-2">
        <div>
          <v-btn
            block
            @click="$emit('reload')"
          >
            Reload
          </v-btn>
        </div>
        <div>
          <confirm-button
            :button-block="true"
            :button-disabled="!changed"
            button-color="primary"
            button-text="Save"
            content="This will update your hosts file."
            @click="$emit('save')"
          />
        </div>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import {Hosts} from "@common/hosts";
  import {Prop, Watch} from "vue-property-decorator";
  import ConfirmButton from "@renderer/components/confirm-button/ConfirmButton.vue";
  import {
    NavigationDrawAction,
  } from './types';
  import draggable from 'vuedraggable';
  import {
    getKey
  } from './utils';
  import AppNavigationDrawerCategory from "@renderer/views/app/AppNavigationDrawerCategory.vue";

  // The @Component decorator indicates the class is a Vue component
  @Component({
    components: {
      AppNavigationDrawerCategory,
      ConfirmButton,
      draggable
    }
  })
  export default class AppNavigationDrawer extends Vue {
    protected readonly getKey = getKey;

    @Prop({ type: Object, required: true })
    public readonly value!: Hosts;

    @Prop({ type: Number })
    public readonly currentCategoryIndex!: number;

    @Prop({ type: Number })
    public readonly currentEntryIndex!: number;

    @Prop({ type: String })
    public readonly currentAction!: NavigationDrawAction;

    @Prop({ type: Boolean })
    public readonly changed!: boolean;

    protected selectedItem = '';

    public created(): void {
      this.selectedItem = getKey(this.currentCategoryIndex, this.currentEntryIndex, this.currentAction);
    }

    @Watch('currentCategoryIndex')
    protected onCurrentCategoryIndexChanged(newValue: number | null): void {
      this.selectedItem = getKey(newValue, this.currentEntryIndex, this.currentAction);
    }

    @Watch('currentEntryIndex')
    protected onCurrentEntryIndexChanged(newValue: number | null): void {
      this.selectedItem = getKey(this.currentCategoryIndex, newValue, this.currentAction);
    }

    @Watch('currentAction')
    protected onCurrentActionChanged(newValue: NavigationDrawAction): void {
      this.selectedItem = getKey(this.currentCategoryIndex, this.currentEntryIndex, newValue);
    }
  }
</script>

<style scoped lang="scss">

</style>
