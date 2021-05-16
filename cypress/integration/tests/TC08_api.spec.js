describe('API Testing', () => {

    Cypress.config('baseUrl', 'http://dummy.restapiexample.com/api/v1')

    it('GET - read', () => {
        cy.request('/employees').then((response) => {
            expect(response).to.have.property('status', 200);
            expect(response.body).to.not.be.null;
            //expect(response.body.data).to.have.length(1);
        });
    });

    it('POST - create', () => {
        const employee = {"name":"walter1","salary":"123","age":"23"}
        cy.request('POST','/create', employee)
        .its('body')
        .its('data')
        .should('include', {name:'walter1'})
    })

    it('PUT - update', () => {
        const emp1 = {"salary":"222"}
        cy.request('PUT', 'update/9489', emp1)
        .its('status')
        .should('eq', 200)
    })
});