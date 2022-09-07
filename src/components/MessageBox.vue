<script setup>
import { ref, watch } from "vue";
import Pfp from "./Pfp.vue";

import SpinnerWhiteIcon from "../assets/img/icons/question-spinner-white.png";
import SendIcon from "../assets/img/icons/question-send.png";

const props = defineProps({
  user: Object,
  orbis: Object,
  context: String,
  replyTo: String,
  replyToText: String,
});

const emits = defineEmits(["newMessage"]);

const message = ref(null);
const sending = ref(false);
const contactInput = ref(null);

/** Send message to Cerscan support channel */
const sendMessage = async () => {
  /** Make sure message isn't empty. */
  if (!message.value || message.value == "") {
    alert("You can't share an empty message.");
    return;
  }

  /** Make sure not currently sending any message */
  if (sending.value) {
    return;
  }

  sending.value = true;
  let res = await props.orbis.createPost({
    body: message.value,
    context: props.context,
    reply_to: props.replyTo ? props.replyTo : null,
    master: props.replyTo ? props.replyTo : null,
  });
  console.log("res sharing post: ", res);
  if (res.status == 200) {
    sending.value = false;

    /** Generate callback to insert in messages array */
    let newMessage = {
      creator: props.user.did,
      creator_details: {
        did: props.user.did,
        profile: props.user.profile,
      },
      stream_id: res.doc,
      content: {
        body: message.value,
        context: props.context,
      },
      master: props.replyTo ? props.replyTo : null,
      reply_to: props.replyTo ? props.replyTo : null,
      reply_to_details: props.replyTo ? { body: props.replyToText } : null,
      reply_to_creator_details: null,
    };

    /** Reset text box */
    message.value = null;
    if (contactInput.value) {
      // contactInput.value.textContent = "";
      contactInput.value.focus();
    }

    /** Added the created post to the messages array */
    emits("newMessage", newMessage);
  } else {
    alert("Error sharing post.");
  }
};

watch(
  () => props.replyTo,
  (replyTo) => {
    if (replyTo && contactInput.value) {
      contactInput.value.focus();
    }
  }
);
</script>

<template>
  <div class="chatBoxMessageBoxContainer">
    <!-- Show reply to info if message is replying to someone -->
    <div v-if="replyTo" class="chatBoxContactReplyToInfo">
      <p>
        <span class="chatBoxContactReplyToInfoLabel">Replying to:</span>
        {{
          replyToText && replyToText.length > 30
            ? shortMessage(replyToText, 30)
            : replyToText
        }}
      </p>
    </div>
    <div class="flexRow" style="width: 100%">
      <div style="margin-right: 5px; display: flex">
        <Pfp :did="user.did" :details="user" />
      </div>
      <input
        ref="contactInput"
        class="chatBoxInput"
        placeholder="Type your message"
        :disabled="sending"
        v-model="message"
      />
      <div class="chatBoxSubmitContainer">
        <button v-if="sending" class="chatBoxSubmit">
          <img :src="SpinnerWhiteIcon" class="loadingSpinner" />
        </button>
        <button v-else class="chatBoxSubmit" @click="sendMessage">
          <img :src="SendIcon" />
        </button>
      </div>
    </div>
  </div>
</template>
