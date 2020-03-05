//= require_tree ./functions

"use strict";

window.addEventListener(
  "load",
  () => {
    registerIntersectionObservers();
    registerSearchEvents();
    injectSemanticMarkup();
  },
  false
);
