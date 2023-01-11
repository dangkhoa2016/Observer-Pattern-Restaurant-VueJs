<template>

  <b-modal id='modal-foods' size='md'
    footer-class='justify-content-between'
    @hidden='handle_hidden' @ok='handle_ok'
    no-close-on-backdrop='true'>

    <template #modal-header='{ close }'>
      <h4 class='mb-0'>Add foods</h4>
      <button type='button' class='btn btn-close btn-sm' data-bs-dismiss='modal'
        aria-label='Close' @click.prevent='close()'></button>
    </template>

    <template #modal-footer='{ ok, cancel }'>
      <label>{{ message }}</label>
      <div>
        <b-button variant='secondary' @click.prevent='cancel()'>Close</b-button>
        <b-button variant='primary' class='btn-order' @click.prevent='ok()'>Order</b-button>
      </div>
    </template>

    <div class='list-group' id='food-list'>
      <food-item v-for='(food, index) in foods' :food='food' :key='`food-${index}`'></food-item>
    </div>
  </b-modal>

</template>

<script src='./modal-foods.js'></script>
