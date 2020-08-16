<template>
  <div class="overflow-auto">
    <b-pagination
      v-if="repaymentTable.length > perPage"
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
import { LocalDate, DateTimeFormatter } from "@js-joda/core";

export const MONTHLY = 0;
export const YEARLY = 1;

export default {
  name: "annuity-loan",
  props: {
    loanAmount: {
      type: Number,
      default: 100000,
      validator: function(value) {
        // The value must match one of these strings
        return value > 1;
      }
    },
    debitInterest: Number,
    repayment: {
      type: Number,
      default: 0.02,
      validator: function(value) {
        // The value must match one of these strings
        return value > 0.0001;
      }
    },
    paymentInterval: {
      default: YEARLY,
      type: Number,
      validator: function(value) {
        // The value must match one of these strings
        return [MONTHLY, YEARLY].indexOf(value) !== -1;
      }
    },
    startDate: {
      type: LocalDate,
      default() {
        return LocalDate.now()
          .plusMonths(1)
          .withDayOfMonth(1);
      }
    }
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
    },
    paymentInterval() {
      this.refreshTable();
    }
  },
  computed: {
    actualStartDate() {
      return this.startDate.compareTo(this.startDate.withDayOfMonth(1)) === 0
        ? this.startDate
        : this.startDate.plusMonths(1).withDayOfMonth(1);
    },
    repaymentTable() {
      const table = [];
      if (this.repayment === 0 || this.loanAmount === 0) {
        return table;
      }
      let i = 0;
      let currentAmount = this.loanAmount;

      do {
        const row = this.calculateNextRow(currentAmount, i);
        currentAmount = row.remainingAmount;
        table[i] = row;
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
    calculateNextRow(currentAmount, currentRow) {
      const dateFormatter = DateTimeFormatter.ofPattern("MM.yyyy");
      if (this.paymentInterval === MONTHLY) {
        return {
          month: this.actualStartDate
            .plusMonths(currentRow)
            .format(dateFormatter),
          ...this.calculateMonthlyAmounts(currentAmount)
        };
      } else {
        const currentYear = this.actualStartDate
          .plusYears(currentRow)
          .withMonth(12);
        let intraYearAmount = currentAmount;
        const yearlyAmounts = {
          year: currentYear.format(dateFormatter),
          debit: 0,
          repayment: 0,
          rate: 0,
          remainingAmount: 0
        };
        const monthsToCalculate =
          currentRow !== 0
            ? 12
            : (this.actualStartDate.dayOfMonth() !== 1
                ? this.actualStartDate.plusMonths(1).withDayOfMonth(1)
                : this.actualStartDate
              )
                .until(currentYear)
                .toTotalMonths();
        console.log(
          `Months to calculate for year ${currentRow}`,
          monthsToCalculate
        );
        for (let m = 0; m < monthsToCalculate; m++) {
          const monthlyAmount = this.calculateMonthlyAmounts(intraYearAmount);
          yearlyAmounts.debit = this.round(
            yearlyAmounts.debit + monthlyAmount.debit
          );
          yearlyAmounts.repayment = this.round(
            yearlyAmounts.repayment + monthlyAmount.repayment
          );
          yearlyAmounts.rate = this.round(
            yearlyAmounts.rate + monthlyAmount.rate
          );
          yearlyAmounts.remainingAmount = monthlyAmount.remainingAmount;

          intraYearAmount = monthlyAmount.remainingAmount;
        }
        console.log(`Yearly amounts for year ${currentRow} is`, yearlyAmounts);
        return yearlyAmounts;
      }
    },
    calculateMonthlyAmounts(currentAmount) {
      let debit = this.round(currentAmount * this.debitInterest);
      let repayment = this.round(this.fixedRate - debit);
      debit = this.round(debit / 12);
      repayment = this.round(repayment / 12);
      const remainingAmount = this.round(currentAmount - repayment);
      const rate = Math.round(this.fixedRate / 12);
      return { debit, repayment, rate, remainingAmount };
    },
    round(num) {
      return Math.round((num + Number.EPSILON) * 100) / 100;
    }
  }
};
</script>

<style>
</style>