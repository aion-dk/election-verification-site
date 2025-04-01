<script lang="ts" setup>
import { computed } from "vue";
import DateTime from "../components/DateTime.vue";
import ExpandableSection from "./ExpandableSection.vue";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const classes = computed(() => {
  return {
    BoardItem: true,
    [`BoardItem--${props.item.type}`]: true,
  };
});
</script>

<template>
  <div :class="classes">
    <ExpandableSection large>
      <template v-slot:collapsed>
        <p
          class="BoardItem__Type"
          :aria-label="$t('components.board_item.aria_labels.activity_type')"
        >
          {{ $t(`components.board_item.${item.type}.type`) }}
        </p>

        <p
          class="BoardItem__Date"
          :aria-label="
            $t('components.board_item.aria_labels.activity_registered')
          "
        >
          <AVIcon
            icon="clock"
            class="BoardItem__InlineIcon"
            aria-hidden="true"
          />
          <DateTime :date-time="item.registeredAt" format="relative" />
        </p>

        <p
          class="BoardItem__Author"
          :aria-label="$t('components.board_item.aria_labels.activity_author')"
        >
          <AVIcon
            icon="user"
            class="BoardItem__InlineIcon"
            aria-hidden="true"
          />
          <span>
            {{ $t(`components.board_item.${item.type}.author`) }}
          </span>
        </p>
      </template>

      <template v-slot:expanded>
        <p class="BoardItem__Type BoardItem__Type_Expanded">
          {{ $t(`components.board_item.${item.type}.type`) }}
        </p>

        <p class="BoardItem__Date BoardItem__Date_Expanded">
          <AVIcon
            icon="clock"
            class="BoardItem__InlineIcon"
            aria-hidden="true"
          />
          <span class="BoardItem__Label">{{
            $t("components.board_item.registered_at")
          }}</span>
          <DateTime :date-time="item.registeredAt" format="absolute" />
        </p>

        <p class="BoardItem__Author BoardItem__Author_Expanded">
          <AVIcon
            icon="user"
            class="BoardItem__InlineIcon"
            aria-hidden="true"
          />
          <span class="BoardItem__Label">{{
            $t("components.board_item.author")
          }}</span>
          <span>{{ $t(`components.board_item.${item.type}.author`) }}</span>
        </p>

        <p class="BoardItem__Meaning_Expanded BoardItem__Label">
          {{ $t("components.board_item.meaning") }}
        </p>
        <p class="BoardItem__Meaning_Expanded">
          {{ $t(`components.board_item.${item.type}.info`) }}
        </p>

        <p
          v-if="item.type === 'ThresholdConfigItem'"
          class="BoardItem__Meaning_Expanded"
        >
          <strong>
            {{ $t(`components.board_item.${item.type}.encryption_key`) }}
          </strong>
          <code>{{ item.content.encryptionKey.slice(-7) }}</code>
        </p>
      </template>
    </ExpandableSection>
  </div>
</template>

<style type="text/css" scoped>
.BoardItem {
  width: 100%;
}

.BoardItem__Type {
  width: 100%;
  font-weight: 600;
  font-size: 1rem;
  margin: 0 0 1rem 0;
  color: var(--gray-800);
}

html[dir="ltr"] .BoardItem__Type {
  padding: 0 3rem 0 0;
}

html[dir="rtl"] .BoardItem__Type {
  padding: 0 0 0 3rem;
}

.BoardItem__Date {
  color: var(--gray-800);
  width: 100%;
  margin: 0 0 0.5rem 0;
}

.BoardItem__Author {
  color: var(--gray-800);
  width: 100%;
  margin: 0;
}

.BoardItem__Author_Expanded {
  margin-bottom: 0 0 0.5rem 0 !important;
}

.BoardItem__Meaning_Expanded {
  margin: 0 0 0.5rem 0;
}

.BoardItem__Meaning_Expanded:last-of-type {
  margin-bottom: 0;
}

.BoardItem__Meaning_Expanded code {
  font-size: 1rem;
  color: var(--gray-700);
  font-family:
    "SFMono-Regular", "Menlo", "Monaco", "Consolas", "Liberation Mono",
    "Courier New", monospace;
  font-weight: 400;
}

.BoardItem__InlineIcon {
  color: var(--gray-600);
}

html[dir="ltr"] .BoardItem__InlineIcon {
  margin-right: 0.5rem;
}

html[dir="rtl"] .BoardItem__InlineIcon {
  margin-left: 0.5rem;
}

.BoardItem__Label {
  color: var(--gray-600);
  font-weight: 200;
}

@media only screen and (min-width: 48rem) {
  .BoardItem__Type {
    width: calc(30% + 0.6rem);
    margin: 0;
  }

  .BoardItem__Date {
    width: calc(30% + 0.6rem);
    margin: 0;
  }

  .BoardItem__Author {
    width: 30%;
    margin: 0;
  }

  .BoardItem__Type_Expanded {
    margin-bottom: 1rem !important;
  }

  .BoardItem__Date_Expanded {
    margin-bottom: 0.5rem !important;
    width: 100%;
  }

  .BoardItem__Author_Expanded {
    margin-bottom: 0.5rem !important;
    width: 100%;
  }
}
</style>
