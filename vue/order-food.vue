<template>

  <div :class='order_class'>
    <b-button size='sm' :class='[`w-100`, order.food.color.css]'>
      {{ order.food.name }}
    </b-button>
    <div class='eat-progress'>
      <processing v-if='food_is_cooked'
        @complete='eat_complete'
        :progress-icon='progress_icon' :order-id='order.id'>
        Eating...
      </processing>
    </div>
  </div>

</template>

<script src='./order-food.js'></script>
