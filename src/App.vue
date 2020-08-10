<template>
  <div id="app">
    <b-navbar type="dark" variant="transparent">
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav align="end" class="w-100">
          <b-navbar-brand to="/">Real Estate</b-navbar-brand>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <div class="main">
      <router-view />
    </div>
  </div>
</template>

<style lang="scss">
// Bootstrap and its default variables
@import '../node_modules/bootstrap/scss/bootstrap';
// BootstrapVue and its default variables
@import '../node_modules/bootstrap-vue/src/index.scss';

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  height: 100vh;
  background-color: $dark;
}

#nav {
  padding: 30px;
}

.main {
  margin: 0.5rem;
}
</style>
