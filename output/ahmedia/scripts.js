(function () {
  const root = document.querySelector('.chat-widget');
  if (!root) return;

  const endpoint = "/api/chat.php";
  const input = root.querySelector('.chat-input');
  const sendButton = root.querySelector('.chat-send-button');
  const messages = root.querySelector('.chat-messages');
  const closeButton = root.querySelector('.chat-close-button');
  const reopenButton = root.querySelector('.chat-reopen-button');

  if (!localStorage.getItem('namespace')) {
    const namespace = window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : String(Date.now());
    localStorage.setItem('namespace', namespace);
  }

  function createTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('div');
      dot.className = 'typing-dot';
      indicator.appendChild(dot);
    }
    return indicator;
  }

  function addMessage(message, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ' + (isUser ? 'user-message' : 'bot-message');
    const parsed = message
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');
    messageDiv.innerHTML = parsed;
    messages.appendChild(messageDiv);
    messages.scrollTop = messages.scrollHeight;
  }

  function createBotMessageElement() {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot-message';
    messages.appendChild(messageDiv);
    return messageDiv;
  }

  function updateBotMessage(messageDiv, content) {
    const escaped = content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    messageDiv.textContent = '';
    const lines = escaped.split('\n');
    lines.forEach(function (line, i) {
      messageDiv.appendChild(
        document.createTextNode(line.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'))
      );
      if (i < lines.length - 1) {
        messageDiv.appendChild(document.createElement('br'));
      }
    });
    messages.scrollTop = messages.scrollHeight;
  }

  async function sendMessage(message) {
    if (!message.trim()) return;

    const namespace = localStorage.getItem('namespace');

    input.disabled = true;
    sendButton.disabled = true;
    addMessage(message, true);

    const typingIndicator = createTypingIndicator();
    messages.appendChild(typingIndicator);
    messages.scrollTop = messages.scrollHeight;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ namespace: namespace, message: message })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let fullContent = '';
        let firstChunkReceived = false;

        const botMessageDiv = createBotMessageElement();
        botMessageDiv.style.display = 'none';

        function showFirstContent() {
          if (!firstChunkReceived) {
            firstChunkReceived = true;
            if (typingIndicator && typingIndicator.parentNode) {
              messages.removeChild(typingIndicator);
            }
            botMessageDiv.style.display = '';
          }
        }

        while (true) {
          const result = await reader.read();
          if (result.done) break;

          buffer += decoder.decode(result.value, { stream: true });
          buffer = buffer.replace(/\}\s*\{/g, '}\n{');
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.trim()) continue;

            try {
              const parsed = JSON.parse(line);
              if (parsed.type === 'item' && parsed.content) {
                fullContent += parsed.content;
                showFirstContent();
                updateBotMessage(botMessageDiv, fullContent);
              } else if (parsed.progress && parsed.progress.delta) {
                fullContent += parsed.progress.delta;
                showFirstContent();
                updateBotMessage(botMessageDiv, fullContent);
              } else if (parsed.content && !parsed.output) {
                fullContent += parsed.content;
                showFirstContent();
                updateBotMessage(botMessageDiv, fullContent);
              }
            } catch (e) {
              const trimmed = line.trim();
              if (!trimmed.startsWith('{') && trimmed.indexOf('"output"') === -1) {
                fullContent += line;
                showFirstContent();
                updateBotMessage(botMessageDiv, fullContent);
              }
            }
          }
        }

        if (buffer.trim()) {
          const remainingLines = buffer.replace(/\}\s*\{/g, '}\n{').split('\n');
          for (const line of remainingLines) {
            if (!line.trim()) continue;

            try {
              const parsed = JSON.parse(line);
              if (parsed.type === 'item' && parsed.content) {
                fullContent += parsed.content;
              } else if (parsed.progress && parsed.progress.delta) {
                fullContent += parsed.progress.delta;
              } else if (parsed.content && !parsed.output) {
                fullContent += parsed.content;
              }
            } catch (e) {
              const trimmed = line.trim();
              if (!trimmed.startsWith('{') && trimmed.indexOf('"output"') === -1) {
                fullContent += line;
              }
            }
          }
          showFirstContent();
          updateBotMessage(botMessageDiv, fullContent);
        }

        const outputIndex = fullContent.indexOf('{"output"');
        if (outputIndex > 0) {
          fullContent = fullContent.substring(0, outputIndex).trim();
        }

        showFirstContent();
        updateBotMessage(botMessageDiv, fullContent.trim() ? fullContent : 'No response received.');
      } else {
        if (typingIndicator && typingIndicator.parentNode) {
          messages.removeChild(typingIndicator);
        }
        const data = await response.json();
        addMessage(data.output, false);
      }

      input.value = '';
    } catch (error) {
      if (typingIndicator && typingIndicator.parentNode) {
        messages.removeChild(typingIndicator);
      }
      addMessage('Failed to send message. Please try again.', false);
    } finally {
      input.disabled = false;
      sendButton.disabled = false;
      input.focus();
    }
  }

  closeButton.addEventListener('click', function () {
    root.classList.remove('is-open');
  });

  reopenButton.addEventListener('click', function () {
    root.classList.add('is-open');
  });

  sendButton.addEventListener('click', function () {
    sendMessage(input.value);
  });

  input.addEventListener('keypress', function (event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage(input.value);
    }
  });
})();

(function () {
  const root = document.querySelector('.back-to-top-link');
  if (!root) return;

  const threshold = 200;
  const link = root.querySelector('a');
  let hideTimer;

  function syncBackToTop() {
    if (window.scrollY > threshold) {
      root.classList.add('in');
      clearTimeout(hideTimer);
      requestAnimationFrame(() => root.classList.add('visible'));
      return;
    }

    root.classList.remove('visible');
    hideTimer = window.setTimeout(() => root.classList.remove('in'), 180);
  }

  link.addEventListener('click', function (event) {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', syncBackToTop, { passive: true });
  syncBackToTop();
})();