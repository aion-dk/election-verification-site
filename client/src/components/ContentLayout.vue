<script setup lang="ts">
defineProps({
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
  <div class="ContentLayout">
    <section class="ContentLayout__Action">
      <p v-if="breadcrumb" class="ContentLayout__Breadcrumb">
        {{ breadcrumb }}
      </p>
      <div class="ContentLayout__Mobile_Wrapper">
        <slot name="action" />
      </div>
    </section>
    <aside class="ContentLayout__Help">
      <h5 class="ContentLayout__Help_Title">
        {{ helpTitle }}<strong>{{ helpTitleStrong }}</strong>
      </h5>

      <div class="ContentLayout__Help_Container">
        <slot name="help" />
      </div>
      <img
        v-if="logo"
        class="ContentLayout__Brand_Logo"
        :src="logo"
        :alt="$t('header.election_logo_alt')"
        loading="lazy"
      />
    </aside>
  </div>
</template>

<style scoped>
.ContentLayout {
  display: flex;
  height: calc(100dvh - 70px);
  top: 70px;
  position: fixed;
  width: 100%;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  background-color: var(--gray-100);
  padding: 1rem 1rem 3rem 1rem;
}

.ContentLayout__Action {
  align-items: center;
  width: 100%;
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  align-items: start;
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
  background-color: var(--gray-100);
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
    overflow: hidden;
  }

  .ContentLayout__Action {
    background-color: white;
    width: calc(100% - 32rem);
    height: 100%;
    padding: 0;
    overflow-y: auto;
  }

  .ContentLayout__Help {
    width: 32rem;
    height: 100%;
    padding: 5rem 3rem;
    justify-content: flex-start;
    overflow-y: auto;
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
