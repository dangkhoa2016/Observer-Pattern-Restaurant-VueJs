<template>

  <b-modal id='welcome-modal' ok-only ok-variant='secondary' ok-title='Close'>
    <template #modal-header='{ close }'>
      <h4 class='mb-0'>Welcome!</h4>
      <button type='button' class='btn btn-close btn-sm' data-bs-dismiss='modal'
        aria-label='Close' @click.prevent='close()'></button>
    </template>

    Click the <code>Add Items</code> button and select a few items to see how it works.
  </b-modal>

</template>
