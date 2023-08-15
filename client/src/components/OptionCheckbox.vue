<template>
  <svg viewBox="0 0 30 30" height="30"
       stroke="white" stroke-width="0.25rem">
    <rect width="30" height="30" stroke="#717e8c" stroke-width="4" fill="#8d98a3"/>
    <template v-if="rank">
      <text x="50%" y="50%"
            fill="white"
            font-size="24"
            stroke-width="2"
            text-anchor="middle"
            dominant-baseline="central"
            v-text="rank"/>
    </template>
    <template v-else>
      <line x1="25%" y1="25%" x2="75%" y2="75%"></line>
      <line x1="75%" y1="25%" x2="25%" y2="75%"></line>
    </template>
  </svg>
</template>
<script>
export default {
  name: 'OptionCheckbox',
  props: {
    rank: {
      type: Number,
      default: 0,
    },
  }
}
</script>