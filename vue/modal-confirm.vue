<template>
  
  <b-modal id='modal-delete-table'
    ok-title='Yes' centered @hidden='handle_hidden'
    cancel-title='Close' ok-variant='danger'
    no-close-on-backdrop='true' @ok='handle_ok' size='md'>

    <template #modal-header='{ close }'>
      <h4 class='mb-0'>Please confirm</h4>
      <button type='button' class='btn btn-close btn-sm' data-bs-dismiss='modal'
        aria-label='Close' @click.prevent='close()'></button>
    </template>

    <div class='modal-body'>
      <p class='mb-0'>Are you sure to remove this table ?</p>
    </div>
  </b-modal>

</template>

<script src='./modal-confirm.js'></script>
