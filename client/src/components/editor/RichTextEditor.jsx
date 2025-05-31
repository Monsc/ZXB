import React, { useState, useRef, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Image, Hash, AtSign, Smile } from 'lucide-react';
import { apiService } from '../../services/api';
import TopicSelector from './TopicSelector';
import MentionSelector from './MentionSelector';
import EmojiPicker from './EmojiPicker';
import { cn } from '../../lib/utils';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export const RichTextEditor = ({
  value,
  onChange,
  placeholder = '有什么新鲜事？',
  maxLength = 280,
  className,
}) => {
  const [charCount, setCharCount] = useState(0);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedMentions, setSelectedMentions] = useState([]);
  const [showTopicSelector, setShowTopicSelector] = useState(false);
  const [showMentionSelector, setShowMentionSelector] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [topicQuery, setTopicQuery] = useState('');
  const fileInputRef = useRef(null);
  const editorRef = useRef(null);
  const textareaRef = editorRef; // 复用 editorRef 作为 textarea 的 ref

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.style.height = 'auto';
      editorRef.current.style.height = `${editorRef.current.scrollHeight}px`;
    }
  }, [value]);

  // 拖拽排序用
  const moveImage = (from, to) => {
    setImages(prev => {
      const updated = [...prev];
      const [moved] = updated.splice(from, 1);
      updated.splice(to, 0, moved);
      return updated;
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    if (images.length + files.length > 4) {
      alert('最多只能上传4张图片');
      return;
    }
    // 校验类型和大小
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const validFiles = files.filter(file => {
      if (!validTypes.includes(file.type)) {
        alert('仅支持jpg/png/webp/gif格式图片');
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('图片大小不能超过5MB');
        return false;
      }
      return true;
    });
    if (validFiles.length === 0) return;
    setLoading(true);
    try {
      const uploadPromises = validFiles.map(file => apiService.uploadImage(file));
      const uploadedImages = await Promise.all(uploadPromises);
      setImages([...images, ...uploadedImages]);
      // 在编辑器中插入图片
      const imageHtml = uploadedImages
        .map(img => `<img src="${img.url}" alt="uploaded" class="max-w-full h-auto rounded-lg" />`)
        .join('');
      editorRef.current?.insertContent(imageHtml);
    } catch (error) {
      console.error('图片上传失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!value.trim() && images.length === 0) return;
    
    try {
      setLoading(true);
      await onChange({
        content: value,
        images: images.map(img => img.url),
        topics: selectedTopics,
        mentions: selectedMentions.map(user => user._id)
      });
      setImages([]);
      setSelectedTopics([]);
      setSelectedMentions([]);
    } catch (error) {
      console.error('发布失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInput = (e) => {
    const content = e.target.value;
    if (content.length <= maxLength) {
      onChange(content);
      setCharCount(content.length);
      // 检测@或#触发补全
      const cursor = e.target.selectionStart;
      const textBefore = content.slice(0, cursor);
      // 匹配@用户名
      const mentionMatch = textBefore.match(/@([\w\u4e00-\u9fa5]{1,20})$/);
      if (mentionMatch) {
        setMentionQuery(mentionMatch[1]);
        setShowMentionSelector(true);
      } else {
        setShowMentionSelector(false);
        setMentionQuery('');
      }
      // 匹配#话题
      const topicMatch = textBefore.match(/#([\w\u4e00-\u9fa5]{1,20})$/);
      if (topicMatch) {
        setTopicQuery(topicMatch[1]);
        setShowTopicSelector(true);
      } else {
        setShowTopicSelector(false);
        setTopicQuery('');
      }
    }
  };

  const handleTopicSelect = (topics) => {
    setSelectedTopics(topics);
    // 替换输入框中的#xxx为选中话题
    const textarea = textareaRef.current;
    if (textarea) {
      const cursor = textarea.selectionStart;
      const textBefore = value.slice(0, cursor);
      const topicMatch = textBefore.match(/#([\w\u4e00-\u9fa5]{1,20})$/);
      if (topicMatch) {
        const start = cursor - topicMatch[0].length;
        const newValue = value.slice(0, start) + '#' + topics[topics.length - 1] + ' ' + value.slice(cursor);
        onChange(newValue);
        setCharCount(newValue.length);
        setTimeout(() => {
          textarea.focus();
          textarea.selectionStart = textarea.selectionEnd = start + topics[topics.length - 1].length + 2;
        }, 0);
      }
    }
    setShowTopicSelector(false);
    setTopicQuery('');
  };

  const handleMentionSelect = (mentions) => {
    setSelectedMentions(mentions);
    // 替换输入框中的@xxx为选中用户名
    const textarea = textareaRef.current;
    if (textarea) {
      const cursor = textarea.selectionStart;
      const textBefore = value.slice(0, cursor);
      const mentionMatch = textBefore.match(/@([\w\u4e00-\u9fa5]{1,20})$/);
      if (mentionMatch) {
        const start = cursor - mentionMatch[0].length;
        const newValue = value.slice(0, start) + '@' + mentions[mentions.length - 1].username + ' ' + value.slice(cursor);
        onChange(newValue);
        setCharCount(newValue.length);
        setTimeout(() => {
          textarea.focus();
          textarea.selectionStart = textarea.selectionEnd = start + mentions[mentions.length - 1].username.length + 2;
        }, 0);
      }
    }
    setShowMentionSelector(false);
    setMentionQuery('');
  };

  // 插入 emoji 到光标处
  const insertAtCursor = (emoji) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = value.slice(0, start);
    const after = value.slice(end);
    const newValue = before + emoji + after;
    onChange(newValue);
    setCharCount(newValue.length);
    // 设置光标到插入后的位置
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
    }, 0);
  };

  const handleEmojiSelect = (emoji) => {
    insertAtCursor(emoji);
    setShowEmojiPicker(false);
  };

  // 拖拽图片组件
  const DraggableImage = ({ image, index, moveImage, onRemove }) => {
    const ref = useRef(null);
    const [, drop] = useDrop({
      accept: 'image',
      hover(item) {
        if (item.index !== index) {
          moveImage(item.index, index);
          item.index = index;
        }
      },
    });
    const [{ isDragging }, drag] = useDrag({
      type: 'image',
      item: { index },
      collect: monitor => ({ isDragging: monitor.isDragging() }),
    });
    drag(drop(ref));
    return (
      <div ref={ref} className={`relative group ${isDragging ? 'opacity-50' : ''}`} style={{ cursor: 'move' }}>
        <img
          src={image.url}
          alt={`预览 ${index + 1}`}
          className="w-full h-24 object-cover rounded-lg"
        />
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="absolute top-1 right-1 p-1 bg-black bg-opacity-50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    );
  };

  return (
    <div className="relative">
      <textarea
        ref={editorRef}
        value={value}
        onChange={handleInput}
        placeholder={placeholder}
        className={cn(
          'w-full resize-none bg-transparent outline-none text-[15px] leading-6',
          'placeholder:text-gray-500 dark:placeholder:text-gray-400',
          className
        )}
        rows={1}
      />
      <div className="absolute bottom-2 right-2 text-sm text-gray-500 dark:text-gray-400">
        {charCount}/{maxLength}
      </div>

      {/* 工具栏 */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            disabled={loading || images.length >= 4}
          >
            <Image className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => setShowTopicSelector(!showTopicSelector)}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            disabled={loading}
          >
            <Hash className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => setShowMentionSelector(!showMentionSelector)}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            disabled={loading}
          >
            <AtSign className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            disabled={loading}
          >
            <Smile className="w-5 h-5" />
          </button>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || (!value.trim() && images.length === 0)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '发布中...' : '发布'}
        </button>
      </div>

      {/* 隐藏的文件输入 */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        multiple
        className="hidden"
      />

      {/* 图片预览 */}
      {images.length > 0 && (
        <DndProvider backend={HTML5Backend}>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {images.map((image, index) => (
              <DraggableImage
                key={image.url}
                image={image}
                index={index}
                moveImage={moveImage}
                onRemove={i => setImages(images.filter((_, idx) => idx !== i))}
              />
            ))}
          </div>
        </DndProvider>
      )}

      {/* 话题选择器弹窗 */}
      {showTopicSelector && (
        <div className="absolute z-10 mt-2">
          <TopicSelector onSelect={handleTopicSelect} selectedTopics={selectedTopics} query={topicQuery} />
        </div>
      )}

      {/* @提及选择器弹窗 */}
      {showMentionSelector && (
        <div className="absolute z-10 mt-2">
          <MentionSelector onSelect={handleMentionSelect} selectedUsers={selectedMentions} query={mentionQuery} />
        </div>
      )}

      {/* 表情选择器弹窗 */}
      {showEmojiPicker && (
        <div className="absolute z-50 mt-2">
          <EmojiPicker onSelect={handleEmojiSelect} />
        </div>
      )}
    </div>
  );
};

export default RichTextEditor; 