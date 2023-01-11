<template>

  <b-card :class='panel_class' id='panel-action'
    header='Action' header-tag='h5'>
    <b-button href='#' @click.prevent='addTable' variant='warning'
      class='btn-add-table'>Add table</b-button>
    <b-button class='btn-action-main' variant='success'
      @click.prevent='isShow = !isShow' href='#'>
      <span class='fas fa-atom'></span>
    </b-button>
  </b-card>

</template>

<script src='./panel-action.js' />
