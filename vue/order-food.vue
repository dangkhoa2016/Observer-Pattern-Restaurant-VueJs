<template>

  <div :class='orderClass'>
    <b-button size='sm' :class='[`w-100`, order.food.color.css]'>
      {{ order.food.name }}
    </b-button>
    <div class='eat-progress'>
      <processing v-if='foodIsCooked'
        @complete='handleEatComplete'
        :progress-icon='progressIcon' :order-id='order.id'>
        Enjoying the dish...
      </processing>
    </div>
  </div>

</template>

<script src='./order-food.js'></script>
