import React, { createContext, useState } from 'react';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [sessionId] = useState(() => {
    // Reutiliza el ID que N8n ya guarda
    let stored = localStorage.getItem('n8n-chat/sessionId');

    if (!stored) {
      stored = crypto.randomUUID(); // o Math.random si prefieres
      localStorage.setItem('n8n-chat/sessionId', stored);
    }

    return stored;
  });

  return (
    <ChatContext.Provider value={{ sessionId }}>
      {children}
    </ChatContext.Provider>
  );
};
