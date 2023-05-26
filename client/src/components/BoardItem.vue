<script lang="ts" setup>
import { computed } from "vue";
import DateTime from "../components/DateTime.vue";
import ExpandableSection from "./ExpandableSection.vue";
import ItemIdentifier from "./ItemIdentifier.vue";

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
          class="BoardItem__ShortAddress"
          :aria-label="
            $t('components.board_item.aria_labels.activity_identifier')
          "
        >
          <AVIcon
            icon="fingerprint"
            class="BoardItem__InlineIcon"
            aria-hidden="true"
          />
          <ItemIdentifier :address="item.address" />
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

        <p class="BoardItem__ShortAddress BoardItem__ShortAddress_Expanded">
          <AVIcon
            icon="fingerprint"
            class="BoardItem__InlineIcon"
            aria-hidden="true"
          />
          <span>{{ $t("components.board_item.identifier") }}</span>
          <ItemIdentifier :address="item.address" />
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
  padding: 0;
  color: var(--slate-800);
}

.BoardItem__Date,
.BoardItem__ShortAddress {
  color: var(--slate-800);
  width: 100%;
  margin: 0 0 0.5rem 0;
}

.BoardItem__Author {
  color: var(--slate-800);
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
  color: var(--slate-700);
  font-family: "SFMono-Regular", "Menlo", "Monaco", "Consolas",
    "Liberation Mono", "Courier New", monospace;
  font-weight: 400;
}

.BoardItem__InlineIcon {
  margin-right: 0.5rem;
  color: var(--slate-600);
}

.BoardItem__Label {
  color: var(--slate-600);
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

  .BoardItem__ShortAddress {
    width: 30%;
    margin: 0;
  }

  .BoardItem__Author {
    display: none;
  }

  .BoardItem__Type_Expanded {
    margin-bottom: 1rem !important;
  }

  .BoardItem__Date_Expanded {
    margin-bottom: 0.5rem !important;
    width: 100%;
  }

  .BoardItem__ShortAddress_Expanded {
    margin-bottom: 0.5rem !important;
    width: 100%;
  }

  .BoardItem__Author_Expanded {
    margin-bottom: 0.5rem !important;
    width: 100%;
  }
}

@media only screen and (min-width: 80rem) and (min-height: 45rem) {
  .BoardItem__Type {
    width: calc(30% + 0.6rem);
  }

  .BoardItem__Date,
  .BoardItem__ShortAddress {
    width: calc(20% + 0.6rem);
  }

  .BoardItem__Author {
    width: 24%;
    display: flex;
  }
}
</style>
