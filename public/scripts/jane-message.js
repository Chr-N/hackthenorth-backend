const res = fetch('/api/messages').then(res => res.json()).then(data => {
  const messages = data.messages[0].messages.split(',')
  // console.log(messages)

  const messageNodes = document.querySelectorAll('.msg')
  messageNodes.forEach((node,i) => {
    node.textContent = messages[i].replace('^^', '')
  })
})
