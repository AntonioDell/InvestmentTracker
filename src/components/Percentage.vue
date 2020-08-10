<template>
  <input
    :value="formattedValue"
    :type="type"
    :min="min"
    :max="max"
    @input="onInput(parseFloat($event.target.value))"
    @focus="onFocus()"
    @blur="onBlur()"
    class="form-control"
  />
</template>

<script>
import { mask } from "vue-the-mask";

export default {
  name: "percentage",
  directives: { mask },
  props: {
    value: Number,
    max: Number,
    min: Number
  },
  data() {
    return {
      type: "text",
      actualValue: this.value.toFixed(2),
      formattedValue: this.format(this.value.toFixed(2))
    };
  },
  methods: {
    onInput(value) {
      this.formattedValue = isNaN(value)
        ? 0
        : Math.min(Math.max(value, this.min), this.max);
    },
    format(value) {
      return (value ? parseFloat(value).toLocaleString() : "0,00") + " %";
    },
    onFocus() {
      this.type = "number";
      const decimalSeparator = (1.1).toLocaleString().substring(1, 2);
      const thousandSeparator = (1000).toLocaleString().substring(1, 2);

      let intStr = this.formattedValue;
      let decimalStr = 0;
      if (intStr.includes(decimalSeparator)) {
        [intStr, decimalStr] = intStr.split(decimalSeparator);
      }
      if (thousandSeparator !== "0" && intStr.includes(thousandSeparator)) {
        intStr = intStr.split(thousandSeparator).join("");
      }
      this.formattedValue = parseFloat(intStr + "." + decimalStr);
    },
    onBlur() {
      this.actualValue = this.formattedValue.toFixed(2);
      this.$emit("input", parseFloat(this.actualValue));
      this.formattedValue = this.format(this.actualValue);
      this.type = "text";
    }
  }
};
</script>

<style>
</style>