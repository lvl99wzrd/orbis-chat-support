<script setup>
import { ref, computed, watch, markRaw, onMounted } from "vue";
import { Orbis } from "@orbisclub/orbis-sdk";
import Message from "./Message.vue";
import MessageBox from "./MessageBox.vue";
import ConnectButton from "./ConnectButton.vue";

import OrbisLogoBlack from "../assets/img/powered-by-orbis-black.png";
import OrbisLogoWhite from "../assets/img/powered-by-orbis-white.png";
import CloseIcon from "../assets/img/icons/question-close.png";
import MessageIcon from "../assets/img/icons/question-message.png";
import SpinnerBlackIcon from "../assets/img/icons/question-spinner-black.png";

const props = defineProps({
  orbis: { type: [Object, Boolean], required: false, default: false },
  display: { type: String, required: false, default: "chat" },
  notes: { type: String, required: false, default: null },
  context: { type: String, required: true },
  themes: { type: Object, required: false, default: {} },
  poweredByOrbis: { type: String, required: false, default: "black" },
});

const _orbis = ref();
const user = ref();
const expanded = ref(false);
const loading = ref(false);
const messages = ref([]);
const replyTo = ref();
const replyToText = ref();

/** Show powered by Orbis logo */
const orbisLogo = computed(() => {
  switch (props.poweredByOrbis) {
    /** Show black logo */
    case "black":
      return OrbisLogoBlack;

    /** Show white logo */
    case "white":
      return OrbisLogoWhite;

    /** Hide logo */
    case null:
      return null;

    /** By default show the black version of the logo */
    default:
      return OrbisLogoBlack;
  }
});

/** Used to reply to a specific post */
const reply = (message) => {
  if (message) {
    replyTo.value = message.stream_id;
    replyToText.value = message.content.body;
  } else {
    replyTo.value = null;
    replyToText.value = null;
  }
};

/** Check if user is connected */
const getIsConnected = async () => {
  let res = await _orbis.value.isConnected();

  /** If SDK returns user details we save it in state */
  if (res && res.status == 200) {
    user.value = res.details;
  }
};

/** Load messages */
const getChannelMessages = async () => {
  if (loading.value) return;

  loading.value = true;
  let { data, error } = await _orbis.value.getPosts({ context: props.context });
  let _messages = data;

  if (props.display === "chat") {
    _messages.reverse();
  }

  loading.value = false;
  messages.value = _messages;
};

/** On send new message */
const onNewMessage = (newMessage) => {
  if (props.display === "chat") {
    messages.value = [...messages.value, newMessage];
  } else {
    messages.value = [newMessage, ...messages.value];
  }
  reply(null);
};

/** On user connected */
const onConnected = (details) => {
  user.value = details;
};

/** Watch expanded ref */
watch(expanded, (expanded) => {
  if (expanded) {
    getIsConnected();
    getChannelMessages();
  }
});

onMounted(() => {
  _orbis.value = !props.orbis ? markRaw(new Orbis()) : props.orbis;
});
</script>

<template>
  <div class="chatBoxContainer">
    <!-- CTA to open the contact module -->
    <div class="chatBoxContainerCta" @click="expanded = !expanded">
      <img v-if="expanded" :src="CloseIcon" height="27" />
      <img v-else :src="MessageIcon" height="27" />
    </div>

    <!-- Expanded view of the contact module -->
    <div v-if="expanded" class="chatBoxContainerExpanded">
      <div class="chatBoxHead">
        <p v-if="notes" v-html="notes" style="margin-bottom: 5px" />
        <p v-if="orbisLogo">
          <a href="https://orbis.club" target="_blank" rel="noreferrer">
            <img :src="orbisLogo" height="16" />
          </a>
        </p>
      </div>

      <!-- List messages sent in the group -->
      <div class="chatBoxMessagesContainer">
        <p v-if="loading" style="width: 100%; text-align: center">
          <img :src="SpinnerBlackIcon" class="loadingSpinner" />
        </p>
        <div v-if="messages.length" style="width: 100%; position: relative">
          <Message
            v-for="(message, key) in messages"
            :key="key"
            :user="user"
            :message="message"
            :replyTo="replyTo"
            @reply="reply"
          />
        </div>
        <div v-else-if="!loading" class="chatBoxNoMessage">No message yet</div>
      </div>

      <!-- Display input -->
      <div class="chatBoxInputContainer" style="{themes.footer}">
        <MessageBox
          v-if="user"
          :orbis="_orbis"
          :user="user"
          :context="context"
          :replyTo="replyTo"
          :replyToText="replyToText"
          @newMessage="onNewMessage"
        />
        <p v-else style="width: 100%; text-align: center; margin: 0">
          <ConnectButton
            :orbis="_orbis"
            :user="user"
            @connected="onConnected"
          />
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "../assets/style.scss";
</style>
