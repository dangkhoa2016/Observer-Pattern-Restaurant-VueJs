<template>

  <b-card :class='card_class' :id='`assistant${_uid}`'
    header='Assistant' header-tag='h5' header-class='bg-warning'
    footer-class='p-0' v-b-tooltip.sync='tooltip_config'>

    This is sample log

    <template #footer>
      <assistant-log v-for='(info) in infos' @remove='remove_log'
        :info='info' :key='`info-${info.id}`'></assistant-log>
    </template>
  </b-card>

</template>

<script src='./assistant.js'></script>
