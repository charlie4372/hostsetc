<template>
  <v-card>
    <v-card-text class="h-100 d-flex flex-column">
      <div>
        <v-text-field
          v-model="internalName"
          label="Name"
          required
          :readonly="readonly"
          @change="onChange"
        />
      </div>
      <div class="align-self-end mt-4">
        <confirm-button
          v-if="adding"
          button-text="Cancel"
          content="Are you sure you want to discard these changes?"
          @click="onCancelAdding"
        />
        <confirm-button
          v-else-if="canDelete"
          button-text="Delete"
          content="Are you sure you want to delete this category?"
          :disabled="!changed"
          @click="onDelete"
        />
        <v-btn
          v-if="!adding"
          :disabled="!changed"
          @click="onRevert"
        >
          Revert
        </v-btn>
        <v-btn
          color="primary"
          :disabled="!changed"
          @click="onUpdate"
        >
          Update
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import {HostsCategory} from "@common/hosts";
  import {Prop, Watch} from "vue-property-decorator";
  import ConfirmButton from "@renderer/components/confirm-button/ConfirmButton.vue";

  // The @Component decorator indicates the class is a Vue component
  @Component({
    components: {
      ConfirmButton
    }
  })
  export default class HostsCategoryEditor extends Vue {
    @Prop({ type: Object, default: null })
    public readonly category!: HostsCategory | null;

    @Prop({ type: Boolean })
    public readonly readonly!: boolean;

    @Prop({type: Boolean})
    public readonly canDelete!: boolean;

    @Prop({type: Boolean})
    public readonly adding!: boolean;

    protected internalName!: string;
    protected changed = false;

    public constructor() {
      super();

      this.setInternalValues(this.category);
    }

    protected setInternalValues(category: HostsCategory | null): void {
      if (category) {
        this.internalName = category.name;
      } else {
        this.internalName = '';
      }

      this.changed = false;
    }

    @Watch('category')
    protected onCategoryChanged(newValue: HostsCategory): void {
      this.setInternalValues(newValue);
    }

    protected onUpdate(): void {
      if (this.category === null) {
        this.$emit('updated', {
          name: this.internalName,
          entries: []
        } as HostsCategory);
      } else {
        this.$emit('updated', {
          ...this.category,
          name: this.internalName
        });
      }
      this.changed = false;
    }

    protected onRevert(): void {
      this.setInternalValues(this.category);
    }

    protected onChange(): void {
      this.changed = true;
    }

    protected onCancelAdding(): void {
      this.$emit('cancel-adding');
    }

  protected onDelete(): void {
      this.$emit('deleted');
    }
  }
</script>

<style scoped lang="scss">

</style>
