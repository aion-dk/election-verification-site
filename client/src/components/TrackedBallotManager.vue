<script setup lang="ts">
defineProps({
  trackingCode: {
    type: String,
    required: true,
  },
});

const emits = defineEmits(["cancel"]);

const cancel = () => {
  emits("cancel");
};
</script>

<template>
  <div class="BallotManager">
    <div class="BallotManager__Tracking_Container">
      <code class="BallotManager__Tracking_Code">{{ trackingCode }}</code>
      <button
        class="BallotManager__Cancel"
        @click="cancel"
        data-testid="cancel"
        :aria-label="
          $t('components.tracked_ballot_manager.cancel_cross_label', {
            trackingCode: trackingCode,
          })
        "
      >
        <AVIcon
          icon="xmark"
          class="BallotManager__Tracking_Icon"
          aria-hidden="true"
        />
      </button>
    </div>
    <div class="BallotManager__Tracking_Line" aria-hidden="true"></div>
    <span class="BallotManager__Tracking_Text" aria-hidden="true">{{
      $t("components.tracked_ballot_manager.currently_tracking")
    }}</span>
  </div>
</template>

<style scoped>
.BallotManager {
  display: block;
  align-self: flex-end;
  margin-bottom: 1rem;
  background-color: white;
  box-sizing: border-box;
  border-radius: 12px;
}

.BallotManager__Tracking_Container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.BallotManager__Tracking_Code {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.25rem;
}

.BallotManager__Tracking_Icon {
  color: var(--slate-800);
  width: 0.75rem;
  height: 0.75rem;
}

.BallotManager__Tracking_Text {
  font-size: 0.6rem;
  color: var(--slate-700);
  margin: 0;
}

.BallotManager__Cancel {
  border: none;
  background-color: transparent;
  cursor: pointer;
}

.BallotManager__Tracking_Line {
  border-bottom: 2px solid var(--slate-700);
  border-radius: 99px;
  width: 100%;
  margin: 0.25rem 0 0 0;
}

@media only screen and (min-width: 48rem) {
  .BallotManager {
    margin-bottom: 2rem;
  }

  .BallotManager__Tracking_Code {
    font-size: 2rem;
  }

  .BallotManager__Tracking_Icon {
    width: 1.25rem;
    height: 1.25rem;
  }

  .BallotManager__Tracking_Text {
    font-size: 1rem;
  }
}

@media only screen and (min-width: 80rem) {
  .BallotManager {
    margin-bottom: 0;
  }
}

@media only screen and (min-width: 90rem) {
  .BallotManager {
    margin-bottom: -3rem;
  }
}
</style>
