// 国际化切换主流程 E2E 测试

describe('国际化切换流程', () => {
  it('切换语言后主流程、弹窗、空状态、Toast等UI文案切换正常', () => {
    cy.visit('http://localhost:5173');
    // 默认中文
    cy.contains('首页').should('exist');
    cy.contains('登录').should('exist');
    cy.contains('暂无内容').should('exist');
    cy.get('button').contains('发布').should('exist');
    cy.get('button').contains('搜索').should('exist');
    cy.get('button').contains('注册').should('exist');
    cy.get('select').first().should('exist');

    // 切换为英文
    cy.get('select').first().select('en');
    cy.contains('Home').should('exist');
    cy.contains('Login').should('exist');
    cy.contains('No content yet').should('exist');
    cy.get('button').contains('Post').should('exist');
    cy.get('button').contains('Search').should('exist');
    cy.get('button').contains('Register').should('exist');

    // 切换回中文
    cy.get('select').first().select('zh');
    cy.contains('首页').should('exist');
    cy.contains('登录').should('exist');
    cy.contains('暂无内容').should('exist');
    cy.get('button').contains('发布').should('exist');
    cy.get('button').contains('搜索').should('exist');
    cy.get('button').contains('注册').should('exist');

    // 注册并登录
    const email = `i18n+${Date.now()}@e2e.com`;
    const password = 'testpassword';
    const username = `i18nuser${Date.now()}`;
    cy.visit('http://localhost:5173/register');
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button').contains('注册').click();
    cy.contains('发布动态').should('exist');

    // 切换英文，断言主流程页面
    cy.get('select').first().select('en');
    cy.contains('Notifications').should('exist');
    cy.contains('Messages').should('exist');
    cy.contains('Comments').should('exist');
    cy.contains('Settings').should('exist');
    cy.get('button').contains('Post').should('exist');
    cy.get('button').contains('Search').should('exist');
    cy.get('button').contains('Logout').should('exist');
    cy.get('button').contains('Cancel').should('exist');
    cy.get('button').contains('OK').should('exist');
    cy.contains('No data').should('exist');

    // 弹窗/Toast/表单校验（模拟发帖/评论/点赞/空状态/错误）
    cy.get('button').contains('Post').click();
    cy.get('textarea').type('E2E i18n test post');
    cy.get('button').contains('Submit').click();
    cy.contains('Action successful').should('exist');
    // 点赞
    cy.get('button').contains('Like').first().click({force:true});
    cy.contains('Like failed').should('not.exist'); // 若失败会有Toast
    // 评论
    cy.get('textarea').first().type('E2E i18n comment');
    cy.get('button').contains('Submit').click();
    cy.contains('Action successful').should('exist');
    // 空状态
    cy.visit('http://localhost:5173/messages');
    cy.contains('No messages yet').should('exist');
    // 切换回中文，断言同样页面
    cy.get('select').first().select('zh');
    cy.contains('通知').should('exist');
    cy.contains('私信').should('exist');
    cy.contains('评论').should('exist');
    cy.contains('设置').should('exist');
    cy.get('button').contains('发布').should('exist');
    cy.get('button').contains('搜索').should('exist');
    cy.get('button').contains('退出登录').should('exist');
    cy.get('button').contains('取消').should('exist');
    cy.get('button').contains('确定').should('exist');
    cy.contains('暂无数据').should('exist');
    cy.visit('http://localhost:5173/messages');
    cy.contains('暂无私信').should('exist');
  });
}); 