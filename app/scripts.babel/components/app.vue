<template>
  <div class="viewport" id="app">
    <md-toolbar :md-elevation="1" class="md-accent">
      <span class="md-title">Accessibility</span>
    </md-toolbar>

    <md-list>
      <md-subheader class="md-primary">Settings</md-subheader>
      <md-list-item>
        <md-icon>power_settings_new</md-icon>
        <div class="md-list-item">
          <md-switch v-model="enable"></md-switch>
        </div>
      </md-list-item>

      <md-divider class="md-inset"></md-divider>

      <md-subheader class="md-primary">Help</md-subheader>
      <md-list-item>
        <md-icon>help</md-icon>
        <div class="md-list-item">
          <div class="md-list-item-text">
            <span><a href="" target="_blank">View Docs</a></span>
          </div>
        </div>
      </md-list-item>

      <md-divider class="md-inset"></md-divider>
      <md-subheader class="md-primary">Payment</md-subheader>

      <md-list-item>

        <md-icon>monetization_on</md-icon>
        <div class="md-list-item-text">
          <span>{{license}}</span>
        </div>
      </md-list-item>


    </md-list>
  </div>

</template>

<script>
  import Vue from 'vue';

  module.exports = {
    data: function () {
      return {
        paid: true,
        enable: null,
        license: null
      }
    },
    mounted: function () {
      chrome.storage.local.get(['license'], this.updateLicense.bind(this));
      // Check if local storage is enabled
      chrome.storage.local.get('enabled', items => {
        this.enable = items.enabled ? true : false;
      });
      return this.enable;
    },
    watch: {
      // whenever question changes, this function will run
      enable: function (newSetting, oldSetting) {
        // Dont change the settings if its the same or no past 
        if (newSetting === oldSetting || oldSetting === null) return false;
        this.save(newSetting);
      }
    },
    methods: {
      save: function (type) {
        this.enable = Boolean(type);
        chrome.storage.local.set({'enabled': Boolean(type)});

        chrome.storage.local.get('enabled', items => {
          this.enable = items.enabled;
          this.reload();
        });
        
        return this.enable;
      },
      updateLicense: function (license) {
        this.paid = ((license.license == 'FULL') || (license.license == 'TRIAL')) ? true : false;
        this.license = license.license? 'Paid':'Trial over';
        return this.paid;
      },
      reload: function () {
          
        chrome.tabs.query({
          active: true,
          lastFocusedWindow: true
        }, function (tabs) {
          // and use that tab to fill in out title and url
          const currentTab = tabs[0];
          const codeScript = 'window.location.reload();';
          
          return true;
        });
         
      }
    }
  }
</script>

<style scoped>
  .viewport,
  body {
    width: 225px;
    max-width: 100%;
    display: inline-block;
    vertical-align: top;
    overflow: auto;
    border: 1px solid rgba(#000, .12);
  }
</style>