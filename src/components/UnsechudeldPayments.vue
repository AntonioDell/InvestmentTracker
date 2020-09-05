<template>
  <b-container>
    <b-row>
      <b-col :cols="2">
        <b-form-select
          id="group-recurring-rate"
          v-model="addPaymentRecurringRate"
          :options="recurringRateOptions"
        />
      </b-col>
      <b-col :cols="3">
        <b-form-datepicker
          id="datepicker-dateformat2"
          v-model="addPaymentDate"
          value-as-date
          :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
        />
      </b-col>
      <b-col :cols="6">
        <money id="add-payment-amount" v-model="addPaymentAmount" currency="EUR" />
      </b-col>
      <b-col :cols="1">
        <b-button block variant="success" @click="addPayment()">
          <b-icon-plus />
        </b-button>
      </b-col>
    </b-row>
    <b-row>
      <template v-for="(payment, index) in paymentsData">
        <b-col :cols="2" :key="payment.id+'col1'">
          <b-form-input
            :id="payment.id+'-recurring-rate'"
            :value="recurringRateOptions.find(option => option.value === payment.recurringRate).text"
            readonly
          />
        </b-col>
        <b-col :cols="3" :key="payment.id+'col2'">
          <b-form-datepicker
            :id="payment.id+'-reference-date'"
            :value="payment.referenceDate"
            value-as-date
            readonly
            :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
          />
        </b-col>
        <b-col :cols="6" :key="payment.id+'col3'">
          <money :id="payment.id+'-amount'" :value="payment.amount" currency="EUR" readonly />
        </b-col>
        <b-col :cols="1" :key="payment.id+'col4'">
          <b-button block variant="danger" @click="removePayment(index)">
            <b-icon-x />
          </b-button>
        </b-col>
      </template>
    </b-row>
  </b-container>
</template>

<script>
import Money from "@/components/Money.vue";
import { BIconPlus, BIconX } from "bootstrap-vue";
export default {
  name: "unscheduled-payments",
  components: { Money, BIconPlus, BIconX },
  props: {
    payments: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      paymentsData: this.payments,
      addPaymentRecurringRate: RECURRING_RATE_NONE,
      addPaymentAmount: 0,
      addPaymentDate: null,
      recurringRateOptions: [
        { text: "Single", value: RECURRING_RATE_NONE },
        { text: "Monthly", value: RECURRING_RATE_MONTHLY },
        {
          text: "Yearly",
          value: RECURRING_RATE_YEARLY
        }
      ]
    };
  },
  methods: {
    addPayment() {
      if (
        this.addPaymentRecurringRate !== undefined &&
        this.addPaymentDate &&
        this.addPaymentAmount
      ) {
        const id =
          this.paymentsData.length > 0
            ? this.paymentsData[this.paymentsData.length - 1].id + 1
            : 0;
        this.paymentsData.push(
          new Payment(
            this.addPaymentRecurringRate,
            this.addPaymentDate,
            this.addPaymentAmount,
            id
          )
        );
        this.addPaymentRecurringRate = RECURRING_RATE_NONE;
        this.addPaymentDate = null;
        this.addPaymentAmount = 0;
      }
    },
    removePayment(index) {
      this.paymentsData.splice(index, 1);
    }
  }
};

const RECURRING_RATE_NONE = 0;
const RECURRING_RATE_MONTHLY = 1;
const RECURRING_RATE_YEARLY = 2;

export class Payment {
  isRecurring = false;
  recurringRate = RECURRING_RATE_NONE;
  referenceDate;
  amount;
  id;

  constructor(recurringRate, referenceDate, amount, id) {
    this.isRecurring = recurringRate !== RECURRING_RATE_NONE;
    this.recurringRate = recurringRate;
    this.referenceDate = referenceDate;
    this.amount = amount;
    this.id = id;
  }
}
</script>

<style>
</style>