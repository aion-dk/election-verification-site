<script lang="ts" setup>
import BallotActivity from "./BallotActivity.vue";
import { ref } from "vue";

const isRtl = ref(document.getElementsByTagName("html")[0].dir === "rtl");

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
        <span class="BallotActivitiesList__Tooltip">
          <tooltip hover :placement="isRtl ? 'left' : 'right'">
            <template #default>
              {{ $t("components.ballot_activity_list.type") }}
              <AVIcon
                icon="circle-question"
                class="BallotActivitiesList__Tooltip_Icon"
                aria-hidden="true"
              />
            </template>

            <template #content>
              <span id="tracking-code-tooltip">
                {{ $t("components.ballot_activity_list.type_tooltip") }}
              </span>
            </template>
          </tooltip>
        </span>
      </li>
      <li class="BallotActivitiesList__ColumnDescriptions--time">
        <span class="BallotActivitiesList__Tooltip" style="cursor: default">
          {{ $t("components.ballot_activity_list.time") }}
        </span>
      </li>
      <li class="BallotActivitiesList__ColumnDescriptions--actor">
        <span class="BallotActivitiesList__Tooltip">
          <tooltip hover :placement="isRtl ? 'left' : 'right'">
            <template #default>
              {{ $t("components.ballot_activity_list.actor") }}
              <AVIcon
                icon="circle-question"
                class="BallotActivitiesList__Tooltip_Icon"
                aria-hidden="true"
              />
            </template>

            <template #content>
              <span id="tracking-code-tooltip">
                {{ $t("components.ballot_activity_list.actor_tooltip") }}
              </span>
            </template>
          </tooltip>
        </span>
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
  color: var(--slate-800);
  font-size: 1.25rem;
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

.BallotActivitiesList__Tooltip {
  cursor: help;
}

@media only screen and (min-width: 48rem) {
  .BallotActivitiesList__ColumnDescriptions {
    list-style: none;
    margin: 1rem 0;
    display: flex;
    font-size: 0.75rem;
    padding-inline-start: 0;
    color: var(--slate-600);
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
