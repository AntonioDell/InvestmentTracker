<template>
  <div class="overflow-auto">
    <b-pagination
      :total-rows="repaymentTable.length"
      v-model="currentPage"
      :per-page="perPage"
      aria-controls="annuity-table"
    ></b-pagination>
    <b-table
      id="annuity-table"
      dark
      striped
      hover
      :items="provideRepaymentTable"
      :per-page="perPage"
      :current-page="currentPage"
      ref="table"
    ></b-table>
  </div>
</template>

<script>
import _ from "lodash";

export default {
  name: "annuity-loan",
  props: {
    loanAmount: Number,
    debitInterest: Number,
    repayment: Number
  },
  data() {
    return {
      fixedRate:
        this.loanAmount * this.repayment + this.loanAmount * this.debitInterest,
      currentPage: 1,
      perPage: 50
    };
  },
  watch: {
    loanAmount(newValue) {
      console.log("Called with newValue", newValue);
      this.fixedRate =
        newValue * this.repayment + newValue * this.debitInterest;
      this.refreshTable();
    },
    debitInterest(newValue) {
      this.fixedRate =
        this.loanAmount * this.repayment + this.loanAmount * newValue;
      this.refreshTable();
    },
    repayment(newValue) {
      this.fixedRate =
        this.loanAmount * newValue + this.loanAmount * this.debitInterest;
      this.refreshTable();
    }
  },
  computed: {
    repaymentTable() {
      const table = [];
      let i = 0;
      let currentAmount = this.loanAmount;

      do {
        const row = this.calculateNextMonthlyRate(currentAmount);
        currentAmount = row.remainingAmount;
        table[i] = { month: i + 1, ...row };

        i++;
      } while (currentAmount > 0);

      return table;
    }
  },
  methods: {
    refreshTable: _.debounce(function() {
      this.$refs.table.refresh();
    }, 1500),
    provideRepaymentTable({ currentPage, perPage }) {
      const lowerBounds = (currentPage - 1) * perPage;
      const upperBounds = lowerBounds + perPage;

      return this.repaymentTable.filter(
        (row, index) => index >= lowerBounds && index < upperBounds
      );
    },
    calculateNextMonthlyRate(currentAmount) {
      const monthlyDebit = this.round(
        (currentAmount * this.debitInterest) / 12
      );
      const monthlyRepayment = this.round((this.fixedRate - monthlyDebit) / 12);

      const remainingAmount = this.round(currentAmount - monthlyRepayment);
      const monthlyRate = this.round(monthlyDebit + monthlyRepayment);

      return { monthlyDebit, monthlyRepayment, monthlyRate, remainingAmount };
    },
    round(num) {
      return Math.round((num + Number.EPSILON) * 100) / 100;
    }
  }
};
</script>

<style>
</style>