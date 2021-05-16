describe('Read-Write files content', () => {

    it('Write to a file', function() {
        cy.writeFile('sampleFile.txt', 'Hello World\n')
        cy.writeFile('sampleFile.txt', 'This is a demo', {flag: 'a+'})
    })

    it('Read from a file', function() {
        cy.readFile('sampleFile.txt').should('contains', 'Hello World')
    })
})