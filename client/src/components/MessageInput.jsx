import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { useToast } from '../hooks/useToast';
import { Image, Smile, Send, X } from 'lucide-react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

export function MessageInput({ conversationId, onMessageSent }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);

  // 处理虚拟键盘弹出时的布局调整
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((!message.trim() && !selectedImage) || isUploading) return;

    try {
      if (selectedImage) {
        await apiService.sendImageMessage(conversationId, selectedImage);
        setSelectedImage(null);
      } else {
        await apiService.sendMessage(conversationId, message);
        setMessage('');
      }
      onMessageSent?.();
      inputRef.current?.focus();
    } catch (error) {
      showToast('发送消息失败', 'error');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('请选择图片文件', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('图片大小不能超过5MB', 'error');
      return;
    }

    setSelectedImage(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEmojiClick = (emojiData) => {
    setMessage(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-black">
      {selectedImage && (
        <div className="relative mb-4">
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="预览"
            className="max-h-40 rounded-xl border border-gray-200 dark:border-gray-700 shadow"
          />
          <button
            onClick={removeSelectedImage}
            className="absolute top-2 right-2 p-1 bg-black/60 text-white rounded-full hover:bg-black/80 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-2 rounded-full text-gray-500 hover:text-twitter-blue hover:bg-twitter-blue/10 transition-colors text-xl"
        >
          <Smile className="w-6 h-6" />
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded-full text-gray-500 hover:text-twitter-blue hover:bg-twitter-blue/10 transition-colors text-xl"
          disabled={isUploading}
        >
          <Image className="w-6 h-6" />
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />

        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="输入消息..."
          className="flex-1 px-4 py-2 rounded-full bg-gray-100 dark:bg-[#232d36] border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-twitter-blue focus:border-twitter-blue text-[15px] text-gray-900 dark:text-white transition-all"
        />

        <button
          type="submit"
          disabled={(!message.trim() && !selectedImage) || isUploading}
          className="p-2 rounded-full bg-twitter-blue text-white hover:bg-twitter-blue/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>

      {showEmojiPicker && (
        <div className="absolute bottom-16 left-4 md:left-auto md:right-4 z-50">
          <div className="relative">
            <Picker data={data} onEmojiSelect={(emoji) => handleEmojiClick({ emoji: emoji.native })} theme="light" />
          </div>
        </div>
      )}
    </div>
  );
} 