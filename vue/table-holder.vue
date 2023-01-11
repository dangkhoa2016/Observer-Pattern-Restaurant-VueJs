<template>

  <div class='row mt-4'>
    <div class='col-md'>
      <div id='table-holder'>
        <table-item v-for='(item, index) in tables' :key='`table-${item.created_at}`'
          :table='item' :index='index'></table-item>
      </div>
    </div>
  </div>

</template>

<script>

  /*jshint esversion: 9 */
  import TableItem from './table-item.vue';

  export default {
    components: { TableItem, },
    computed: {
      ...Vuex.mapGetters({
        tables: 'restaurantStore/getTables',
      }),
    },
  };

</script>

