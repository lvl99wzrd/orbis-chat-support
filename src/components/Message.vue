<script setup>
import { onMounted } from "vue";
import Pfp from "./Pfp.vue";

import ReplyToIcon from "../assets/img/icons/question-replyto.png";
import ReplyToActiveIcon from "../assets/img/icons/question-replyto-active.png";

const props = defineProps({
  user: Object,
  message: Object,
  replyTo: String,
  themes: Object,
});

const emits = defineEmits(["reply"]);

const shortMessage = (text, length) => {
  if (!text) {
    return "-";
  }

  /** Retrieve first and last characters of a stream to display a shortened version of it */
  const _firstChars = text.substring(0, length);
  return _firstChars + "...";
}

const formatMessage = (message) => {
  let text = message.content.body.toString();

  // Replace all nbsp
  text = text.replace(/<[^>]*(>|$)|&nbsp;|&zwnj;|&raquo;|&laquo;|&gt;/g, " ");

  // Replace url with link
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  text = text.replace(urlRegex, (url) => {
    let _url = url;
    if (_url.length > 25) {
      const start = _url.substring(0, 11);
      const end = _url.substring(_url.length - 11, _url.length);
      _url = start + "..." + end;
    }
    return `<a href="${url}" title="${url}" target="_blank">${_url}</a>`;
  });

  // Replace mention with link
  if (
    message.content.mentions !== undefined &&
    message.content.mentions.length
  ) {
    message.content.mentions.forEach(({ did, username }) => {
      const userRegex = new RegExp(username, "g");
      text = text.replace(userRegex, (_username) => {
        return `<a href="https://orbis.club/profile/${did}" target="_blank" rel="noreferrer">${_username}</a>`;
      });
    });
  }

  // Replace new line with <br>
  text = text.replace(/(?:\r\n|\r|\n)/g, "<br />");

  return text;
};
</script>

<template>
  <div
    :class="[
      user && message.creator == user.did
        ? 'chatBoxOneMessageContainerSender'
        : 'chatBoxOneMessageContainer',
    ]"
  >
    <!-- Left side Pfp -->
    <div
      v-if="!user || user == null || (user && message.creator != user.did)"
      style="margin-right: 3px"
    >
      <Pfp
        :did="message.creator"
        :details="message.creator_details"
        :displayBadge="false"
      />
    </div>

    <!-- Message content -->
    <div class="flexColumn">
      <div v-if="message.reply_to" class="flexRow">
        <div class="chatBoxOneMessageReplyLine" />
        <div class="chatBoxOneMessageReply">
          {{
            message.reply_to_details &&
            message.reply_to_details.body &&
            message.reply_to_details.body.length > 40
              ? shortMessage(message.reply_to_details.body, 40)
              : message.reply_to_details.body
          }}
        </div>
      </div>
      <div class="chatBoxOneSupportMessage">
        <p v-html="formatMessage(message)" />
      </div>
    </div>

    <!-- Right-side Pfp -->
    <div v-if="user && message.creator == user.did" style="margin-left: 3px">
      <Pfp
        :did="message.creator"
        :details="message.creator_details"
        :displayBadge="false"
      />
    </div>

    <!-- Display only if user is hovering the message -->
    <div class="hoveredActions">
      <div class="hoveredAction" @click="emits('reply', message)">
        <img :src="ReplyToIcon" height="15" />
      </div>
    </div>

    <!-- Show if the message is being replied to -->
    <div v-if="replyTo && replyTo == message.stream_id" class="hoveredActions">
      <div class="hoveredAction" @clcik="emits('reply', null)">
        <img :src="ReplyToActiveIcon" height="15" />
      </div>
    </div>
  </div>
</template>
