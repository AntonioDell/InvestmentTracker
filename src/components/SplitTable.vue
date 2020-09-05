<template>
  <div class="overflow-auto">
    <b-pagination
      v-if="items.length > $attrs.perPage"
      :total-rows="items.length"
      v-model="currentPage"
      v-bind="$attrs"
    ></b-pagination>
    <b-table id="split-table-1" v-bind="$attrs" :items="table1Rows" :current-page="currentPage" :per-page="table1PerPage"></b-table>
    <b-table id="split-table-2" v-bind="$attrs" :items="table2Rows" :current-page="currentPage" :per-page="table2PerPage"></b-table>
  </div>
</template>

<script>
export default {
  name: "split-table",
  inheritAttrs: false,
  props: {
    splitIndex: Number,
    items: Array
  },
  data() {
    return {
      currentPage: 0
    };
  },
  computed: {
    totalPerPage() {
      return this.$attrs.perPage ? this.$attrs.perPage : this.items.length;
    },
    table1PerPage() {
      return Math.ceil(this.totalPerPage / 2);
    },
    table1Rows() {
      return this.items.filter(
        (row, index) => index % this.totalPerPage < this.table1PerPage
      );
    },
    table2PerPage(){
      return Math.floor(this.totalPerPage / 2);
    },
    table2Rows() {
      return this.items.filter(
        (row, index) => index % this.totalPerPage >= this.table2PerPage
      );
    }
  }
};
</script>

<style>
</style>