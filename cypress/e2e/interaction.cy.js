// 评论与点赞主流程 E2E 测试

describe('评论与点赞流程', () => {
  const email = `test+${Date.now()}@e2e.com`;
  const password = 'testpassword';
  const username = `e2euser${Date.now()}`;
  const postContent = `E2E测试发帖 ${Date.now()}`;

  it('注册并发帖、评论、点赞', () => {
    // 注册并登录
    cy.visit('http://localhost:5173/register');
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button').contains('注册').click();
    cy.contains('发布动态').should('exist');

    // 发帖
    cy.contains('发布动态').click();
    cy.get('textarea').type(postContent);
    cy.get('button').contains('发布').click();
    cy.contains('发布成功', { timeout: 10000 }).should('exist');
    cy.contains(postContent).should('exist');

    // 评论
    cy.contains(postContent).parents('div').first().within(() => {
      cy.get('textarea').type('E2E自动化评论');
      cy.get('button').contains('发布').click();
    });
    cy.contains('评论发布成功').should('exist');
    cy.contains('E2E自动化评论').should('exist');

    // 点赞
    cy.contains(postContent).parents('div').first().within(() => {
      cy.get('button').contains('❤️').click();
    });
    // 点赞数+1
    cy.contains(postContent).parents('div').first().within(() => {
      cy.get('button').contains('❤️').should('exist');
    });
  });

  it('未登录用户不能评论或点赞', () => {
    cy.visit('http://localhost:5173');
    // 假设首页有帖子
    cy.get('textarea').first().type('未登录评论尝试');
    cy.get('button').contains('发布').click();
    cy.contains('请先登录').should('exist');
    cy.get('button').contains('❤️').first().click();
    cy.contains('请先登录').should('exist');
  });
}); 