import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { MessageCircle, Send, Bot, User, Minimize2, Maximize2 } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/components/ui/use-toast'

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
}

interface MonasteryChatbotProps {
  isMinimized?: boolean
  onToggleMinimize?: () => void
}

const MonasteryChatbot = ({ isMinimized = false, onToggleMinimize }: MonasteryChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Welcome message
    const welcomeMessage: Message = {
      id: '1',
      type: 'bot',
      content: 'Namaste! 🙏 I\'m your guide to the sacred monasteries of Sikkim. Ask me anything about their history, festivals, architecture, or visiting information!',
      timestamp: new Date()
    }
    setMessages([welcomeMessage])
  }, [])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const { data, error } = await supabase.functions.invoke('monastery-chatbot', {
        body: { message: inputMessage.trim() }
      })

      if (error) {
        throw error
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: data.reply || 'I apologize, but I couldn\'t process your request at the moment. Please try again.',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Chatbot error:', error)
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'I\'m sorry, I\'m having trouble connecting right now. Please try again in a moment.',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, errorMessage])
      
      toast({
        title: "Connection Error",
        description: "Unable to connect to the monastery guide. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (isMinimized) {
    return (
      <Card className="fixed bottom-4 right-4 w-80 z-50 monastery-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 cursor-pointer" onClick={onToggleMinimize}>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Monastery Guide
          </CardTitle>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <Maximize2 className="h-3 w-3" />
          </Button>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 h-[500px] z-50 monastery-card flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <MessageCircle className="h-4 w-4" />
          Monastery Guide
        </CardTitle>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onToggleMinimize}>
          <Minimize2 className="h-3 w-3" />
        </Button>
      </CardHeader>
      
      <CardContent className="flex flex-col flex-1 p-0">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'bot' && (
                  <Avatar className="w-8 h-8 bg-primary">
                    <AvatarFallback>
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={`max-w-[70%] rounded-lg px-3 py-2 text-sm ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground ml-auto'
                      : 'bg-muted'
                  }`}
                >
                  {message.content}
                </div>
                
                {message.type === 'user' && (
                  <Avatar className="w-8 h-8 bg-secondary">
                    <AvatarFallback>
                      <User className="w-4 h-4 text-secondary-foreground" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <Avatar className="w-8 h-8 bg-primary">
                  <AvatarFallback>
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg px-3 py-2 text-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>
        
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              placeholder="Ask about monasteries..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="text-sm"
            />
            <Button 
              size="sm" 
              onClick={handleSendMessage} 
              disabled={isLoading || !inputMessage.trim()}
              className="px-3"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Ask about history, festivals, visiting times, or anything about Sikkim monasteries!
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default MonasteryChatbot