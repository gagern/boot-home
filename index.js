"use strict";

var cfg = require("./config.json");

var webdriver = require("selenium-webdriver");
var until = webdriver.until;
var driver = new webdriver.Builder()
    .forBrowser("firefox")
    .build();

driver.get(cfg.url);
var tdMachine = "td[title='" + cfg.machine + "']";
driver.switchTo().frame(0);
driver.findElement({id: "uiViewUser"}).sendKeys(cfg.user);
driver.findElement({id: "uiPass"}).sendKeys(cfg.pass);
driver.findElement({id: "uiSubmitLogin"}).click();
driver.findElement({linkText: "Heimnetz"}).click();
driver.findElement({css: tdMachine + " ~ td button"}).click();
driver.findElement({id: "uiBtnWake"}).click();
driver.findElement({css: tdMachine});
driver.findElement({id: "sso_dropdown"}).click();
driver.findElement({linkText: "Abmelden"}).click();
driver.findElement({id: "uiViewUser"});
driver.close();
