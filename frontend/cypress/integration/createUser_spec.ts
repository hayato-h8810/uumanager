describe('ユーザー作成テスト', () => {
  beforeEach(() => {
    Cypress.Cookies.preserveOnce('_session_id')
  })
  before(() => {
    cy.visit('/')
  })
  it('ユーザー作成画面に移動', () => {
    cy.contains('ユーザー新規作成').click()
    cy.url().should('include', '/createUser')
  })
  it('ユーザーを作成', () => {
    cy.get('[data-cy=name]').type('test').should('have.value', 'test')
    cy.get('[data-cy=email]').type('test@example.com').should('have.value', 'test@example.com')
    cy.get('[data-cy=password]').type('testpassword').should('have.value', 'testpassword')
    cy.get('[data-cy=confirmPassword]').type('testpassword').should('have.value', 'testpassword')
    cy.get('[data-cy=button]').click()
    cy.wait(15000)
    cy.url().should('match', /http:\/\/localhost:8000\/\d+/)
  })
  it('ユーザー削除', () => {
    cy.get('[data-cy=openModal]').click()
    cy.get('[data-cy=password]').type('testpassword').should('have.value', 'testpassword')
    cy.get('[data-cy=deleteUserButton]').click()
    cy.url().should('not.match', /http:\/\/localhost:8000\/\d+/)
  })
})

describe('バリデーションテスト', () => {
  before(() => {
    cy.visit('/')
    cy.contains('ユーザー新規作成').click()
    cy.url().should('include', '/createUser')
  })
  it('未入力の場合、エラーメッセージが表示', () => {
    cy.get('[data-cy=button]').click()
    cy.get('[data-cy=errorMessage]').should('be.visible')
  })
  it('パススワードが6文字以下の場合、エラーメッセージを表示', () => {
    cy.get('[data-cy=name]').type('test').should('have.value', 'test')
    cy.get('[data-cy=email]').type('test@example.com').should('have.value', 'test@example.com')
    cy.get('[data-cy=password]').type('t').should('have.value', 't')
    cy.get('[data-cy=confirmPassword]').type('t').should('have.value', 't')
    cy.get('[data-cy=button]').click()
    cy.get('[data-cy=errorMessage]').should('be.visible')
  })
  it('確認用パスワードが一致しなかった場合、エラーメッセージを表示', () => {
    cy.get('[data-cy=password]').clear().type('testpassword').should('have.value', 'testpassword')
    cy.get('[data-cy=button]').click()
    cy.get('[data-cy=errorMessage]').should('be.visible')
  })
  it('メールアドレスの形式が無効な値だった場合、エラーメッセージを表示', () => {
    cy.get('[data-cy=email]').clear().type('test').should('have.value', 'test')
    cy.get('[data-cy=confirmPassword]').clear().type('testpassword').should('have.value', 'testpassword')
    cy.get('[data-cy=button]').click()
    cy.get('[data-cy=errorMessage]').should('be.visible')
  })
})

describe('サーバーエラーテスト', () => {
  beforeEach(() => {
    Cypress.Cookies.preserveOnce('_session_id')
  })
  before(() => {
    cy.visit('/')
    cy.contains('ユーザー新規作成').click()
    cy.url().should('include', '/createUser')
    cy.get('[data-cy=name]').type('test').should('have.value', 'test')
    cy.get('[data-cy=email]').type('test@example.com').should('have.value', 'test@example.com')
    cy.get('[data-cy=password]').type('testpassword').should('have.value', 'testpassword')
    cy.get('[data-cy=confirmPassword]').type('testpassword').should('have.value', 'testpassword')
    cy.get('[data-cy=button]').click()
    cy.wait(15000)
    cy.url().should('match', /http:\/\/localhost:8000\/\d+/)
  })
  it('ログイン済みの場合、エラーメッセージを表示', () => {
    cy.visit('/createUser')
    cy.get('[data-cy=name]').type('test').should('have.value', 'test')
    cy.get('[data-cy=email]').type('test2@example.com').should('have.value', 'test2@example.com')
    cy.get('[data-cy=password]').type('testpassword').should('have.value', 'testpassword')
    cy.get('[data-cy=confirmPassword]').type('testpassword').should('have.value', 'testpassword')
    cy.get('[data-cy=button]').click()
    cy.get('[data-cy=serverErrorMessage]').should('be.visible')
  })
  it('ユーザー削除', () => {
    cy.get('[data-cy=moveToUserHomeButton]').click()
    cy.url().should('match', /http:\/\/localhost:8000\/\d+/)
    cy.get('[data-cy=openModal]').click()
    cy.get('[data-cy=password]').type('testpassword').should('have.value', 'testpassword')
    cy.get('[data-cy=deleteUserButton]').click()
    cy.url().should('not.match', /http:\/\/localhost:8000\/\d+/)
  })
  it('メールアドレスが登録済みの場合、エラーメッセージを表示', () => {
    cy.visit('/createUser')
    cy.get('[data-cy=name]').type('test').should('have.value', 'test')
    cy.get('[data-cy=email]').type('hoge@example.com').should('have.value', 'hoge@example.com')
    cy.get('[data-cy=password]').type('testpassword').should('have.value', 'testpassword')
    cy.get('[data-cy=confirmPassword]').type('testpassword').should('have.value', 'testpassword')
    cy.get('[data-cy=button]').click()
    cy.get('[data-cy=serverErrorMessage]').should('be.visible')
  })
})
