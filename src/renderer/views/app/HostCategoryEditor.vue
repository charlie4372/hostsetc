<template>
  <v-card>
    <v-card-text class="h-100 d-flex flex-column">
      <div>
        <v-text-field
          label="Name"
          required
          :value="category ? category.name : ''"
          @input="onUpdateName"
        />
      </div>
      <div class="align-self-end mt-4">
        <confirm-button
          button-text="Delete"
          content="Are you sure you want to delete this category?"
          :button-disabled="!canDelete"
          @click="onDelete"
        />
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import {getCategoryFromHosts, Hosts, HostsCategory} from "@common/hosts";
  import {ConfirmButton} from "@renderer/components/confirm";
  import {Mutation, State} from "vuex-class";

  // The @Component decorator indicates the class is a Vue component
  @Component({
    components: {
      ConfirmButton
    }
  })
  export default class HostsCategoryEditor extends Vue {
    @State('hosts', { namespace: 'editor' })
    protected hosts!: Hosts;

    @State('selectedId', { namespace: 'editor' })
    protected readonly selectedId!: string | null;

    @Mutation('updateCategory', { namespace: 'editor' })
    protected updateCategory!: (value: HostsCategory) => void;

    @Mutation('deleteCategory', { namespace: 'editor' })
    protected deleteCategory!: (value: HostsCategory) => void;

    protected get category(): HostsCategory | null {
      if (this.selectedId === null) {
        return null;
      }

      return getCategoryFromHosts(this.hosts, this.selectedId);
    }

    protected get canDelete(): boolean {
      return this.hosts.categories.length > 1;
    }

    protected onUpdateName(newValue: string): void {
      if (this.category === null) {
        return;
      }

      try {
        this.updateCategory({
          ...this.category,
          name: newValue
        });
      } catch (e) {
        console.log(e);
        this.$toast.error('Update failed.');
      }
    }

    protected onDelete(): void {
      if (this.category === null) {
        return;
      }

      try {
        this.deleteCategory(this.category);
      } catch (e) {
        this.$toast.error('Update failed.');
      }
    }
  }
</script>
