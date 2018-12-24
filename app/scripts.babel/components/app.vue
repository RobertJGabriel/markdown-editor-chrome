<template>
  <div class="page-container">
    <md-app md-waterfall md-mode="overlap">
      <md-app-toolbar class="md-primary md-large">
        <div class="md-toolbar-row">

          <span class="md-title">Markdown Editor</span>

          <div class="md-toolbar-section-end">
            <md-button class="md-icon-button">
              <md-icon>print</md-icon>
            </md-button>
            <md-button class="md-icon-button">
              <md-icon>save</md-icon>
            </md-button>
            <md-button class="md-icon-button">
              <md-icon>code</md-icon>
            </md-button>
            <md-button class="md-icon-button">
              <md-icon>book</md-icon>
            </md-button>
            <md-button class="md-icon-button">
              <md-icon>help</md-icon>
            </md-button>
          </div>
        </div>
      </md-app-toolbar>



      <md-app-content>
        <div class="md-layout">
          <div class="md-layout-item">
            <md-field>
              <md-textarea></md-textarea>
            </md-field>

          </div>
          <div class="md-layout-item preview" id="preview">e</div>
        </div>
      </md-app-content>
    </md-app>
  </div>
</template>

<style scoped>
  .md-app {}

  .preview {
    padding-left: 2rem;
    padding-right: 2rem;
  }

  .md-layout {
    height: -webkit-fill-available;
  }

  textarea {
    height: 100vh;
  }
</style>

<script>
  export default {
    name: 'Overlap',
    data: () => ({
      menuVisible: false
    })
  }
</script>