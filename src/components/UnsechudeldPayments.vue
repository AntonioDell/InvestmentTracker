<template>
  <div>
    <b-input-group id="add-payment">
      <b-input-group-prepend>
        <b-form-radio-group
          id="group-recurring-rate"
          v-model="addPaymentRecurringRate"
          :options="recurringRateOptions"
          name="group-recurring-rate"
          buttons
          button-variant="light"
        />
        <b-form-datepicker
          id="datepicker-dateformat2"
          v-model="addPaymentDate"
          value-as-date
          :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
        />
      </b-input-group-prepend>

      <money id="add-payment-amount" v-model="addPaymentAmount" currency="EUR" />

      <b-input-group-append>
        <b-button variant="success" @click="addPayment()">Add</b-button>
      </b-input-group-append>
    </b-input-group>
    <b-input-group v-for="(payment, index) in paymentsData" :key="payment.id">
      <b-input-group-prepend>
        <b-button
          :id="payment.id+'-recurring-rate'"
          disabled
          variant="light"
        >{{recurringRateOptions.find(option => option.value === payment.recurringRate).text}}</b-button>

        <b-form-datepicker
          :id="payment.id+'-reference-date'"
          :value="payment.referenceDate"
          value-as-date
          :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
        />
      </b-input-group-prepend>

      <money :id="payment.id+'-amount'" :value="payment.amount" currency="EUR" readonly />

      <b-input-group-append>
        <b-button variant="success" @click="removePayment(index)">Remove</b-button>
      </b-input-group-append>
    </b-input-group>
  </div>
</template>

<script>
import Money from "@/components/Money.vue";
export default {
  name: "unscheduled-payments",
  components: { Money },
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
      addPaymentDate: new Date(),
      recurringRateOptions: [
        { text: "None", value: RECURRING_RATE_NONE },
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
      console.log(
        `ADA: ${this.addPaymentRecurringRate} ${this.addPaymentAmount} ${this.addPaymentDate}`
      );
      if (
        this.addPaymentRecurringRate !== undefined &&
        this.addPaymentDate &&
        this.addPaymentAmount
      ) {
        const id =
          this.paymentsData.length > 0
            ? this.paymentsData[this.paymentsData.length - 1].id + 1
            : 0;
        console.log(`ADA: ID is ${id}`);
        this.paymentsData.push(
          new Payment(
            this.addPaymentRecurringRate,
            this.addPaymentDate,
            this.addPaymentAmount,
            id
          )
        );
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