describe('ログインテスト', () => {
  before(() => {
    cy.visit('/')
  })
  it('ログイン画面に移動', () => {
    cy.contains('login').click()
    cy.url().should('include', '/login')
  })
  it('テストアカウントでログイン', () => {
    cy.get('[data-cy=email]').type('hoge@example.com').should('have.value', 'hoge@example.com')
    cy.get('[data-cy=password]').type('sample').should('have.value', 'sample')
    cy.get('[data-cy=button]').click()
    cy.url().should('match', /http:\/\/localhost:8000\/\d+/)
  })
})

describe('バリデーションテスト', () => {
  beforeEach(() => {
    cy.visit('/login')
  })
  it('ログイン済みの場合、サーバーエラーを表示', () => {
    // 一度目のログイン
    cy.get('[data-cy=email]').type('hoge@example.com')
    cy.get('[data-cy=password]').type('sample')
    cy.get('[data-cy=button]').click()
    cy.url().should('match', /http:\/\/localhost:8000\/\d+/)
    // 二度目のログイン
    cy.visit('/login').url().should('include', '/login')
    cy.get('[data-cy=email]').type('hoge@example.com')
    cy.get('[data-cy=password]').type('sample')
    cy.get('[data-cy=button]').click()
    cy.get('[data-cy=errorMessage]').should('be.visible')
  })
  it('未入力の場合、エラーメッセージを表示', () => {
    cy.get('[data-cy=button]').click()
    cy.get('[data-cy=errorMessage]').should('be.visible')
  })
  it('パスワードが間違っていた場合、エラーメッセージを表示', () => {
    cy.get('[data-cy=email]').type('hoge@example.com')
    cy.get('[data-cy=password]').type('wrongpassword')
    cy.get('[data-cy=button]').click()
    cy.get('[data-cy=errorMessage]').should('be.visible')
  })
})
