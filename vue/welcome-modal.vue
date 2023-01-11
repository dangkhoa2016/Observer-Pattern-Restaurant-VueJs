<template>

  <b-modal id='welcome-modal' ok-only ok-variant='secondary' ok-title='Close'>
    <template #modal-header='{ close }'>
      <h4 class='mb-0'>Welcome !</h4>
      <button type='button' class='btn btn-close btn-sm' data-bs-dismiss='modal'
        aria-label='Close' @click.prevent='close()'></button>
    </template>

    Click on <code>Add foods</code> button and select some foods to see how it working....
  </b-modal>

</template>
