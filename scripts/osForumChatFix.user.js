// ==UserScript==
// @name         OS Forum Chat Fix
// @icon         https://github.com/Lastie-OS/os-userscripts/blob/main/icon.png?raw=true
// @namespace    https://lastie-os.github.io/os-userscripts/
// @version      2.3.2026
// @description  Fixes forum chat
// @author       Lastie
// @match        https://onlinesequencer.net/forum/*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL  https://github.com/Lastie-OS/os-userscripts/raw/refs/heads/main/scripts/osForumChatFix.user.js
// @updateURL    https://github.com/Lastie-OS/os-userscripts/raw/refs/heads/main/scripts/osForumChatFix.user.js
// ==/UserScript==

(function() {
    'use strict';

    function createForumChat() {
        try {
            const chatPlaceholder = document.getElementById('chatplaceholder');

            if (!chatPlaceholder) {
                console.error("Chat placeholder not found in the DOM.");
                return;
            }

            chatPlaceholder.innerHTML = `
            <div id="chatbox">
              <div id="chatbox_inner">
                <div id="chatbox_left">
                  Please follow the <a href="https://onlinesequencer.net/rules" target="_blank">rules</a> while using chat.
                  <a href="javascript:reportChat()">Report abuse</a>
                </div>
                <div id="chatbox_right">
                  <a href="/playlist/1" target="_blank">Recently Shared</a>
                  &middot; <a href="/logs?page=last" target="_blank">Chat Logs</a>
                  &middot; <a href="/chat/" target="_blank">Mobile-friendly</a>
                  &middot; <span class="sidebar_chat_link"><a href="javascript:sidebarChat()">Move to sidebar</a></span>
                  <a href="javascript:hideChat()" class="close_chat"><i class="far fa-times"></i></a>
                </div>
                <iframe id="chat_frame" allowTransparency="true" scrolling="no" src="/forum/chat_frame.php" frameborder="0"></iframe>
              </div>
            </div>`;

            $('#chatbox').draggable();
        } catch (err) {
            console.error("Error creating chat:", err);
        }
    }

    const addChatFunction = setInterval(() => {
        const chatButton = document.querySelector('.chat_link');

        if (chatButton) {
            chatButton.onclick = createForumChat;
            console.log("Chat function successfully attached to .chat_link");

            let chatBar = document.querySelector('#chatbar').remove();
            clearInterval(addChatFunction);
        }
    }, 500);
})();
