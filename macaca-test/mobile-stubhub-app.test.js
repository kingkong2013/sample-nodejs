'use strict';

require('should');
const opn = require('opn');
const path = require('path');
const KEY_MAP = require('webdriver-keycode');

var platform = process.env.platform || 'iOS';
var asserters = wd.asserters;
platform = platform.toLowerCase();

/**
 * download app form npm
 *
 * or use online resource: https://npmcdn.com/ios-app-bootstrap@latest/build/ios-app-bootstrap.zip
 *
 * npm i ios-app-bootstrap --save-dev
 *
 * var opts = {
 *   app: path.join(__dirname, '..', 'node_modules', 'ios-app-bootstrap', 'build', 'ios-app-bootstrap.zip');
 * };
 */

// see: https://macacajs.github.io/desired-caps

var iOSOpts = {
  deviceName: 'iPhone 6s',
  platformName: 'iOS',
  //autoAcceptAlerts: true,
  //reuse: 3,
  //udid: '',
  //bundleId: 'xudafeng.ios-app-bootstrap',
  app: 'http://172.27.51.41:8080/StubHub0424.app.zip'
};

var androidOpts = {
  platformName: 'Android',
  autoAcceptAlerts: false,
  isWaitActivity: true,
  //reuse: 3,
  //udid: '',
  //package: 'com.github.android_app_bootstrap',
  //activity: 'com.github.android_app_bootstrap.activity.WelcomeActivity',
  app: 'https://npmcdn.com/android-app-bootstrap@latest/android_app_bootstrap/build/outputs/apk/android_app_bootstrap-debug.apk'
};

const isIOS = platform === 'ios';
const infoBoardXPath = isIOS ? '//*[@name="info"]' : '//*[@resource-id="com.github.android_app_bootstrap:id/info"]';
const webviewButtonXPath = isIOS ? '//*[@name="Webview"]' : '//*[@resource-id="android:id/tabs"]/android.widget.LinearLayout[2]';

const wd = require('macaca-wd');

// override custom wd
require('./wd-extend')(wd, isIOS);
const asserters = require('./wd-asserters');

describe('macaca-test/mobile-stubhub-app.test.js', function() {
  this.timeout(10 * 60 * 1000);

  const driver = wd.promiseChainRemote({
    host: 'localhost',
    port: 3457
  });

  driver.configureHttp({
    timeout: 600 * 1000
  });

  before(function() {
    return driver
      .init(isIOS ? iOSOpts : androidOpts)
      .sleep(10 * 1000);
  });

  after(function() {

    return driver
      .sleep(1000)
      .quit()
      .sleep(1000)
      .then(() => {
        opn(path.join(__dirname, '..', 'reports', 'index.html'));
      });
  });

  afterEach(function() {
    return driver
      .customSaveScreenshot(this)
      .sleep(1000)
  });

  describe('login page test', function() {

    it('#0 should goto home page success', function() {
      return driver
        .getWindowSize()
        .then(size => {
          console.log(`current window size ${JSON.stringify(size)}`);
        })
        .gotoHomePage()
    });

    it('#1 should go into location page success', function() {
      return driver
        .waitForElementByName('LocationPickerButton')
        .click()
        .waitForElementByXPath("//*[@name='LocationPickerSearchField']")
        .click()
        .sendKeys('San Francisco')
        .waitForElementsByXPath('//XCUIElementTypeTable[1]/XCUIElementTypeCell')
        .then(function(els) {
          return els[0];
        })
        .sleep(2000)
        .click()
        .waitForElementByXPath('//*[@name="Done"]')
        .click()
    });
    
    it('#2 should go into date page success', function() {
      return driver
        .waitForElementByName('date button')
        .click()
        .waitForElementsByClassName('XCUIElementTypeCollectionView')
        .swipeTo(7)
        .elementByName('5')
        .click()
        .elementByXPath("//*[@name='Done']")
        .click()
    });

  });

});
