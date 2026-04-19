<template>

  <div :class='mainClass' role='status' aria-live='polite'>
    <div class='input-group'>
      <div class='form-control p-1'>
        <progress-bar :time-to-complete='timeToComplete'
          @progress-bar-complete='markCompleted' :skip-timeout='skipTimeout'></progress-bar>
      </div>
      <b-button type='button' class='btn-complete' @click='complete'
        variant='info' v-b-tooltip='tooltipConfig'>
        <span :class='progressIcon'></span>
      </b-button>
    </div>
    <p class='small text-dark mb-0'>
      <slot></slot>
    </p>
  </div>

</template>

<script src='./processing.js'></script>
