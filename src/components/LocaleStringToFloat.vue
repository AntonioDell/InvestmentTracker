<script>
export default {
  methods: {
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