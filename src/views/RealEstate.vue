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
            <money id="notary-fees" v-model="notaryFees" currency="EUR" />
          </b-form-group>
        </b-col>
        <b-col v-bind="columnOptions">
          <b-form-group label="Borrowed capital" label-for="borrowed-capital">
            <money id="borrowed-capital" v-model.number="borrowedCapital" currency="EUR" :min="0" />
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
        <b-col v-bind="columnOptions">
          <b-form-group label="Rental income" label-for="rental-income">
            <money id="rental-income" v-model.number="rentalIncome" currency="EUR" :min="0" />
          </b-form-group>
        </b-col>
        <b-col v-bind="columnOptions">
          <b-form-group label="Building year" label-for="building-year">
            <b-form-input
              id="building-year"
              type="number"
              :state="isBuildingYearValid"
              v-model="buildingYear"
            />
          </b-form-group>
        </b-col>
        <b-col v-bind="columnOptions">
          <b-form-group label="Building Part of purchasing price" label-for="building-part">
            <money id="building-part" v-model="buildingPart" currency="EUR" :max="price" :min="0" />
          </b-form-group>
        </b-col>
        <b-col v-bind="columnOptions">
          <b-form-group label="Additional buying costs" label-for="additional-costs">
            <money id="additional-costs" v-model="additionalBuyingCosts" currency="EUR" :min="0" />
          </b-form-group>
        </b-col>
        <b-col v-bind="columnOptions">
          <b-form-group label="Income tax" label-for="income-tax">
            <percentage id="income-tax" v-model.number="incomeTax" />
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
            <money id="total-cost" :value="totalCost" currency="EUR" readonly />
          </b-form-group>
        </b-col>
        <b-col v-bind="columnOptions">
          <b-form-group label="Return on equity" label-for="return-on-equity">
            <percentage id="return-on-equity" :value="returnOnEquity" readonly :max="1000" />
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
            :loanAmount="borrowedCapital"
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
      borrowedCapital: 240000,
      debitInterest: 0.0122,
      realEstateTransferTax: 0.035,
      notaryFees: 3183.25,
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
      ],
      rentalIncome: 9000,
      buildingYear: 1905,
      buildingPart: 146496,
      additionalBuyingCosts: 300,
      incomeTax: 0.42 //Based on income -> https://www.finanz.at/steuern/lohnsteuertabelle/
    };
  },
  computed: {
    isBuildingYearValid() {
      return (
        !isNaN(this.buildingYear) &&
        this.buildingYear > 1800 &&
        this.buildingYear < 2200
      );
    },
    totalCost() {
      return (
        this.price + this.price * this.realEstateTransferTax + this.notaryFees + this.additionalBuyingCosts
      );
    },
    returnOnEquity() {
      const equity = this.totalCost - this.borrowedCapital;

      const writeOffRate = this.buildingYear < 1920 ? 0.025 : 0.02;
      //const writeOffYears = wasBuildingFinishedBefore1920 ? 40 : 50;
      const writeOffAmount = this.totalCost - (this.price - this.buildingPart);
      const taxWriteOff = writeOffAmount * writeOffRate;

      const taxDeductable =
        taxWriteOff +
        this.borrowedCapital * this.debitInterest;
      console.log("ADA: taxDeductable is", taxDeductable);
      const netIncome =
        this.rentalIncome -
        Math.max(0, this.rentalIncome - taxDeductable) * this.incomeTax;

console.log("ADA: netIncome is", netIncome);
console.log("ADA: equity is", equity);
      const roe = (netIncome / equity);

      console.log("ADA: ROE is", roe);

      return roe;
    }
  }
};
</script>

<style>
</style>