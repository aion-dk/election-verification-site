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
    <h4>{{ $t("components.ballot_activity_list.title") }}</h4>

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

    <BallotActivity
      :activity="activity"
      v-for="(activity, key) in activities"
      :key="key"
    />
  </div>
</template>

<style type="text/css" scoped>
.BallotActivitiesList h4 {
  color: var(--slate-800);
  font-size: 1.25rem;
  margin: 0;
}

.BallotActivitiesList__ColumnDescriptions {
  list-style: none;
  margin: 1rem 0;
  display: flex;
  font-size: 0.75rem;
  padding-inline-start: 0;
}

.BallotActivitiesList__ColumnDescriptions--time {
  width: 30%;
}

.BallotActivitiesList__ColumnDescriptions--event {
  width: 30%;
  margin-left: 1rem;
}

.BallotActivitiesList__ColumnDescriptions--actor {
  width: 30%;
}

@media only screen and (max-width: 976px) {
  .BallotActivitiesList h4 {
    margin-bottom: 1rem;
    text-align: center;
  }

  .BallotActivitiesList {
    width: 100%;
  }

  .BallotActivitiesList__ColumnDescriptions {
    display: none;
  }
}
</style>
