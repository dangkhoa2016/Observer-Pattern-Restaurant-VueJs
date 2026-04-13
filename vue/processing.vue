<template>

  <div :class='main_class' role='status' aria-live='polite'>
    <div class='input-group'>
      <div class='form-control p-1'>
        <progress-bar :time-to-complete='time_to_complete'
          @progress-bar-complete='mark_completed' :skip-timeout='skip_timeout'></progress-bar>
      </div>
      <b-button type='button' class='btn-complete' @click='complete'
        variant='info' v-b-tooltip='tooltip_config'>
        <span :class='progressIcon'></span>
      </b-button>
    </div>
    <p class='small text-dark mb-0'>
      <slot></slot>
    </p>
  </div>

</template>

<script src='./processing.js'></script>
