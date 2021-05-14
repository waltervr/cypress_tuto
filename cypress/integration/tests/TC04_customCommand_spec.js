describe('Cread and mark-unmark as favorite', function () {
    
    before(function () {
        cy.SignIn();
    });

    it('Create a post', function () {
        cy.get('ul.navbar-nav').children().contains('New Post').click();
        cy.hash().should('include', '#/editor');
        cy.get('form').within(($form) => {
            cy.get('input').first().type('test title');
            cy.get('input').eq(1).type('test summary');
            cy.get('textarea').last().type('test content');
            cy.contains('Publish Article').click();
        });
        cy.url().should('include', 'article');
    });

    it('Mark-unmark as favorite', function () {
        cy.get('ul.navbar-nav').children().contains('walter1').click();
        cy.contains('My Articles').should('be.visible');
        cy.get('.ion-heart').first().click();
        cy.contains('Favorited Articles').click();
        cy.url().should('include', 'favorites');
        cy.get('.ion-heart').first().click();
        cy.reload()
        cy.contains('No articles are here... yet.').should('be.visible');
        cy.go('back');
    });
});