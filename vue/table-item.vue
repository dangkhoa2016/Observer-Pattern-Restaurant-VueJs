<template>

  <b-card :class='cardClass' :id='`tb-${tableId}`'
    v-b-tooltip.manual.title='tooltipTitle'
    :style='`left: ${offsetLeft}px`' :title='slogan'
    title-tag='h6' :header="`Table: ${tableId}`">

    <div class='food-list'>
      <order-food v-for='(order) in orders' @eat-complete='handleEatComplete'
        :order='order' :key='`order-${order.id}`'></order-food>
    </div>

    <div class='action mt-2'>
      <b-button type='button' size='sm' variant='primary' @click='showMenuForTable'
        class='btn-add-foods float-start'>{{ $appLabels.ADD_DISHES }}</b-button>
      <div class='float-end'>
        <b-button type='button' v-b-tooltip.hover :title='$appLabels.REMOVE_TABLE_TOOLTIP'
          class='btn-remove' size='sm' variant='dark' @click='confirmRemoveTable'>
          <span class='fas fa-trash-alt'></span>
        </b-button>
        <b-button type='button' v-if='!assistantUnsubscribe' v-b-tooltip.hover :title='$appLabels.SUBSCRIBE_TOOLTIP'
          class='btn-subscribe' size='sm' variant='success' @click='subscribeToAssistant'>
          <span class='fas fa-rss'></span>
        </b-button>
        <b-button type='button' v-else v-b-tooltip.hover :title='$appLabels.UNSUBSCRIBE_TOOLTIP'
          class='btn-unsubscribe' size='sm' variant='danger' @click='unsubscribeFromAssistant'>
          <span class='fas fa-eye-slash'></span>
        </b-button>
      </div>
      <div class='clearfix'></div>
    </div>
  </b-card>
      
</template>

<script src='./table-item.js' />
