<template>
  <v-navigation-drawer
    permanent
  >
    <v-list dense>
      <v-list-item-group
        :value="selectedItem"
      >
        <div
          v-for="(category, categoryIndex) in hosts.categories"
          :key="getKey(categoryIndex, 0, 'group')"
        >
          <v-list-item
            v-if="categoryIndex !== 0"
            :key="getKey(categoryIndex, 0, 'view-category')"
            :value="getKey(categoryIndex, 0, 'view-category')"
            link
            @click="onViewCategory(categoryIndex)"
          >
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold">
                {{ category.name }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            v-for="(entry, entryIndex) in category.entries"
            :key="getKey(categoryIndex, entryIndex, 'view-entry')"
            :value="getKey(categoryIndex, entryIndex, 'view-entry')"
            link
            @click="onViewEntry(categoryIndex, entryIndex)"
          >
            <v-list-item-content>
              <v-list-item-title>{{ entry.name }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-switch
                :input-value="entry.active"
                @change="onToggleEntryActive(categoryIndex, entryIndex)"
              />
            </v-list-item-action>
          </v-list-item>

          <v-list-item
            :key="getKey(categoryIndex, 0, 'add-entry')"
            :value="getKey(categoryIndex, 0, 'add-entry')"
            link
            @click="onAddEntry(categoryIndex)"
          >
            <v-list-item-content>
              <v-list-item-title class="text--secondary">
                New entry
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            v-if="categoryIndex === 0"
            :key="getKey(0, 0, 'add-category')"
            :value="getKey(0, 0, 'add-category')"
            link
            @click="onAddCategory"
          >
            <v-list-item-content>
              <v-list-item-title class="text--secondary">
                New category
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-divider />
        </div>

        <v-divider />

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
  import {NavigationDrawAction, NavigationDrawSelection} from './types';

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
      return `category${categoryIndex}_entry-${entryIndex}_action-${action}`;
    }

    protected onViewEntry(categoryIndex: number, entryIndex: number): void {
      this.$emit('view-entry', {
        categoryIndex,
        entryIndex
      } as NavigationDrawSelection);
    }

    protected onViewCategory(categoryIndex: number): void {
      this.$emit('view-category', {
        categoryIndex,
        entryIndex: 0
      } as NavigationDrawSelection);
    }

    protected onAddEntry(categoryIndex: number): void {
      this.$emit('add-entry', {
        categoryIndex,
        entryIndex: 0
      } as NavigationDrawSelection);
    }

    protected onAddCategory(): void {
      this.$emit('add-category');
    }

    protected onToggleEntryActive(categoryIndex: number, entryIndex: number): void {
      this.$emit('toggle-entry-active', {
        categoryIndex,
        entryIndex
      } as NavigationDrawSelection);
    }
  }
</script>

<style scoped lang="scss">

</style>
