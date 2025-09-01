
import okapiChatWhite from '../../../../src/media/img/okapiChatWhite.png';
import { useContext, useEffect } from 'react';
import './chatBox.scss';
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';
import { ChatContext } from '../../../context/chatContext';

const N8nChat = () => {
  const { sessionId } = useContext(ChatContext);

  useEffect(() => {
    const container = document.getElementById('n8n-chat');
    if (!container || container.children.length > 0) return;

    createChat({
      mode: 'window',
      target: '#n8n-chat',
      webhookUrl: 'https://daromainnovations.app.n8n.cloud/webhook/1503abd0-4f09-4e40-b0d4-bc649f042b72/chat',
      chatInputKey: 'chatInput',
      sessionId,
      showWelcomeScreen: false,
      loadPreviousSession: true,
    });

    const observer = new MutationObserver(() => {
      const chatHeading = document.querySelector('.chat-header');
      const botMessage = document.querySelector('.chat-message.chat-message-from-bot');
      
      if (chatHeading) {
        chatHeading.innerHTML = '';

        const customHeader = document.createElement('div');
        customHeader.className = 'okapi-heading-wrapper';

        customHeader.innerHTML = `
          <img src="${okapiChatWhite}" alt="Okapi Icon" class="okapi-icon" />
          <span class="okapi-text">KapiBOT</span>
        `;

        chatHeading.appendChild(customHeader);

        const paragraph = document.querySelector('.chat-header p');
        if (paragraph) paragraph.innerHTML = '';

        observer.disconnect();
      }

      if (botMessage) botMessage.remove();

      setTimeout(() => {
        const textArea = document.querySelector('.chat-footer .chat-input textarea[placeholder="Type your question.."]');
        if (textArea) {
          textArea.value = '';
        }
      }, 3000);
    });

    observer.observe(document.body, { childList: true, subtree: true });

  }, [sessionId]);

  return <div id="n8n-chat" />;
};

export default N8nChat;
