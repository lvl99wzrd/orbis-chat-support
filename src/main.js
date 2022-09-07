import { createApp } from "vue";
import App from "./App.vue";
import OrbisChatSupport from "./OrbisChatSupport";

const app = createApp(App);

app.use(OrbisChatSupport);

app.mount("#app");
