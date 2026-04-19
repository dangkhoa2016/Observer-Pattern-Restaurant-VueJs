<template>

  <div :class='chefClass'>
    <h5 class='card-title p-2'>Chef: {{ chef.id }}</h5>
    <div class='card-body px-2 py-0'>
      <div class='clearfix'></div>
      <div class='cook-progress'>
        <processing v-if='currentOrder' @complete='completeOrder'
          :progress-icon='progressIcon' bar-type='chef'>
          {{ $appLabels.PREPARING }} <strong>{{ currentOrder.food.name }}</strong>
        </processing>
      </div>
    </div>
    <div class='card-footer bg-info text-white'>
      {{ $appLabels.MOTTO }}: "{{ slogan }}"
    </div>
  </div>

</template>

<script src='./chef.js'></script>
