import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import RichTextEditor from '../components/ui/RichTextEditor';
import ImageUploader from '../components/ui/ImageUploader';

const mockPosts = [
  {
    id: 1,
    user: { name: '小明', avatar: '' },
    content: '这是第一条极简风格的动态。',
    image: '',
    time: '1小时前',
  },
  {
    id: 2,
    user: { name: '小红', avatar: '' },
    content: '科技感+X式响应式UI演示。',
    image: '',
    time: '2小时前',
  },
];

export default function Feed() {
  const [posts, setPosts] = useState(mockPosts);
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);

  const handlePost = () => {
    setPosts([
      {
        id: Date.now(),
        user: { name: '你', avatar: '' },
        content,
        image,
        time: '刚刚',
      },
      ...posts,
    ]);
    setContent('');
    setImage(null);
  };

  return (
    <div className="space-y-6 py-6">
      <Card className="flex flex-col space-y-4">
        <RichTextEditor value={content} onChange={setContent} />
        <ImageUploader onUpload={file => setImage(URL.createObjectURL(file))} />
        <Button onClick={handlePost} disabled={!content && !image}>
          发布
        </Button>
      </Card>
      {posts.map(post => (
        <Card key={post.id} className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-muted rounded-full" />
            <span className="font-bold text-accent-blue">{post.user.name}</span>
            <span className="text-xs text-muted">{post.time}</span>
          </div>
          <div className="text-white" dangerouslySetInnerHTML={{ __html: post.content }} />
          {post.image && <img src={post.image} alt="" className="w-full rounded-xl border border-border" />}
          <div className="flex space-x-4 pt-2">
            <Button variant="outline">评论</Button>
            <Button variant="outline">点赞</Button>
            <Button variant="outline">分享</Button>
          </div>
        </Card>
      ))}
    </div>
  );
} 