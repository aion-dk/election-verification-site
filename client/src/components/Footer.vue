<template>
  <section class="Footer">
    <a href="https://assemblyvoting.com" target="_blank">
      <span class="Footer__Text">Technology by</span>
      <img
        class="Footer__Image"
        src="/av-logo-horizontal.png"
        alt="Assembly Voting Logo"
      />
    </a>
  </section>
</template>

<style type="text/css" scoped>
.Footer {
  background-color: #fff;
  font-family: "Open Sans";
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 20px;
  padding: 10px;
  font-weight: 400;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.15);
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}

.Footer a {
  text-decoration: none;
  color: initial;
  display: flex;
  align-items: center;
}

.Footer__Text {
  font-size: 12px;
}

.Footer__Image {
  max-height: 20px;
  margin-left: 4px;
  width: 125px;
  height: 20px;
}
</style>
