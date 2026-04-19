<template>
  
  <b-modal id='modal-delete-table'
    :ok-title='$appLabels.YES' centered @hidden='handleHidden'
    :cancel-title='$appLabels.CLOSE' ok-variant='danger'
    no-close-on-backdrop='true' @ok='handleOk' size='md'>

    <template #modal-header='{ close }'>
      <h4 class='mb-0'>{{ $appLabels.CONFIRM_ACTION }}</h4>
      <button type='button' class='btn btn-close btn-sm' data-bs-dismiss='modal'
        aria-label='Close' @click.prevent='close()'></button>
    </template>

    <div class='modal-body'>
      <p class='mb-0'>{{ $appMessages.TABLE_REMOVE_CONFIRM }}</p>
    </div>
  </b-modal>

</template>

<script src='./modal-confirm.js'></script>
