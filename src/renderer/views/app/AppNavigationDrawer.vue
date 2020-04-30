<template>
  <v-navigation-drawer
    permanent
  >
    <v-list dense>
      <hosts-entry-drawer-item
        name="Main"
        :entry="hosts.main"
        @click="onEntryClick(hosts.main)"
      />
      <hosts-entry-drawer-item
        v-for="(entry, entryIndex) in hosts.entries"
        :key="entryIndex"
        :entry="entry"
        @click="onEntryClick(entry)"
      />
      <v-list-item link>
        <v-list-item-action>
          <v-icon>mdi-contact-mail</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title
            class="text--secondary"
            @click="onAddEntry(null)"
          >
            New entry
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <div
        v-for="(category, categoryIndex) in hosts.categories"
        :key="categoryIndex"
      >
        <hosts-category-drawer-item
          :category="category"
          @click="onCategoryClick(category)"
        />
        <hosts-entry-drawer-item
          v-for="(entry, entryIndex) in category.entries"
          :key="entryIndex"
          :entry="entry"
          @click="onEntryClick(entry)"
        />
        <v-list-item
          link
        >
          <v-list-item-action>
            <v-icon>mdi-contact-mail</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title
              class="text--secondary"
              @click="onAddEntry(category)"
            >
              New entry
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </div>
      <v-list-item
        link
      >
        <v-list-item-content>
          <v-list-item-title
            class="text--secondary"
            @click="onAddCategory"
          >
            New category
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
          <v-btn block>
            Save
          </v-btn>
        </div>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import HostsEntryDrawerItem from '@renderer/components/navigation-drawer/HostsEntryDrawerItem.vue';
  import HostsCategoryDrawerItem from '@renderer/components/navigation-drawer/HostsCategoryDrawerItem.vue';
  import {Hosts, HostsCategory, HostsEntry} from "@common/hosts";
  import {Prop} from "vue-property-decorator";

  // The @Component decorator indicates the class is a Vue component
  @Component({
    components: {
      HostsEntryDrawerItem,
      HostsCategoryDrawerItem
    }
  })
  export default class  extends Vue {
    @Prop({ type: Object, required: true })
    public readonly hosts!: Hosts;

    protected onCategoryClick(category: HostsCategory): void {
      this.$emit('select-category', category);
    }

    protected onEntryClick(entry: HostsEntry): void {
      this.$emit('select-entry', entry);
    }

    protected onAddCategory(): void {
      this.$emit('add-category');
    }

    protected onAddEntry(category: HostsCategory | null): void {
      this.$emit('add-entry', category);
    }
  }
</script>

<style scoped lang="scss">

</style>
