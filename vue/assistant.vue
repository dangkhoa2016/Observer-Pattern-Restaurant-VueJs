<template>

  <b-card :class='card_class' :id='`assistant${_uid}`'
    header='Assistant' header-tag='h5' header-class='bg-warning'
    footer-class='p-0' v-b-tooltip.sync='tooltip_config'>

    <div class='small text-muted'>Pending queue: {{ orders.length }} order(s)</div>

    <template #footer>
      <div class='assistant-log-stream' aria-live='polite' aria-atomic='false' role='status'>
        <assistant-log v-for='(info) in infos' @remove='remove_log'
          :info='info' :key='`info-${info.id}`'></assistant-log>
      </div>
    </template>
  </b-card>

</template>

<script src='./assistant.js'></script>
