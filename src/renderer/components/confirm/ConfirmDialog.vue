<template>
  <v-dialog
    v-model="visible"
    persistent
    max-width="500"
  >
    <v-card>
      <v-card-title class="headline">
        {{ title }}
      </v-card-title>
      <v-card-text>
        <slot>
          {{ content }}
        </slot>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="$emit('click', false)">
          {{ cancelText }}
        </v-btn>
        <v-btn
          color="primary"
          @click="$emit('click', true)"
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
  import { Prop } from 'vue-property-decorator';

  // The @Component decorator indicates the class is a Vue component
  @Component({})
  export default class ConfirmDialog extends Vue {
    @Prop({type: Boolean})
    public readonly visible!: boolean;

    @Prop({type: String, default: 'Are you sure?' })
    public readonly title!: string;

    @Prop({type: String, default: 'Are you sure?' })
    public readonly content!: string;

    @Prop({type: String, default: 'OK'})
    public readonly okText!: string;

    @Prop({type: String, default: 'Cancel'})
    public readonly cancelText!: string;
  }
</script>
