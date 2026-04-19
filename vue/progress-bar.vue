<template>

  <div class='progress'>
    <div v-for='(progress) in parts' :key='`progress-${progress.id}`'
    :class='progressClass' role='progressbar'
    :style='`width: ${ progress.show ? progress.value : 0 }%;background-color: ${progress.bgColor}`'
    :aria-valuenow='progress.value' aria-valuemin='0' aria-valuemax='100'></div>
  </div>

</template>

<script src='./progress-bar.js'></script>
