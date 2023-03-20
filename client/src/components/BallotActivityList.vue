<script lang="ts" setup>
import BallotActivity from "./BallotActivity.vue";

defineProps({
  activities: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <div class="BallotActivitiesList" role="log">
    <h3>{{ $t("components.ballot_activity_list.title") }}</h3>

    <ul class="BallotActivitiesList__ColumnDescriptions" aria-hidden="true">
      <li class="BallotActivitiesList__ColumnDescriptions--event">
        {{ $t("components.ballot_activity_list.type") }}
      </li>
      <li class="BallotActivitiesList__ColumnDescriptions--time">
        {{ $t("components.ballot_activity_list.time") }}
      </li>
      <li class="BallotActivitiesList__ColumnDescriptions--actor">
        {{ $t("components.ballot_activity_list.actor") }}
      </li>
    </ul>

    <BallotActivity :activity="activity" v-for="(activity, key) in activities" :key="key" />
  </div>
</template>

<style type="text/css" scoped>
.BallotActivitiesList h3 {
  padding: 20px 16px;
  margin: 0;
}

.BallotActivitiesList__ColumnDescriptions {
  list-style: none;
  padding: 16px;
  margin: 0;
  display: flex;
  font-size: 14px;
}

.BallotActivitiesList__ColumnDescriptions--time {
  width: 150px;
}

.BallotActivitiesList__ColumnDescriptions--event {
  width: 205px;
}
</style>
