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
        <p
          class="BallotActivity__Type"
          :aria-label="$t('components.board_item.aria_labels.activity_type')"
        >
          {{ $t(`components.ballot_activity.${activity.type}.type`) }}
        </p>

        <p
          class="BallotActivity__RegisteredAt"
          :aria-label="
            $t('components.board_item.aria_labels.activity_registered')
          "
        >
          <AVIcon
            icon="clock"
            class="BallotActivity__Icon"
            aria-hidden="true"
          />
          <DateTime :date-time="activity.registered_at" />
        </p>

        <p
          class="BallotActivity__Author"
          :aria-label="$t('components.board_item.aria_labels.activity_author')"
        >
          <AVIcon icon="user" class="BallotActivity__Icon" aria-hidden="true" />
          <span>
            {{ $t(`components.ballot_activity.${activity.type}.author`) }}
          </span>
        </p>
      </template>

      <template v-slot:expanded>
        <p class="BallotActivity__Type BallotActivity__Type_Expanded">
          {{ $t(`components.ballot_activity.${activity.type}.type`) }}
        </p>

        <p
          class="BallotActivity__RegisteredAt BallotActivity__RegisteredAt_Expanded"
        >
          <AVIcon
            icon="clock"
            class="BallotActivity__Icon"
            aria-hidden="true"
          />
          <span class="BallotActivity__Label">{{
            $t("components.ballot_activity.registered_at")
          }}</span>
          <DateTime :date-time="activity.registered_at" format="long" />
        </p>

        <p class="BallotActivity__Author BallotActivity__Author_Expanded">
          <AVIcon icon="user" class="BallotActivity__Icon" aria-hidden="true" />
          <span class="BallotActivity__Label">{{
            $t("components.ballot_activity.author")
          }}</span>
          {{ $t(`components.ballot_activity.${activity.type}.author`) }}
        </p>

        <p class="BallotActivity__Meaning">
          <AVIcon
            icon="circle-info"
            class="BallotActivity__Icon"
            aria-hidden="true"
          />
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
  color: var(--gray-800);
  width: 100%;
  margin: 0 0 0.5rem 0;
}

.BallotActivity__Type {
  width: 100%;
  font-weight: 600;
  font-size: 1rem;
  margin: 0 0 1rem 0;
  padding: 0;
  color: var(--gray-800);
}

.BallotActivity__Author {
  color: var(--gray-800);
  width: 100%;
  margin: 0 0 0 0;
}

.BallotActivity__Meaning {
  color: var(--gray-800);
  margin: 0.5rem 0 0 0;
}

.BallotActivity__Icon {
  color: var(--gray-600);
}

html[dir="ltr"] .BallotActivity__Icon {
  margin-right: 0.5rem;
}

html[dir="rtl"] .BallotActivity__Icon {
  margin-left: 0.5rem;
}

.BallotActivity__Label {
  color: var(--gray-600);
  font-weight: 200;
}

@media only screen and (min-width: 48rem) {
  .BallotActivity__Type {
    width: calc(30% + 0.6rem);
    margin: 0;
  }

  .BallotActivity__RegisteredAt {
    width: calc(30% + 0.6rem);
    margin: 0;
  }

  .BallotActivity__Author {
    width: 30%;
    margin: 0;
  }

  .BallotActivity__Type_Expanded {
    margin-bottom: 1rem !important;
  }

  .BallotActivity__RegisteredAt_Expanded {
    margin-bottom: 0.5rem !important;
    width: 100%;
  }

  .BallotActivity__Author_Expanded {
    margin-bottom: 0.5rem !important;
    width: 100%;
  }
}
</style>
