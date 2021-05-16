describe('Working with plugings', function(){

    it('File upload', function(){
        cy.visit('http://cgi-lib.berkeley.edu/ex/fup.html');
        cy.get('input[type="file"]').attachFile('SampleFile.txt');
        cy.get('input[type="submit"]').click();
        cy.contains('You\'ve uploaded a file. Your notes on the file were:');
    });
    
});