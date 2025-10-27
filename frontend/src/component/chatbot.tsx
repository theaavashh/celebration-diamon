'use client'

import React, { useState } from 'react'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'

interface Message {
  id: number
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your diamond jewelry assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')

    // Simulate bot response
    setTimeout(() => {
      const botResponse = getBotResponse(inputValue)
      const botMessage: Message = {
        id: messages.length + 2,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
    }, 1000)
  }

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()
    
    if (input.includes('ring') || input.includes('engagement')) {
      return "We have a stunning collection of engagement rings! From classic solitaires to modern designs, we can help you find the perfect ring. Would you like to see our latest collection?"
    }
    
    if (input.includes('necklace') || input.includes('pendant')) {
      return "Our necklace collection features elegant designs with premium diamonds. We have everything from delicate pendants to statement pieces. Should I show you our current selection?"
    }
    
    if (input.includes('earring') || input.includes('earrings')) {
      return "Earrings are a perfect way to add sparkle! We offer studs, hoops, and drop earrings. What style are you looking for?"
    }
    
    if (input.includes('bracelet') || input.includes('bangle')) {
      return "Our bracelet collection includes tennis bracelets, bangles, and charm bracelets. Each piece is crafted with attention to detail. Would you like to explore?"
    }
    
    if (input.includes('price') || input.includes('cost') || input.includes('expensive')) {
      return "Our prices vary based on design, diamond quality, and materials. We offer pieces for every budget. Would you like to schedule a consultation to discuss your preferences?"
    }
    
    if (input.includes('custom') || input.includes('design')) {
      return "We specialize in custom jewelry design! Our master craftsmen can create a unique piece just for you. Would you like to learn more about our custom design process?"
    }
    
    if (input.includes('certificate') || input.includes('certification')) {
      return "All our diamonds come with proper certification from recognized laboratories. We ensure authenticity and quality. Would you like to know more about our certification process?"
    }
    
    if (input.includes('appointment') || input.includes('visit') || input.includes('store')) {
      return "We'd love to meet you! You can visit our studio or schedule a virtual consultation. What works better for you?"
    }
    
    return "Thank you for your message! I'm here to help you find the perfect diamond jewelry. You can ask me about our collections, custom designs, pricing, or book an appointment."
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-[#E1C16E] hover:bg-[#D4B45A] text-black p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        aria-label="Open chat"
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed bg-black/10 inset-0 z-1000 flex items-end justify-end p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/80" onClick={() => setIsOpen(false)} />
          
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md h-[500px] sm:h-[600px] flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-[#E1C16E] to-[#D4B45A] rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <Bot size={20} className="text-[#E1C16E]" />
                </div>
                <div>
                  <h3 className="font-semibold text-black">Celebration Diamond- Help Center</h3>
                  <p className="text-xs text-black/70">Online now</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={20} className="text-black" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-[#E1C16E] text-black'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.sender === 'bot' && (
                        <Bot size={16} className="text-[#E1C16E] mt-1 flex-shrink-0" />
                      )}
                      <div>
                        <p className="text-sm">{message.text}</p>
                        <p className="text-xs opacity-60 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      {message.sender === 'user' && (
                        <User size={16} className="text-black mt-1 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#E1C16E] focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="p-2 bg-[#E1C16E] hover:bg-[#D4B45A] text-black rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 