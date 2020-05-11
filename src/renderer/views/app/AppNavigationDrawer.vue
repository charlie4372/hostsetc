<template>
  <v-navigation-drawer
    permanent
  >
    <v-list dense>
      <v-list-item-group
        :value="selectedItem"
      >
        <template
          v-for="item in items"
        >
          <v-list-item
            v-if="item.action"
            :key="getKey(item.categoryIndex, item.entryIndex, item.action)"
            link
            :value="getKey(item.categoryIndex, item.entryIndex, item.action)"
            @click="onPerformAction(item)"
          >
            <v-list-item-content>
              <v-list-item-title :class="item.titleCss">
                {{ item.label }}
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action
              v-if="item.entry"
            >
              <v-switch
                :input-value="item.entry.active"
                @change="onToggleEntryActive(item)"
              />
            </v-list-item-action>
          </v-list-item>

          <v-divider
            v-else
            :key="item.index"
          />
        </template>

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
      </v-list-item-group>
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
  import {NavigationDrawAction, NavigationDrawDraggableItem, NavigationDrawSelection} from './types';

  // The @Component decorator indicates the class is a Vue component
  @Component({
    components: {
      ConfirmButton
    }
  })
  export default class AppNavigationDrawer extends Vue {
    @Prop({ type: Object, required: true })
    public readonly hosts!: Hosts;

    @Prop({ type: Number })
    public readonly currentCategoryIndex!: number;

    @Prop({ type: Number })
    public readonly currentEntryIndex!: number;

    @Prop({ type: String })
    public readonly currentAction!: string;

    @Prop({ type: Boolean })
    public readonly changed!: boolean;

    protected selectedItem = '';

    protected get items(): NavigationDrawDraggableItem[] {
      const items: NavigationDrawDraggableItem[] = [];

      for (let categoryIndex = 0; categoryIndex < this.hosts.categories.length; categoryIndex++) {
        const category = this.hosts.categories[categoryIndex];
        if (categoryIndex !== 0) {
          items.push({
            index: items.length,
            categoryIndex: categoryIndex,
            category: category,
            action: 'view-category',
            label: category.name,
            titleCss: 'font-weight-bold'
          });
        }

        for (let entryIndex = 0; entryIndex < category.entries.length; entryIndex++) {
          const entry = category.entries[entryIndex];

          items.push({
            index: items.length,
            categoryIndex: categoryIndex,
            entryIndex: entryIndex,
            entry: entry,
            action: 'view-entry',
            label: entry.name
          })
        }

        items.push({
          index: items.length,
          categoryIndex: categoryIndex,
          action: 'add-entry',
          label: 'New entry',
          titleCss: 'text--secondary'
        });

        if (categoryIndex === 0) {
          items.push({
            index: items.length,
            action: 'add-category',
            label: 'New category',
            titleCss: 'text--secondary'
          })
        }

        items.push({
          index: items.length,
          label: 'Separator'
        })
      }

      return items;
    }

    public created(): void {
      this.selectedItem = this.getKey(this.currentCategoryIndex, this.currentEntryIndex, this.currentAction);
    }

    @Watch('currentCategoryIndex')
    protected onCurrentCategoryIndexChanged(newValue: number | null): void {
      this.selectedItem = this.getKey(newValue, this.currentEntryIndex, this.currentAction);
    }

    @Watch('currentEntryIndex')
    protected onCurrentEntryIndexChanged(newValue: number | null): void {
      this.selectedItem = this.getKey(this.currentCategoryIndex, newValue, this.currentAction);
    }

    @Watch('currentAction')
    protected onCurrentActionChanged(newValue: NavigationDrawAction): void {
      this.selectedItem = this.getKey(this.currentCategoryIndex, this.currentEntryIndex, newValue);
    }

    protected getKey(categoryIndex: number | null, entryIndex: number | null, action: NavigationDrawAction | string): string {
      return `category-${categoryIndex || 0}_entry-${entryIndex || 0}_action-${action}`;
    }

    protected onPerformAction(item: NavigationDrawDraggableItem): void {
      if (item.action === undefined) {
        return;
      }

      if (item.action === 'view-entry') {
        if (item.categoryIndex === undefined || item.entryIndex === undefined) {
          throw new Error('Entry cannot be viewed.')
        }

        this.$emit('view-entry', {
          categoryIndex: item.categoryIndex,
          entryIndex: item.entryIndex
        } as NavigationDrawSelection);
      } else if (item.action === 'view-category') {
        if (item.categoryIndex === undefined) {
          throw new Error('Category cannot be viewed.')
        }

        this.$emit('view-category', {
          categoryIndex: item.categoryIndex,
          entryIndex: 0
        } as NavigationDrawSelection);
      } else if (item.action === 'add-category') {
        this.$emit('add-category');
      } else if (item.action === 'add-entry') {
        if (item.categoryIndex === undefined) {
          throw new Error('Category cannot be viewed.')
        }

        this.$emit('add-entry', {
          categoryIndex: item.categoryIndex,
          entryIndex: 0
        } as NavigationDrawSelection);
      }
    }

    protected onToggleEntryActive(item: NavigationDrawDraggableItem): void {
      if (item.categoryIndex === undefined || item.entryIndex === undefined) {
        throw new Error('Item cannot be activated.')
      }

      this.$emit('toggle-entry-active', {
        categoryIndex: item.categoryIndex,
        entryIndex: item.entryIndex
      } as NavigationDrawSelection);
    }
  }
</script>

<style scoped lang="scss">

</style>
