<template>

  <div class='list-group-item'>
    <component :is="`style`">
      .{{ foodClassName }}.focus { box-shadow: 0 0 0 0.2rem {{ boxShadow }} !important; }
    </component>

    <div class='d-flex w-100 justify-content-between'>
      <span class='food-name'>
        <span class='food-status' :class='statusClass'></span>
        <label>{{ statusText }}</label>
      </span>
      <button type='button' class='btn btn-sm' :class='buttonClass'
        @click='toggleSelect'>{{ food.name }}</button>
    </div>
  </div>

</template>

<script src='./food-item.js'></script>
