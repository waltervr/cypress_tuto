describe('Cread and mark-unmark as favorite', function(){
    it('Sign in', function(){
        cy.visit('https://react-redux.realworld.io/#/login');
        cy.title().should('eq', 'Conduit');
        cy.location('protocol').should('eq', 'https:');   
        cy.get('input[type="email"]').type('walter1@gmail.com');
        cy.get('input[type="password"]').type('12345678');
        cy.get('.btn').contains('Sign in').should('be.visible').click();
        cy.contains('Your Feed', {timeout:4000}).should('be.visible');
    });

    it('Create a post', function(){
        cy.contains('New Post').click();
        cy.hash().should('include', '#/editor');
        //cy.location('hash').should('include', '#/editor');
        cy.get('input[placeholder="Article Title"]').type('test title');
        cy.get('input[placeholder="What\'s this article about?"]').type('test summary');
        cy.get('textarea[placeholder="Write your article (in markdown)"]').type('test content');
        cy.contains('Publish Article').click();
        cy.url().should('include', 'article');
    });

    it('Mark-unmark as favorite', function(){
        cy.get('.nav-link').contains('walter1').click();
        cy.contains('My Articles').should('be.visible');
        cy.get('.ion-heart').click();
        cy.contains('Favorited Articles').click();
        cy.url().should('include', 'favorites');
        cy.get('.ion-heart').click();
        cy.reload()
        cy.contains('No articles are here... yet.').should('be.visible');
        cy.go('back');
        //cy.go(-1);
        //cy.go('forward');
        //cy.go(1);
    });
});