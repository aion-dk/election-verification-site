<script lang="ts" setup>
import DateTime from "./DateTime.vue";
import ExpandableSection from "./ExpandableSection.vue";

defineProps({
  activity: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="BallotActivity">
    <ExpandableSection>
      <template v-slot:collapsed>
        <div class="BallotActivity__Type" aria-label="Activity">
          {{ $t(`components.ballot_activity.${activity.type}.type`) }}
        </div>

        <div
          class="BallotActivity__RegisteredAt"
          aria-label="Activity registered"
        >
          <AVIcon icon="clock" class="BallotActivity__Icon" />
          <DateTime :date-time="activity.registered_at" />
        </div>

        <div class="BallotActivity__Author" aria-label="Activity author">
          <AVIcon icon="user" class="BallotActivity__Icon" />
          <span>
            {{ $t(`components.ballot_activity.${activity.type}.author`) }}
          </span>
        </div>
      </template>

      <template v-slot:expanded>
        <p class="BallotActivity__Type">
          {{ $t(`components.ballot_activity.${activity.type}.type`) }}
        </p>

        <p class="BallotActivity__RegisteredAt">
          <AVIcon icon="clock" class="BallotActivity__Icon" />
          <span class="BallotActivity__Label">{{
            $t("components.ballot_activity.registered_at")
          }}</span>
          <DateTime :date-time="activity.registered_at" format="long" />
        </p>
        <p class="BallotActivity__Author">
          <AVIcon icon="user" class="BallotActivity__Icon" />
          <span class="BallotActivity__Label">{{
            $t("components.ballot_activity.author")
          }}</span>
          {{ $t(`components.ballot_activity.${activity.type}.author`) }}
        </p>
        <p class="BallotActivity__Meaning">
          <AVIcon icon="circle-info" class="BallotActivity__Icon" />
          <span class="BallotActivity__Label">{{
            $t("components.ballot_activity.meaning")
          }}</span>
        </p>
        <p class="BallotActivity__Meaning">
          {{ $t(`components.ballot_activity.${activity.type}.details`) }}
        </p>
      </template>
    </ExpandableSection>
  </div>
</template>

<style type="text/css" scoped>
.BallotActivity__RegisteredAt {
  width: calc(30% + 0.6rem);
  color: var(--slate-800);
}

.BallotActivity__Type {
  width: calc(30% + 0.6rem);
  font-weight: 600;
  font-size: 1rem;
  margin: 0;
  padding: 0;
  color: var(--slate-800);
}

.BallotActivity__Author {
  width: 30%;
  color: var(--slate-800);
}

.BallotActivity__Meaning {
  color: var(--slate-800);
  margin: 0.5rem 0 0 0;
}

.BallotActivity__Icon {
  margin-right: 0.5rem;
  color: var(--slate-600);
}

.BallotActivity__Label {
  color: var(--slate-600);
  font-weight: 200;
}

@media only screen and (max-width: 768px) {
  .BallotActivity__RegisteredAt,
  .BallotActivity__Author {
    width: 100%;
    margin: 0 0 0.5rem 0;
  }

  .BallotActivity__Type {
    width: 100%;
    margin-bottom: 1rem;
  }
}
</style>
