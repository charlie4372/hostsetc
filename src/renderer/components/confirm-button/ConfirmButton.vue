<template>
  <v-dialog
    v-model="visible"
    persistent
    max-width="290"
  >
    <template
      v-if="buttonVisible"
      v-slot:activator="{ on }"
    >
      <v-btn
        :color="buttonColor"
        :block="buttonBlock"
        :disabled="buttonDisabled"
        v-on="on"
      >
        {{ buttonText }}
      </v-btn>
    </template>
    <v-card>
      <v-card-title
        class="headline"
      >
        {{ title }}
      </v-card-title>
      <v-card-text>
        <slot>
          {{ content }}
        </slot>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="onClose(false)">
          {{ cancelText }}
        </v-btn>
        <v-btn
          color="primary"
          @click="onClose(true)"
        >
          {{ okText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import { Prop, Watch } from 'vue-property-decorator';

  // The @Component decorator indicates the class is a Vue component
  @Component({
    components: {
    }
  })
  export default class ConfirmButton extends Vue {
    protected visible = false;

    @Prop({type: Boolean, default: true })
    public readonly buttonVisible!: boolean;

    @Prop({type: String, default: 'Confirm' })
    public readonly buttonText!: string;

    @Prop({type: String })
    public readonly buttonColor!: string | null;

    @Prop({type: Boolean})
    public readonly buttonBlock!: boolean;

    @Prop({type: Boolean})
    public readonly buttonDisabled!: boolean;

    @Prop({type: String, default: 'Are you sure?' })
    public readonly title!: string;

    @Prop({type: String, default: 'Are you sure?' })
    public readonly content!: string;

    @Prop({type: String, default: 'OK'})
    public readonly okText!: string;

    @Prop({type: String, default: 'Cancel'})
    public readonly cancelText!: string;

    @Prop({type: Boolean })
    public readonly value!: boolean;

    public constructor() {
      super();

      this.visible = this.value;
    }

    @Watch('value')
    protected onValueChanged(newValue: boolean): void {
      this.visible = newValue;
    }

    protected onClose(confirmed: boolean): void {
      if (confirmed) {
        this.$emit('click');
      }

      this.visible = false;
    }
  }
</script>

<style scoped lang="scss">

</style>
