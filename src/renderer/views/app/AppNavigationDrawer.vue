<template>
  <v-navigation-drawer
    permanent
  >
    <v-list dense>
      <v-list-item-group
        :value="selectedItem"
      >
        <draggable
          v-model="items"
          :move="onDragMove"
        >
          <template
            v-for="item in items"
          >
            <v-list-item
              v-if="item.action && item.visible"
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
              v-else-if="!item.action && item.visible"
              :key="item.index"
            />
          </template>
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
  import {
    DraggableMoveEvent,
    NavigationDrawAction,
    NavigationDrawDraggableCategory,
    NavigationDrawDraggableEntry,
    NavigationDrawDraggableItem,
    NavigationDrawSelection
  } from './types';
  import draggable from 'vuedraggable';
  import { isNavigationDrawDraggableEntry, isNavigationDrawDraggableCategory, isNavigationDrawDraggableAction } from './utils';
  import {convertHostsToNavigationDrawItems, convertNavigationDrawItemsToHosts} from './AppNavigationDrawerListConvert';

  // The @Component decorator indicates the class is a Vue component
  @Component({
    components: {
      ConfirmButton,
      draggable
    }
  })
  export default class AppNavigationDrawer extends Vue {
    @Prop({ type: Object, required: true })
    public readonly value!: Hosts;

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
      return convertHostsToNavigationDrawItems(this.value);
    }

    protected set items(newValue: NavigationDrawDraggableItem[]) {
      debugger
      this.$emit('input', convertNavigationDrawItemsToHosts(newValue));
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

    protected onPerformAction(item: NavigationDrawDraggableItem | NavigationDrawDraggableEntry | NavigationDrawDraggableCategory): void {
      if (isNavigationDrawDraggableEntry(item)) {
        this.$emit('view-entry', {
          categoryIndex: item.categoryIndex,
          entryIndex: item.entryIndex
        } as NavigationDrawSelection);
      } else if (isNavigationDrawDraggableCategory(item)) {
        this.$emit('view-category', {
          categoryIndex: item.categoryIndex,
          entryIndex: 0
        } as NavigationDrawSelection);
      } else if (isNavigationDrawDraggableAction(item)) {
        if (item.action === 'add-category') {
          this.$emit('add-category');
        } else if (item.action === 'add-entry') {
          this.$emit('add-entry', {
            categoryIndex: item.categoryIndex,
            entryIndex: 0
          } as NavigationDrawSelection);
        }
      }
    }

    protected onToggleEntryActive(item: NavigationDrawDraggableEntry): void {
      this.$emit('toggle-entry-active', {
        categoryIndex: item.categoryIndex,
        entryIndex: item.entryIndex
      } as NavigationDrawSelection);
    }

    protected onDragMove(event: DraggableMoveEvent<NavigationDrawDraggableItem>): boolean {
      const isTargetDroppable = isNavigationDrawDraggableAction(event.relatedContext.element) ||
        isNavigationDrawDraggableCategory(event.relatedContext.element) ||
        isNavigationDrawDraggableEntry(event.relatedContext.element);

      if (isNavigationDrawDraggableEntry(event.draggedContext.element)) {
        return isTargetDroppable;
      } else if (isNavigationDrawDraggableCategory(event.draggedContext.element)) {
        return isTargetDroppable;
      }

      return false;
    }
  }
</script>

<style scoped lang="scss">

</style>
