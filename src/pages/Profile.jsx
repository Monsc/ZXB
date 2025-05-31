import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const mockProfile = {
  name: '你',
  username: 'yourid',
  bio: '极简科技感+X式响应式UI演示',
  avatar: '',
  following: 123,
  followers: 456,
};

export default function Profile() {
  const profile = mockProfile;
  return (
    <div className="space-y-6 py-6">
      <Card className="flex flex-col items-center space-y-4">
        <div className="w-24 h-24 bg-muted rounded-full" />
        <div className="text-xl font-bold text-accent-blue">{profile.name}</div>
        <div className="text-muted">@{profile.username}</div>
        <div className="text-white text-center">{profile.bio}</div>
        <div className="flex space-x-6 pt-2">
          <div className="text-center">
            <div className="font-bold text-accent-blue">{profile.following}</div>
            <div className="text-muted text-xs">关注</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-accent-blue">{profile.followers}</div>
            <div className="text-muted text-xs">粉丝</div>
          </div>
        </div>
        <Button>编辑资料</Button>
      </Card>
      {/* 这里可插入用户动态列表等 */}
    </div>
  );
} 