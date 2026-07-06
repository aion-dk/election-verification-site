<script setup lang="ts">
import PageTitle from "@/components/PageTitle.vue";

defineProps({
  id: {
    type: String,
    required: false,
    default: "",
  },
  helpTitle: {
    type: String,
    required: true,
  },
  helpTitleStrong: {
    type: String,
    required: true,
  },
  breadcrumb: {
    type: String,
    default: null,
  },
  logo: {
    type: String,
    default: null,
  },
});
</script>

<template>
  <div class="ContentLayout__Page">
    <PageTitle />
    <div :id="id || undefined" class="ContentLayout">
      <section id="main_content" class="ContentLayout__Action" tabindex="-1">
      <p
        v-if="breadcrumb"
        class="ContentLayout__Breadcrumb"
        id="content-layout-breadcrumb"
      >
        {{ breadcrumb }}
      </p>
      <div
        class="ContentLayout__Mobile_Wrapper"
        id="content-layout-mobile-wrapper"
      >
        <slot name="action" />
      </div>
    </section>
    <!-- tabindex is required for keyboard-scrollable content in Safari (WCAG 2.1.1) -->
    <!-- sonarqube-disable-next-line sonar/no-tabindex-on-non-interactive-elements -->
    <aside
      id="help-content-aside"
      class="ContentLayout__Help"
      :aria-label="$t('accessibility.help')"
      tabindex="0"
    >
      <h2 class="ContentLayout__Help_Title" id="content-layout-help-title">
        {{ helpTitle
        }}<strong id="content-layout-help-title-strong">{{
          helpTitleStrong
        }}</strong>
      </h2>

      <div
        class="ContentLayout__Help_Container"
        id="content-layout-help-container"
      >
        <slot name="help" />
      </div>
      <img
        v-if="logo"
        class="ContentLayout__Brand_Logo"
        :src="logo"
        :alt="$t('header.election_logo_alt')"
        loading="lazy"
        id="content-layout-brand-logo"
      />
    </aside>
    </div>
  </div>
</template>

<style scoped>
.ContentLayout__Page {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.ContentLayout {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  background-color: var(--bs-gray-100);
  padding: 1rem 1rem 3rem 1rem;
}

.ContentLayout__Action {
  width: 100%;
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
}

.ContentLayout__Breadcrumb {
  margin: 0 0 1rem 0;
  width: 100%;
}

.ContentLayout__Mobile_Wrapper {
  background-color: white;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  position: relative;
}

.ContentLayout__Help {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--bs-gray-100);
}

.ContentLayout__Help_Container {
  margin-bottom: 3rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--av-theme-background);
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
}

.ContentLayout__Brand_Logo {
  display: block;
  width: 40%;
  height: auto;
  margin-bottom: 3rem;
}

.ContentLayout__Help_Title {
  font-weight: 500;
  margin: 0 0 2rem 0;
  text-align: center;
  font-size: 1.3rem;
}

@media only screen and (min-width: 48rem) {
  .ContentLayout__Action,
  .ContentLayout__Help {
    padding: 2rem 2rem 0 2rem;
  }

  .ContentLayout__Mobile_Wrapper,
  .ContentLayout__Help_Container {
    padding: 4rem;
  }

  .ContentLayout__Help_Title {
    font-size: 1.8rem;
  }

  .ContentLayout__Breadcrumb {
    margin: -0.5rem 0 1rem 0;
  }

  .ContentLayout__Brand_Logo {
    display: none;
  }
}

@media only screen and (min-width: 60rem) {
  .ContentLayout__Help_Title {
    font-size: 2rem;
  }

  .ContentLayout__Brand_Logo {
    width: 20%;
  }
}

@media only screen and (min-width: 80rem) {
  .ContentLayout {
    flex-direction: row;
    padding: 0;
    align-items: stretch;
    min-height: calc(100dvh - 5rem);
  }

  .ContentLayout__Action {
    background-color: white;
    width: calc(100% - 32rem);
    padding: 0;
  }

  .ContentLayout__Help {
    width: 32rem;
    padding: 5rem 3rem;
    justify-content: flex-start;
  }

  .ContentLayout__Help_Container {
    padding: 3rem 2rem;
    gap: 1.5rem;
  }

  .ContentLayout__Mobile_Wrapper {
    background-color: white;
    border-radius: 0;
    padding: 0 5rem 5rem 5rem;
    align-items: start;
    height: fit-content;
  }

  .ContentLayout__Breadcrumb {
    background-color: white;
    padding: 5rem 5rem 1rem 5rem;
    margin: 0;
  }
}

@media only screen and (min-width: 120rem) {
  .ContentLayout__Action {
    width: calc(100% - 42rem);
  }

  .ContentLayout__Help {
    width: 42rem;
  }

  .ContentLayout__Help_Container {
    padding: 4rem 3rem;
  }
}
</style>
