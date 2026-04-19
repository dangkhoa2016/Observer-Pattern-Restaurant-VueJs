<template>

  <b-card :class='cardClass' :id='`assistant${_uid}`'
    :header='$appLabels.ASSISTANT' header-tag='h5' header-class='bg-warning'
    footer-class='p-0' v-b-tooltip.sync='tooltipConfig'>

    <div class='small text-muted'>{{ $appLabels.ACTIVITY_LOG }}</div>

    <template #footer>
      <div class='assistant-log-stream' aria-live='polite' aria-atomic='false' role='status'>
        <assistant-log v-for='(info) in infos' @remove='removeLog'
          :info='info' :key='`info-${info.id}`'></assistant-log>
      </div>
    </template>
  </b-card>

</template>

<script src='./assistant.js'></script>
