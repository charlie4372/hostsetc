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
  import {getCategoryFromHosts, getEntryFromHosts, Hosts, HostsCategory, HostsEntry} from "@common/hosts";
  import {Prop} from "vue-property-decorator";
  import ConfirmButton from "@renderer/components/confirm-button/ConfirmButton.vue";
  import {Mutation, State} from "vuex-class";

  // The @Component decorator indicates the class is a Vue component
  @Component({
    components: {
      ConfirmButton
    }
  })
  export default class HostsCategoryEditor extends Vue {
    @State('hosts', { namespace: 'app' })
    protected hosts!: Hosts;

    @State('selectedId', { namespace: 'app' })
    protected readonly selectedId!: string | null;

    @Mutation('updateCategory', { namespace: 'app' })
    protected updateCategory!: (value: HostsCategory) => void;

    @Mutation('deleteCategory', { namespace: 'app' })
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

      this.updateCategory({
        ...this.category,
        name: newValue
      });
    }

    protected onDelete(): void {
      if (this.category === null) {
        return;
      }

      this.deleteCategory(this.category);
    }
  }
</script>

<style scoped lang="scss">

</style>
