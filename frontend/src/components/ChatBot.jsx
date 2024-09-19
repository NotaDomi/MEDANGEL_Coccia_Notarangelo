import { Webchat, WebchatProvider, getClient } from "@botpress/webchat"
import { buildTheme } from "@botpress/webchat-generator"
import { useState, useEffect } from "react"

const { theme, style } = buildTheme({
  themeName: "prism",
  themeColor: "#634433",
})

const clientId = "0e9b6815-13db-4c15-8029-e480b51cfd7b"

export default function ChatBot({ loggedUser }) {
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    if (loggedUser && loggedUser._id) {
      setUserId(loggedUser._id)
    }
  }, [loggedUser])

  if (!userId) return null

  const client = getClient({ clientId, userId }) // Passa userId correttamente al client

  const config = {
    composerPlaceholder: "Cosa vorresti sapere?",
    botName: "MedAngelBot",
    botAvatar: "logoMEDANGEL1.png",
    botDescription: "",
  }

  return (
    <div>
      <style>{style}</style>
      <WebchatProvider
        key={JSON.stringify(config)}
        theme={theme}
        configuration={config}
        client={client}
      >
        <Webchat />
      </WebchatProvider>
    </div>
  )
}
