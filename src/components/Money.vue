<template>
  <formatted-number
    :value="value"
    :format-options="moneyFormat"
    @input="$emit('input', $event)"
    :min="min"
    :max="max"
    v-bind="$attrs"
  />
</template>

<script>
import FormattedNumber from "@/components/FormattedNumber.vue";

export default {
  name: "money",
  inheritAttrs: false,
  components: { FormattedNumber },
  props: {
    value: Number,
    currency: String,
    min: Number,
    max: Number
  },
  data() {
    return {
      moneyFormat: {
        style: "currency",
        currency: this.currency,
        currencyDisplay: "narrowSymbol"
      },
    };
  }
};
</script>

<style>
</style>