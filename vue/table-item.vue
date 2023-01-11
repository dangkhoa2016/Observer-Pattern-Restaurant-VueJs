<template>

  <b-card :class='card_class' :id='`tb-${table_id}`'
    v-b-tooltip.manual.title='tooltip_title'
    :style='`left: ${offset_left}px`' :title='slogan'
    title-tag='h6' :header="`Table: ${table_id}`">

    <div class='food-list'>
      <order-food v-for='(order) in orders' @eat-complete='eat_complete'
        :order='order' :key='`order-${order.id}`'></order-food>
    </div>

    <div class='action mt-2'>
      <b-button href='#' size='sm' variant='primary' @click.prevent='showModalFoods'
        class='btn-add-foods float-start'>Add foods</b-button>
      <div class='float-end'>
        <b-button href='#' v-b-tooltip.hover title='Remove this table'
          class='btn-remove' size='sm' variant='dark' @click.prevent='showConfirmRemove'>
          <span class='fas fa-trash-alt'></span>
        </b-button>
        <b-button href='#' v-if='!base_unsubscribe' v-b-tooltip.hover title='Subscribe news from Assistant'
          class='btn-subscribe' size='sm' variant='success' @click.prevent='subscribe'>
          <span class='fas fa-rss'></span>
        </b-button>
        <b-button href='#' v-else v-b-tooltip.hover title='Unsubscribe news from Assistant'
          class='btn-unsubscribe' size='sm' variant='danger' @click.prevent='unsubscribe'>
          <span class='fas fa-eye-slash'></span>
        </b-button>
      </div>
      <div class='clearfix'></div>
    </div>
  </b-card>
      
</template>

<script src='./table-item.js' />
