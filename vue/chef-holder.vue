<template>

  <div id='chef-holder'>
    <chef v-for='(chef) in chefs' :chef='chef' :key='`chef-${chef.id}`'></chef>
  </div>

</template>

<script>

  /*jshint esversion: 9 */
  import Chef from './chef.vue';

  export default {
    components: { Chef, },
    computed: {
      ...Vuex.mapGetters({
        chefs: 'restaurantStore/getChefs',
      }),
    },
  };

</script>
