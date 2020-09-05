<template>
  <div>
    <unscheduled-payments />
    <split-table dark striped hover :items="repaymentTable" :perPage="perPage" />
  </div>
</template>

<script>
import _ from "lodash";
import { LocalDate, DateTimeFormatter } from "@js-joda/core";
import SplitTable from "@/components/SplitTable.vue";
import UnscheduledPayments from "@/components/UnsechudeldPayments.vue";

export const MONTHLY = 0;
export const YEARLY = 1;
const TOO_MANY_ROWS_COUNT = 999;

export default {
  name: "annuity-loan",
  components: { SplitTable, UnscheduledPayments },
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
    interestFixationYears: Number,
    repayment: {
      type: Number,
      default: 0.02,
      validator: function(value) {
        return value > 0.0001;
      }
    },
    paymentInterval: {
      default: YEARLY,
      type: Number,
      validator: function(value) {
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
      let table = [];
      if (
        this.repayment === 0 ||
        this.loanAmount === 0 ||
        this.repayment * this.loanAmount < 1
      ) {
        return table;
      }
      let i = 0;
      const fixationEndIndex =
        this.paymentInterval === YEARLY
          ? this.interestFixationYears
          : this.interestFixationYears * 12;
      let currentAmount = this.loanAmount;

      do {
        const row = this.calculateNextRow(currentAmount, i);
        currentAmount = row.remainingAmount;
        table[i] = row;
        if (i === fixationEndIndex) {
          this.$emit("fixationenddebt", row.remainingAmount);
        }
        i++;
      } while (currentAmount > 0 && i < TOO_MANY_ROWS_COUNT);

      if (i === TOO_MANY_ROWS_COUNT) {
        console.error("Too many rows to calculate.");
        return [];
      }

      const sumDebit = table
        .map(row => row.debit)
        .reduce((debit, debitSum) => debit + debitSum, 0);
      this.$emit("sumdebit", sumDebit);

      return table;
    }
  },
  methods: {
    refreshTable: _.debounce(function() {
      this.$refs.table.refresh();
    }, 1500),
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