<template>
  <input
    :value="displayValue"
    :type="type"
    :min="min"
    :max="max"
    :step="step"
    @input="onInput(parseFloat($event.target.value))"
    @focus="onFocus()"
    @blur="onBlur()"
    class="form-control"
    v-bind="$attrs"
    :readonly="readonlyData"
  />
</template>

<script>
import LocaleStringToFloat from "@/components/LocaleStringToFloat.vue";

export default {
  name: "formatted-number",
  mixins: [LocaleStringToFloat],
  props: {
    value: Number,
    max: Number,
    min: Number,
    preFormatFunction: {
      type: Function,
      default(value) {
        return value;
      }
    },
    formatOptions: Object,
    readonly: String,
    step: {
      default: 1,
      type: Number
    }
  },
  watch: {
    value(newValue) {
      if (this.readonlyData) {
        this.displayValue = this.formatText(
          this.formatNumber(newValue, this.min, this.max)
        );
      }
    }
  },
  data() {
    return {
      type: "text",
      displayValue: this.formatText(
        this.formatNumber(this.value, this.min, this.max)
      ),
      readonlyData:
        this.readonly || this.readonly !== undefined || this.readonly === "true"
    };
  },
  methods: {
    formatNumber(value) {
      if (this.min !== undefined && this.max !== undefined) {
        return Math.min(Math.max(value, this.min), this.max);
      } else if (this.min !== undefined) {
        return Math.max(value, this.min);
      } else if (this.max !== undefined) {
        return Math.min(value, this.max);
      } else {
        return value;
      }
    },
    onInput(value) {
      // FIXME: When value is . the input is strange
      // console.log("value", value);
      this.displayValue = isNaN(value)
        ? this.displayValue
        : this.formatNumber(value);

      this.$emit("input", this.displayValue);
    },
    formatText(value) {
      return (value ? parseFloat(value) : 0).toLocaleString(
        navigator.language,
        this.formatOptions
      );
    },
    onFocus() {
      if (this.readonlyData) {
        return;
      }
      this.displayValue = this.formatNumber(
        this.preFormatFunction(this.fromLocaleString(this.displayValue))
      );
      this.type = "number";
    },
    onBlur() {
      if (this.readonlyData) {
        return;
      }
      this.displayValue = this.formatText(this.displayValue);
      this.type = "text";
    },
    fromLocaleString(localizedString) {
      const decimalSeparator = (1.1).toLocaleString().substring(1, 2);
      const thousandSeparator = (1000).toLocaleString().substring(1, 2);

      let intStr = localizedString;
      let decimalStr = 0;
      if (intStr.includes(decimalSeparator)) {
        [intStr, decimalStr] = intStr.split(decimalSeparator);
      }
      if (thousandSeparator !== "0" && intStr.includes(thousandSeparator)) {
        intStr = intStr.split(thousandSeparator).join("");
      }
      return parseFloat(intStr + "." + decimalStr);
    }
  }
};
</script>

<style>
</style>