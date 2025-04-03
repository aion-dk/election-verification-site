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
    <ul class="BallotActivitiesList__ColumnDescriptions" aria-hidden="true">
      <li class="BallotActivitiesList__ColumnDescriptions--event">
        <AVTooltip
          :content="$t('components.ballot_activity_list.type_tooltip')"
          :text="$t('components.ballot_activity_list.type')"
          icon="circle-question"
          position="right"
        />
      </li>
      <li class="BallotActivitiesList__ColumnDescriptions--time">
        {{ $t("components.ballot_activity_list.time") }}
      </li>
      <li class="BallotActivitiesList__ColumnDescriptions--actor">
        <AVTooltip
          :content="$t('components.ballot_activity_list.actor_tooltip')"
          :text="$t('components.ballot_activity_list.actor')"
          icon="circle-question"
          position="right"
        />
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
.BallotActivitiesList {
  width: 100%;
}

.BallotActivitiesList h4 {
  color: var(--bs-gray-800);
  margin: 0 0 1.5rem 0;
  text-align: center;
}

.BallotActivitiesList__ColumnDescriptions {
  display: none;
}
@media (max-width: 992px) {
  .BallotActivitiesList__ColumnDescriptions {
    display: none;
  }
}

@media only screen and (min-width: 48rem) {
  .BallotActivitiesList__ColumnDescriptions {
    list-style: none;
    margin: 1rem 0;
    display: flex;
    padding-inline-start: 0;
    color: var(--bs-gray-800);
  }

  .BallotActivitiesList__ColumnDescriptions--time,
  .BallotActivitiesList__ColumnDescriptions--event,
  .BallotActivitiesList__ColumnDescriptions--actor {
    width: 30%;
  }

  .BallotActivitiesList__ColumnDescriptions--event {
    margin-left: 1rem;
  }
}
</style>
