<template>

  <b-card :class='panelClass' id='panel-action'
    :header='$appLabels.CONTROLS' header-tag='h5'>
    <b-button type='button' @click='addTable' variant='warning'
      class='btn-add-table'>{{ $appLabels.ADD_TABLE }}</b-button>
    <b-button class='btn-action-main' variant='success'
      type='button' @click='isShow = !isShow'>
      <span class='fas fa-atom'></span>
    </b-button>
  </b-card>

</template>

<script src='./panel-action.js' />
