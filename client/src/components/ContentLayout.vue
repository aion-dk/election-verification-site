<script setup lang="ts">
import useConfigStore from "../stores/useConfigStore";

const configStore = useConfigStore();

defineProps({
  helpTitle: {
    type: String,
    required: true,
  },
  helpTitleStrong: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div class="ContentLayout">
    <section class="ContentLayout__Action">
      <slot name="action" />
    </section>
    <aside class="ContentLayout__Help">
      <h5 class="ContentLayout__Help_Title">
        {{ helpTitle }}<strong>{{ helpTitleStrong }}</strong>
      </h5>

      <div class="ContentLayout__Help_Container">
        <slot name="help" />
      </div>
      <img
        v-if="configStore.electionStatus?.theme?.logo"
        class="ContentLayout__Brand_Logo"
        :src="configStore.electionStatus?.theme?.logo"
        :alt="$t('header.election_logo_alt')"
      />
    </aside>
  </div>
</template>

<style scoped>
.ContentLayout {
  display: flex;
  width: 100vw;
  height: 100%;
}

.ContentLayout__Action {
  width: 70%;
  padding: 5rem;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: start;
}

.ContentLayout__Help {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 30%;
  background-color: var(--slate-100);
  padding: 0 6rem;
}

.ContentLayout__Help_Title {
  font-size: 2rem;
  font-weight: 500;
  margin: 0 0 2rem 0;
  text-align: center;
}

.ContentLayout__Help_Container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--av-theme-background);
  border-radius: 12px;
  padding: 5rem 4rem;
  gap: 2rem;
  text-align: center;
}

.ContentLayout__Brand_Logo {
  display: none;
}

@media only screen and (max-width: 1800px) {
  .ContentLayout__Action {
    width: 60%;
  }
  .ContentLayout__Help {
    width: 40%;
  }
}

@media only screen and (max-width: 1440px) {
  .ContentLayout__Help {
    padding: 0 4rem;
  }

  .ContentLayout__Help_Container {
    padding: 4rem 3rem;
    gap: 1rem;
  }
}

@media only screen and (max-width: 976px) {
  .ContentLayout {
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
    background-color: var(--slate-100);
    padding: 1rem;
  }

  .ContentLayout__Action {
    align-items: center;
    width: 100%;
    padding: 1rem;
  }

  .ContentLayout__Help {
    width: 100%;
    padding: 1rem;
  }

  .ContentLayout__Help_Container {
    margin-bottom: 3rem;
  }

  .ContentLayout__Brand_Logo {
    display: block;
    width: 30%;
    margin-bottom: 2rem;
  }
}

@media only screen and (max-width: 768px) {
  .ContentLayout__Help_Container {
    padding: 3rem 2rem;
  }

  .ContentLayout__Help_Title {
    font-size: 1.5rem;
  }
}

@media only screen and (max-height: 1080px) and (min-width: 976px) {
  .ContentLayout__Help_Container {
    padding: 3rem 2rem;
    gap: 1.5rem;
  }

  .ContentLayout__Help_Title {
    font-size: 1.75rem;
    margin: 0 0 2rem 0;
  }
}

@media only screen and (max-height: 720px) and (min-width: 976px) {
  .ContentLayout__Help_Container {
    padding: 3rem 2rem;
    gap: 1rem;
  }

  .ContentLayout__Help_Title {
    font-size: 1.5rem;
    margin: 0 0 1rem 0;
  }
}
</style>
