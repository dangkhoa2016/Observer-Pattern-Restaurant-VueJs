<template>

  <div :class='infoClass' :data-id='info.id'>
    Chef {{ info.chef_id }} {{ info.message }}
    <b-button v-if='info.order' block size='sm' :class='[`w-100`, info.order.food.color.css]'>
      {{ info.order.food.name }}
    </b-button>
    <br/>
    at {{ info.date }}
  </div>

</template>

<script src='./assistant-log.js'></script>
