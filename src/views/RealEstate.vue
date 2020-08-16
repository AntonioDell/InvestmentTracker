<template>
  <b-form>
    <b-container>
      <b-form-row>
        <b-col v-bind="columnOptions">
          <b-form-group label="Buying price" label-for="buying-price">
            <money id="buying-price" v-model.number="price" currency="EUR" :min="0" />
          </b-form-group>
        </b-col>
        <b-col v-bind="columnOptions">
          <b-form-group label="Debit interest" label-for="debit-interest">
            <percentage id="debit-interest" v-model.number="debitInterest" />
          </b-form-group>
        </b-col>
        <b-col v-bind="columnOptions">
          <b-form-group label="Repayment rate" label-for="repayment-rate">
            <percentage id="repayment-rate" v-model.number="repaymentRate" />
          </b-form-group>
        </b-col>
        <b-col v-bind="columnOptions">
          <b-form-group label="Real estate transfer tax" label-for="real-estate-transfer-tax">
            <percentage id="real-estate-transfer-tax" v-model.number="realEstateTransferTax" />
          </b-form-group>
        </b-col>
        <b-col v-bind="columnOptions">
          <b-form-group label="Notary fees" label-for="notary-fees">
            <percentage id="notary-fees" v-model.number="notaryFees" />
          </b-form-group>
        </b-col>
        <b-col v-bind="columnOptions">
          <b-form-group label="Financing amount" label-for="financing-amount">
            <money id="financing-amount" v-model.number="financing" currency="EUR" :min="0" />
          </b-form-group>
        </b-col>
        <b-col v-bind="columnOptions">
          <b-form-group label="Annuity interval" label-for="annuity-interval">
            <b-form-radio-group
              id="group-intervals"
              v-model="annuityInterval"
              :options="annuityIntervalOptions"
              name="interval-options"
              buttons
              button-variant="light"
            ></b-form-radio-group>
          </b-form-group>
        </b-col>
      </b-form-row>
      <b-row>
        <b-col>
          <separator />
        </b-col>
      </b-row>
      <b-form-row>
        <b-col v-bind="columnOptions">
          <b-form-group label="Total cost" label-for="total-cost">
            <money id="buying-price" :value="totalCost" currency="EUR" readonly />
          </b-form-group>
        </b-col>
      </b-form-row>
      <b-row>
        <b-col>
          <separator />
        </b-col>
      </b-row>
      <b-row>
        <b-col :cols="12">
          <annuity-loan
            :loanAmount="financing"
            :debitInterest="debitInterest"
            :repayment="repaymentRate"
            :payment-interval="annuityInterval"
          />
        </b-col>
      </b-row>
    </b-container>
  </b-form>
</template>

<script>
import Percentage from "@/components/Percentage.vue";
import Money from "@/components/Money.vue";
import Separator from "@/components/Separator.vue";
import AnnuityLoan, { MONTHLY, YEARLY } from "@/components/AnnuityLoan.vue";

export default {
  name: "RealEstate",
  components: { Percentage, Money, Separator, AnnuityLoan },
  props: {},
  data() {
    return {
      price: 240000,
      financing: 240000,
      debitInterest: 0.0122,
      realEstateTransferTax: 0.0035,
      notaryFees: 0.003,
      repaymentRate: 0.02,
      columnOptions: {
        cols: 12,
        md: 4
      },
      annuityInterval: YEARLY,
      annuityIntervalOptions: [
        {
          text: "Yearly",
          value: YEARLY
        },
        { text: "Monthly", value: MONTHLY }
      ]
    };
  },
  computed: {
    totalCost: function() {
      return (
        this.price +
        this.price * this.realEstateTransferTax +
        this.price * this.notaryFees
      );
    }
  }
};
</script>

<style>
</style>