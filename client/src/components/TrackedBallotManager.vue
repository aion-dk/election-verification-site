<script setup lang="ts">
defineProps({
  trackingCode: {
    type: String,
    required: true,
  },
  periodicedTrackingCode: {
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
      <code
        class="BallotManager__Tracking_Code"
        :aria-label="periodicedTrackingCode"
        >{{ trackingCode }}</code
      >
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
        <AVIcon icon="xmark" class="BallotManager__Tracking_Icon" />
      </button>
    </div>
    <div class="BallotManager__Tracking_Line"></div>
    <span class="BallotManager__Tracking_Text">{{
      $t("components.tracked_ballot_manager.currently_tracking")
    }}</span>
  </div>
</template>

<style scoped>
.BallotManager {
  position: absolute;
  right: 5rem;
  top: 5rem;
  width: 14rem;
}

.BallotManager__Tracking_Container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.BallotManager__Tracking_Code {
  color: var(--slate-900);
  font-size: 2rem;
}

.BallotManager__Cancel {
  border: none;
  background-color: transparent;
  cursor: pointer;
}

.BallotManager__Tracking_Icon {
  color: var(--slate-800);
  width: 1.25rem;
  height: 1.25rem;
}

.BallotManager__Tracking_Line {
  border-bottom: 2px solid var(--slate-700);
  width: 100%;
  margin: 0.25rem 0;
}
.BallotManager__Tracking_Text {
  color: var(--slate-700);
  margin: 0;
}

@media only screen and (max-width: 976px) {
  .BallotManager {
    position: static;
    margin-bottom: 2rem;
    align-self: flex-end;
  }
}

@media only screen and (max-width: 480px) {
  .BallotManager {
    width: 8rem;
  }

  .BallotManager__Tracking_Code {
    font-size: 1.25rem;
  }

  .BallotManager__Tracking_Icon {
    width: 0.75rem;
    height: 0.75rem;
  }

  .BallotManager__Tracking_Text {
    font-size: 0.6rem;
  }
}
</style>
