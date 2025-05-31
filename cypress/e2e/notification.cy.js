// 通知主流程 E2E 测试

describe('通知主流程', () => {
  const userA = {
    email: `userA+${Date.now()}@e2e.com`,
    password: 'testpassword',
    username: `userA${Date.now()}`
  };
  const userB = {
    email: `userB+${Date.now()}@e2e.com`,
    password: 'testpassword',
    username: `userB${Date.now()}`
  };
  const postContent = `E2E通知测试发帖 ${Date.now()}`;

  it('用户B评论/点赞/关注用户A，用户A收到通知并可标记为已读', () => {
    // 用户A注册并发帖
    cy.visit('http://localhost:5173/register');
    cy.get('input[name="username"]').type(userA.username);
    cy.get('input[name="email"]').type(userA.email);
    cy.get('input[name="password"]').type(userA.password);
    cy.get('button').contains('注册').click();
    cy.contains('发布动态').should('exist');
    cy.contains('发布动态').click();
    cy.get('textarea').type(postContent);
    cy.get('button').contains('发布').click();
    cy.contains('发布成功', { timeout: 10000 }).should('exist');
    cy.contains(postContent).should('exist');
    // 退出A
    cy.get('img').first().click();
    cy.contains('退出登录').click({ force: true });
    cy.url().should('include', '/login');

    // 用户B注册并操作
    cy.visit('http://localhost:5173/register');
    cy.get('input[name="username"]').type(userB.username);
    cy.get('input[name="email"]').type(userB.email);
    cy.get('input[name="password"]').type(userB.password);
    cy.get('button').contains('注册').click();
    cy.contains('发布动态').should('exist');
    // 评论A的帖子
    cy.contains(postContent).parents('div').first().within(() => {
      cy.get('textarea').type('通知E2E评论');
      cy.get('button').contains('发布').click();
    });
    cy.contains('评论发布成功').should('exist');
    // 点赞A的帖子
    cy.contains(postContent).parents('div').first().within(() => {
      cy.get('button').contains('❤️').click();
    });
    // 关注A
    cy.contains(userA.username).click();
    cy.get('button').contains('关注').click();
    cy.contains('关注成功').should('exist');
    // 退出B
    cy.get('img').first().click();
    cy.contains('退出登录').click({ force: true });
    cy.url().should('include', '/login');

    // 用户A登录，检查通知
    cy.visit('http://localhost:5173/login');
    cy.get('input[name="email"]').type(userA.email);
    cy.get('input[name="password"]').type(userA.password);
    cy.get('button').contains('登录').click();
    cy.contains('发布动态').should('exist');
    cy.visit('http://localhost:5173/notifications');
    // 检查通知内容
    cy.contains('通知').should('exist');
    cy.contains('评论了你的帖子').should('exist');
    cy.contains('赞了你的帖子').should('exist');
    cy.contains('关注了你').should('exist');
    // 标记为已读
    cy.get('button[title="标记为已读"]').first().click();
    cy.contains('全部已读').click();
    // UI变化断言
    cy.contains('暂无通知').should('not.exist');
  });
}); 