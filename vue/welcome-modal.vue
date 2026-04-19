<template>

  <b-modal id='welcome-modal' ok-only ok-variant='secondary' :ok-title='$appLabels.CLOSE'>
    <template #modal-header='{ close }'>
      <h4 class='mb-0'>{{ $appLabels.WELCOME_TITLE }}</h4>
      <button type='button' class='btn btn-close btn-sm' data-bs-dismiss='modal'
        aria-label='Close' @click.prevent='close()'></button>
    </template>

    Click <code>{{ $appLabels.ADD_DISHES }}</code> and choose a few items to see how the workflow works.
  </b-modal>

</template>
