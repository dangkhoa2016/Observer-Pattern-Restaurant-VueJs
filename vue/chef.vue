<template>

  <div :class='chef_class'>
    <h5 class='card-title p-2'>Chef: {{ chef.id }}</h5>
    <div class='card-body px-2 py-0'>
      <div class='clearfix'></div>
      <div class='cook-progress'>
        <processing v-if='current_order' @complete='complete_order'
          :progress-icon='progress_icon' bar-type='chef'>
          Processing <strong>{{ current_order.food.name }}</strong>
        </processing>
      </div>
    </div>
    <div class='card-footer bg-info text-white'>
      Slogan: "{{ slogan }}"
    </div>
  </div>

</template>

<script src='./chef.js'></script>
