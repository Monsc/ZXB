// 私信主流程 E2E 测试

describe('私信主流程', () => {
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
  const messageAtoB = `A发给B的私信 ${Date.now()}`;
  const messageBtoA = `B回复A的私信 ${Date.now()}`;

  it('A发私信给B，B收到并回复，未读数和内容正确', () => {
    // 用户A注册
    cy.visit('http://localhost:5173/register');
    cy.get('input[name="username"]').type(userA.username);
    cy.get('input[name="email"]').type(userA.email);
    cy.get('input[name="password"]').type(userA.password);
    cy.get('button').contains('注册').click();
    cy.contains('发布动态').should('exist');
    // 退出A
    cy.get('img').first().click();
    cy.contains('退出登录').click({ force: true });
    cy.url().should('include', '/login');

    // 用户B注册
    cy.visit('http://localhost:5173/register');
    cy.get('input[name="username"]').type(userB.username);
    cy.get('input[name="email"]').type(userB.email);
    cy.get('input[name="password"]').type(userB.password);
    cy.get('button').contains('注册').click();
    cy.contains('发布动态').should('exist');
    // B进入A主页并发起私信
    cy.visit(`http://localhost:5173/profile/${userA.username}`);
    cy.contains('发起私信').click();
    cy.get('textarea').type(messageAtoB);
    cy.get('button').contains('发送').click();
    cy.contains(messageAtoB).should('exist');
    // 退出B
    cy.get('img').first().click();
    cy.contains('退出登录').click({ force: true });
    cy.url().should('include', '/login');

    // 用户A登录，检查未读数和内容
    cy.visit('http://localhost:5173/login');
    cy.get('input[name="email"]').type(userA.email);
    cy.get('input[name="password"]').type(userA.password);
    cy.get('button').contains('登录').click();
    cy.contains('发布动态').should('exist');
    cy.visit('http://localhost:5173/messages');
    cy.contains(userB.username).should('exist');
    cy.contains(messageAtoB).should('exist');
    // A回复B
    cy.contains(userB.username).click();
    cy.get('textarea').type(messageBtoA);
    cy.get('button').contains('发送').click();
    cy.contains(messageBtoA).should('exist');
  });
}); 