<template>
  <b-form>
    <b-form-group
      description="Price of the real estate"
      label="Buying price"
      label-for="buying-price"
    >
      <money id="buying-price" v-model="price" class="form-control" />
    </b-form-group>
    <b-form-group description="Debit interest" label="Debit interest" label-for="debit-interest">
      <percentage
        id="debit-interest"
        v-model="debitInterest"
        class="form-control"
        :min="0"
        :max="100"
      />
    </b-form-group>
    <b-form-input :value="debitInterest" readonly type="number" />
  </b-form>
</template>

<script>
import Percentage from "@/components/Percentage.vue";

export default {
  name: "RealEstate",
  components: { Percentage },
  props: {},
  computed: {},
  data() {
    return {
      price: 10,
      debitInterest: 0.98
    };
  },
  methods: {
    logStuff(value) {
      console.log(typeof value);
      this.$emit("input", value);
    }
  }
};
</script>

<style>
</style>