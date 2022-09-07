# OrbisChatSupport

> Decentralized social modules created with the Orbis SDK

## Install

```bash
npm install --save vue-orbis-chat-support
```

## Global Usage

On your `main.js` file
```js
import { createApp } from "vue";
import App from "./App.vue";
import VueOrbisChatSupport from "vue-orbis-chat-support";
import "vue-orbis-chat-support/styles.css";

const app = createApp(App);

app.use(VueOrbisChatSupport);

app.mount("#app");
```
On your component file
```js
<template>
  <div>
    <OrbisChatSupport
      context="kjzl6cwe1jw147b42j1yjoxyzrzeg3czq5mjm1lrmg5eeq43yutje3f2s0s2n5h"
      poweredByOrbis="black"
    />
  </div>
</template>
```

## Local Usage

```js
<script setup>
import { OrbisChatSupport } from "vue-orbis-chat-support";
import "vue-orbis-chat-support/styles.css";
</script>

<template>
  <div>
    <OrbisChatSupport
      context="kjzl6cwe1jw147b42j1yjoxyzrzeg3czq5mjm1lrmg5eeq43yutje3f2s0s2n5h"
      poweredByOrbis="black"
    />
  </div>
</template>
```
