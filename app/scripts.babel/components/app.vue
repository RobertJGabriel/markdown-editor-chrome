<template>
  <div class="page-container">
    <md-app md-waterfall md-mode="flexible">
      <md-app-toolbar class="md-large md-primary">
        <div class="md-toolbar-row">

          <div class="md-toolbar-section-end">
            <md-button class="md-icon-button">
              <md-icon>more_vert</md-icon>
            </md-button>
            <md-button class="md-icon-button">
              <md-icon>more_vert</md-icon>
            </md-button>
            <md-button class="md-icon-button">
              <md-icon>more_vert</md-icon>
            </md-button>
            <md-button class="md-icon-button">
              <md-icon>more_vert</md-icon>
            </md-button>
          </div>
        </div>

        <div class="md-toolbar-row">
          <span class="md-display-1">Markdown Editor</span>
        </div>
      </md-app-toolbar>



      <md-app-content>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error quibusdam, non molestias et! Earum magnam,
          similique, quo recusandae placeat dicta asperiores modi sint ea repudiandae maxime? Quae non explicabo,
          neque.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error quibusdam, non molestias et! Earum magnam,
          similique, quo recusandae placeat dicta asperiores modi sint ea repudiandae maxime? Quae non explicabo,
          neque.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error quibusdam, non molestias et! Earum magnam,
          similique, quo recusandae placeat dicta asperiores modi sint ea repudiandae maxime? Quae non explicabo,
          neque.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error quibusdam, non molestias et! Earum magnam,
          similique, quo recusandae placeat dicta asperiores modi sint ea repudiandae maxime? Quae non explicabo,
          neque.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error quibusdam, non molestias et! Earum magnam,
          similique, quo recusandae placeat dicta asperiores modi sint ea repudiandae maxime? Quae non explicabo,
          neque.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error quibusdam, non molestias et! Earum magnam,
          similique, quo recusandae placeat dicta asperiores modi sint ea repudiandae maxime? Quae non explicabo,
          neque.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error quibusdam, non molestias et! Earum magnam,
          similique, quo recusandae placeat dicta asperiores modi sint ea repudiandae maxime? Quae non explicabo,
          neque.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error quibusdam, non molestias et! Earum magnam,
          similique, quo recusandae placeat dicta asperiores modi sint ea repudiandae maxime? Quae non explicabo,
          neque.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error quibusdam, non molestias et! Earum magnam,
          similique, quo recusandae placeat dicta asperiores modi sint ea repudiandae maxime? Quae non explicabo,
          neque.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error quibusdam, non molestias et! Earum magnam,
          similique, quo recusandae placeat dicta asperiores modi sint ea repudiandae maxime? Quae non explicabo,
          neque.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error quibusdam, non molestias et! Earum magnam,
          similique, quo recusandae placeat dicta asperiores modi sint ea repudiandae maxime? Quae non explicabo,
          neque.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error quibusdam, non molestias et! Earum magnam,
          similique, quo recusandae placeat dicta asperiores modi sint ea repudiandae maxime? Quae non explicabo,
          neque.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error quibusdam, non molestias et! Earum magnam,
          similique, quo recusandae placeat dicta asperiores modi sint ea repudiandae maxime? Quae non explicabo,
          neque.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error quibusdam, non molestias et! Earum magnam,
          similique, quo recusandae placeat dicta asperiores modi sint ea repudiandae maxime? Quae non explicabo,
          neque.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error quibusdam, non molestias et! Earum magnam,
          similique, quo recusandae placeat dicta asperiores modi sint ea repudiandae maxime? Quae non explicabo,
          neque.</p>
      </md-app-content>
    </md-app>
  </div>
</template>

<style scoped>
  .md-app {
    max-height: 400px;
    border: 1px solid rgba(#000, .12);
  }

  .md-app-toolbar {
    height: 196px;
  }

  // Demo purposes only
  .md-drawer {
    width: 230px;
    max-width: calc(100vw - 125px);
  }
</style>

<script>
  export default {
    name: 'Flexible',
    data: () => ({
      menuVisible: false
    })
  }
</script>