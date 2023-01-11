<template>

  <div :class='main_class'>
    <div class='input-group'>
      <div class='form-control p-1'>
        <progress-bar :time-to-complete='time_to_complete'
          @progress-bar-complete='mark_completed' :skip-timeout='skip_timeout'></progress-bar>
      </div>
      <b-button class='btn-complete' @click.prevent='complete'
        variant='info' v-b-tooltip='tooltip_config'>
        <span :class='progressIcon'></span>
      </b-button>
    </div>
    <p class='text-muted mb-0'>
      <slot></slot>
    </p>
  </div>

</template>

<script src='./processing.js'></script>
