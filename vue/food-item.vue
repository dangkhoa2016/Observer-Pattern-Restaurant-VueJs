<template>

  <div class='list-group-item'>
    <component :is="`style`">
      .{{ food_class_name }}.focus { box-shadow: 0 0 0 0.2rem {{box_shadow}} !important; }
    </component>

    <div class='d-flex w-100 justify-content-between'>
      <span class='food-name'>
        <span class='food-status' :class='status_class'></span>
        <label>{{ status_text }}</label>
      </span>
      <a class='btn btn-sm' :class='button_class'
        @click.prevent='toggle_select'>{{ food.name }}</a>
    </div>
  </div>

</template>

<script src='./food-item.js'></script>
