<template>
  <formatted-number
    :value="valueData"
    :format-options="percentFormat"
    @input="$emit('input', $event)"
    :min="min"
    :max="max"
    :pre-format-function="divideBy100"
    :step=".0001"
    v-bind="$attrs"
  />
</template>

<script>
import FormattedNumber from "@/components/FormattedNumber.vue";

export default {
  name: "percentage",
  inheritAttrs: false,
  components: { FormattedNumber },
  props: {
    value: Number,
    max: {
      type: Number,
      default: 1
    },
    min: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      type: "text",
      percentFormat: {
        style: "percent",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      },
      valueData: this.value
    };
  },
  methods:{
    divideBy100(value){
      return parseFloat((value / 100).toFixed(4));
    }
  },
  
  watch:{
     
  }
};
</script>

<style>
</style>