# Cypress Startup Project
This is a series of small test scripts to understand the usage of cypress.

## Preconditions
- VS Code Installed
- NodeJS

## 01 Setting up cypress
1. Open the terminal and run the commands below one after the other: 
- `npm init -y`
- `npm install cypress`
2. Once completed, open the Cypress Runner with `npx cypress open` and run the first test to make sure everything was setup correctly
3. If everything goes well, close the Cypress Runner and remove the cypress/integration/sample folder with all the test spec included

## 02 Add intelisense to VS Code for Cypress
1. Create a new file in the root folder of the project called `jsconfig.json`
2. Add the following code:
```
{
    "include": [
        "./node_modules/cypress",
        "cypress/**/*.js"
    ]
}
```
3. Ready, when typing `cy.` suggestions for Cypress should be displayed.

## 03 Creating the first basic script
1. Create a new folder within the integration folder (could be anything, in this case `tests`)
2. Create a new file inside that folder called `TC01_basics.spec.js` and add the following code:
```
describe('Login', function(){
    it('Sign in', function(){
        cy.visit('https://react-redux.realworld.io/#/login');
        cy.get('input[type="email"]').type('walter1@gmail.com');
        cy.get('input[type="password"]').type('12345678');
        cy.get('.btn').contains('Sign in').should('be.visible').click();
    });
});
```
3. Open the Cypress Runner with `npx cypress open` and execute the test
- Note:
- The actual code is included in the corresponding branch.

## 04 Working with URL commands
1. Add test spec inside the `tests` folder called `TC02_url.spec.js` and add the following:
```
describe('Cread and mark-unmark as favorite', function(){
    it('Sign in', function(){
        cy.visit('https://react-redux.realworld.io/#/login');
        cy.title().should('eq', 'Conduit');
        cy.location('protocol').should('eq', 'https:');   
        cy.get('input[type="email"]').type('walter1@gmail.com');
        cy.get('input[type="password"]').type('12345678');
        cy.get('.btn').contains('Sign in').should('be.visible').click();
        cy.contains('Your Feed', {timeout:4000}).should('be.visible'); //Custom flags can be added, in this case timeout
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
```
- Notes: 
  - Commented lines indicates another option to execute the same action.
  - The actual code is included in the corresponding branch.
2. Open the Cypress Runner with `npx cypress open` and execute the test
- It should work (for the most part) the first time, however, if its runned twice it would fail due to duplicate elements. This will be addressed in the next script

## 05 Identifying elements
1. Add test spec inside the `tests` folder called `TC03_identifyElements.spec.js` and add the following:
```
describe('Cread and mark-unmark as favorite', function () {
    it('Sign in', function () {
        cy.visit('https://react-redux.realworld.io/#/login');
        cy.title().should('eq', 'Conduit');
        cy.location('protocol').should('eq', 'https:');
        cy.get('form').within(($form) => { //Search for elements within another element, in this case a form.
            cy.get('input[type="email"]').type('walter1@gmail.com');
            cy.get('input[type="password"]').type('12345678');
            cy.root().submit(); //Using the submit option directly because it is a form and the button has the attribute submit.
        });
        cy.contains('Your Feed', { timeout: 4000 }).should('be.visible'); 
    });

    it('Create a post', function () {
        cy.get('ul.navbar-nav').children().contains('New Post').click(); //Accessing childs of an element directly (similar to within)
        cy.hash().should('include', '#/editor');
        cy.get('form').within(($form) => {
            cy.get('input').first().type('test title'); //Accessing the first element found within the form
            cy.get('input').eq(1).type('test summary'); //Accessing via index
            cy.get('textarea').last().type('test content'); //Accessing the last element found within the form
            cy.contains('Publish Article').click();
        });
        cy.url().should('include', 'article');
    });

    it('Mark-unmark as favorite', function () {
        cy.get('ul.navbar-nav').children().contains('walter1').click();
        cy.contains('My Articles').should('be.visible');
        cy.get('.ion-heart').first().click(); //Selecting the first instance of the elements with the same locator
        cy.contains('Favorited Articles').click();
        cy.url().should('include', 'favorites');
        cy.get('.ion-heart').first().click();
        cy.reload()
        cy.contains('No articles are here... yet.').should('be.visible');
        cy.go('back');
    });
});
```
2. Open the Cypress Runner with `npx cypress open` and execute the test
- It should work now if its run multiple times

## 06 Creating custom commands
1. Custom commands live in the `support/commands.js` file, by default there's some guidance, that can be cleared to start fresh.
2. As an example, the custom command to be added here is the login because is used in all the test scenarios
3. Add the following code:
```
Cypress.Commands.add('SignIn', () => {
    cy.visit('/#/login');
    cy.title().should('eq', 'Conduit');
    cy.location('protocol').should('eq', 'https:');
    cy.get('form').within(($form) => {
        cy.get('input[type="email"]').type('walter1@gmail.com');
        cy.get('input[type="password"]').type('12345678');
        cy.root().submit();
    });
    cy.contains('Your Feed', { timeout: 4000 }).should('be.visible');
})
```
4. Now the test spec can be updated to use the custom command. Add test spec inside the `tests` folder called `TC04_customCommand.spec.js` and add the following:
```
it('Sign in'function () {
    cy.SignIn();
});
```
5. Furthermore, because this is a precondition, it can be transformed into a setup method as below (including the full test spec):
```
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
```
6. Open the Cypress Runner with `npx cypress open` and execute the test
- It should work as before

## 07 Project configuration
1. Project configuration can be added to the `cypress.json` file in the root folder, for instance the baseURL
```
{
    "baseUrl": "https://react-redux.realworld.io"
}
```
3. Open the `commands.js` file and remove the baseURL from the visit command leaving only the path in, should look like:
```
cy.visit('/#/login');
```
- Cypress would use the global baseURL variable + the path in execution time
3. The configuration also can be added programatically. In this example, the pageLoadTimeOut can be set in the test spec as follows:
```
Cypress.config('pageLoadTimeout', 10000);
```
4. To validate the changes on the config, open the Cypress Runner via `npx cypress open` and then click on "Settings"
- The new values set via json or via code should appear

## 08 Using the THEN command
1. Add test spec inside the `tests` folder called `TC05_thenCommand.spec.js` and add the following:
```
describe('Cread and mark-unmark as favorite', function () {
    
    Cypress.config('pageLoadTimeout', 10000);

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
        cy.get('.btn-primary').first().then(($fav) =>{ //Executing an action when the element is found for validating or later usage
            const favCount = $fav.text();
            expect(parseInt(favCount)).to.eq(1);
        }).click();
        cy.reload();
        cy.contains('No articles are here... yet.').should('be.visible');
        cy.go('back');
    });
});
```
2. Open the Cypress Runner with `npx cypress open` and execute the test
- It should work as before including a new validation specifically for the element.

## 09 Working with Aliases
1. Add test spec inside the `tests` folder called `TC06_aliases.spec.js` and add the following:
```
describe('Cread and mark-unmark as favorite', function () {
    
    Cypress.config('pageLoadTimeout', 10000);

    before(function () {
        cy.SignIn();
    });

    it('Create a post', function () {
        cy.get('ul.navbar-nav').children().as('menu'); // Including the AS clause to create the alias
        cy.get('@menu').contains('New Post').click(); //Using the @ to make use of the element
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
        cy.get('.btn-primary').first().then(($fav) =>{
            return $fav.text();
        }).as('favCount'); //Save an attribute of an element for later usage
        cy.get('@favCount').then(($cnt) => {
            expect(parseInt($cnt)).to.eq(1); //Using the element and creating a validation with the result
        })
        cy.get('.btn-primary').first().click();
        cy.reload();
        cy.contains('No articles are here... yet.').should('be.visible');
        cy.go('back');
    });
});
```
2. Open the Cypress Runner with `npx cypress open` and execute the test
- It should work as before.

## 10 Running from Command line
When runnnig the test from the console, the execution will be recorded in video files
1. Run all spec files in the project: `npx cypress run` OR `npm run test`
2. Run all spec files in a specific folder: `npx cypress run --spec "cypress/integration/tests/**"` (Including * to select all files)
3. Run one spec file: `npx cypress run --spec "cypress/integration/tests/TC01_basics.spec.js"`
4. Update the `package.json` file including the `cypress run` command in the scripts section. It should look like:
```
{
  "name": "cypress_tuto",
  "version": "1.0.0",
  "description": "This is a series of small test scripts to understand the usage of cypress.",
  "main": "index.js",
  "dependencies": {
    "cypress": "^7.3.0"
  },
  "devDependencies": {},
  "scripts": {
    "test": "cypress run"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/waltervr/cypress_tuto.git"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/waltervr/cypress_tuto/issues"
  },
  "homepage": "https://github.com/waltervr/cypress_tuto#readme"
}
```
5. Test can be skipped or executed alone using the `only` and `skip` keywords in front of the spec as below:
```
describe('Cread and mark-unmark as favorite', function () {
    
    Cypress.config('pageLoadTimeout', 10000);

    before(function () {
        cy.SignIn();
    });

    it.only('Create a post', function () {
        cy.get('ul.navbar-nav').children().as('menu');
        cy.get('@menu').contains('New Post').click();
        cy.hash().should('include', '#/editor');
        cy.get('form').within(($form) => {
            cy.get('input').first().type('test title');
            cy.get('input').eq(1).type('test summary');
            cy.get('textarea').last().type('test content');
            cy.contains('Publish Article').click();
        });
        cy.url().should('include', 'article');
    });

    it.skip('Mark-unmark as favorite', function () {
        cy.get('ul.navbar-nav').children().contains('walter1').click();
        cy.contains('My Articles').should('be.visible');
        cy.get('.ion-heart').first().click();
        cy.contains('Favorited Articles').click();
        cy.url().should('include', 'favorites');
        cy.get('.btn-primary').first().then(($fav) =>{
            return $fav.text();
        }).as('favCount');
        cy.get('@favCount').then(($cnt) => {
            expect(parseInt($cnt)).to.eq(1);
        })
        cy.get('.btn-primary').first().click();
        cy.reload();
        cy.contains('No articles are here... yet.').should('be.visible');
        cy.go('back');
    });
});
```
6. Run one spec file: `npx cypress run --spec "cypress/integration/tests/TC01_basics.spec.js"` and the test will be executed according to the skip and only clauses.
7. To run the test using chrome include the `browser` flag `npx cypress run --spec "cypress/integration/tests/TC01_basics.spec.js" --browser chrome`

## 11 File upload
1. Install the file upload plugin from https://github.com/abramenal/cypress-file-upload
```
npm install --save-dev cypress-file-upload
```
2. Add the import into the `commands.js` file so that custom commands of the plugin can be used
- Add it to the begining of the file, it should look like:
```
import 'cypress-file-upload';

Cypress.Commands.add('SignIn', () => {
    cy.visit('/#/login');
    cy.title().should('eq', 'Conduit');
    cy.location('protocol').should('eq', 'https:');
    cy.get('form').within(($form) => {
        cy.get('input[type="email"]').type('walter1@gmail.com');
        cy.get('input[type="password"]').type('12345678');
        cy.root().submit();
    });
    cy.contains('Your Feed', { timeout: 4000 }).should('be.visible');
})
```
3. Create a new spec file called `TC07_plugin_uploadFiles.spec.js` and add the following
```
describe('Working with plugings', function(){

    it('File upload', function(){
        cy.visit('http://cgi-lib.berkeley.edu/ex/fup.html');
        cy.get('input[type="file"]').attachFile('SampleFile.txt');
        cy.get('input[type="submit"]').click();
        cy.contains('You\'ve uploaded a file. Your notes on the file were:');
    });
    
});
```
- Notes:
  - The file should be located in the fixtures folder
4. Open the Cypress Runner with `npx cypress open` and execute the test

## 12 Adding report generation
1. Install the following dependencies
- Mocha
```
npm install mocha --save-dev
```
- Cypress Multi Reporters
```
npm install cypress-multi-reporters --save-dev
```
- Mochawesome
```
npm install mochawesome --save-dev
```
- Mochawesome Merge
```
npm install mochawesome-merge --save-dev
```
- Mochawesome Report Generator
```
npm install mochawesome-report-generator --save-dev
```
2. Add report configuration to the `cypress.json` file as follows
```
"reporter": "cypress-multi-reporters",
    "reporterOptions": {
        "reporterEnabled": "mochawesome",
        "mochawesomeReporterOptions": {
            "reportDir": "cypress/reports/mocha",
            "quite": true,
            "overwrite": false,
            "html": false,
            "json": true
        }
    }
```
3. The plugins installed generates a new report for each test spec, to generate a single report there are a couple of commands that should be added to the script configuration when running from command line. The script object within the `package.json` file should look like:
```
"scripts": {
    "clean:reports": "(if exist cypress\\reports rmdir /s /q cypress\\reports) && mkdir cypress\\reports && mkdir cypress\\reports\\mochareports",
    "pretest": "npm run clean:reports",
    "scripts": "cypress run",
    "combine-reports": "mochawesome-merge cypress\\reports\\mocha\\*.json > cypress\\reports\\mochareports\\report.json",
    "generate-report": "marge cypress\\reports\\mochareports\\report.json -f report -o cypress\\reports\\mochareports",
    "posttest": "npm run combine-reports && npm run generate-report",
    "test": "npm run scripts || npm run posttest "
  }
```
- Before the test starts, the reports folder will be removed and created again (if exists)
- Then the test will be executed
- Once completed the reports will be combined and once combined a single HTML report will be generated
- As a side note, everything related to reports should be executed wether the test pass or fail
4. Execute the test from the terminal using `npm run test`

## 13 Adding Gherking and Cucumber
1. Install cucumber preprocessor plugin 
```
npm install cypress-cucumber-preprocessor --save-dev
```
2. Update the project configuration in the `cypress.json` file to use Gherkin "features"
```
"testFiles": "**/*.feature"
```
3. Update the `package.json` file so that cypress recognizes the Gherkin step definitions
```
"cypress-cucumber-preprocessor": {
    "nonGlobalStepDefinitions": true
}
```
4. Create a feature file within the `integration` folder called `Login.feature` and add the following:
```
Feature: Login

  I want to log into Conduit

  @smoke
  Scenario: Conduit Login
    Given I open Conduit login page
    When I type in 
        | username | password |
        | walter1@gmail.com | 12345678 |
    And I click on Sign in button
    Then "Your Feed" should be shown
```
- If VS suggest to install the Cucumber plugin, confirm and proceed to install, it would highlight the syntax
5. Create a folder for the step definitions within the `integration` folder with the same name as the feature, in this case `Login`
6. Inside this new folder create a new JS file called `login.js` (the name is no big deal here) and add the following
```
Given('I open Conduit login page', () => {
    cy.visit('https://react-redux.realworld.io/#/login');
});

When('I type in', (datatable) => {
    datatable.hashes().forEach(element => {
        cy.get('input[type="email"]').type(element.username);
        cy.get('input[type="password"]').type(element.password); 
    });
});

When('I click on Sign in button', () => {
    cy.get('.btn').contains('Sign in').should('be.visible').click();
});

Then('{string} should be shown', (content) => {
    cy.contains(content, {timeout:10000}).should('be.visible');
});
```
7. Open the Cypress Runner with `npx cypress open` and now only the "feature" files will be displayed due to the configuration change.
8. Execute the test
- TAGS can be added to the scenarios such as @smoke or anything else, so that in the future only scenarios with those tags are executed, the command line expression would be
```
npx cypress-tags run -e TAGS='@smoke'
```
- Also, some tags can be skipped
```
npx cypress-tags run -e TAGS='not @smoke'
```
- A combination of conditions can be added
```
npx cypress-tags run -e TAGS='@smoke and not @ui'
```
- Only a specific scenario can be executed when using the reserved flag 'focus'
```
npx cypress-tags run -e TAGS='@focus'
```

## 14 API Testing
1. Create a new spec file called `TC08_api.spec.js` and add the following:
```
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
```
2. Before opening and executing the test, it is required to remove the Gherkin config from the `cypress.json` file, otherwise the test will not be displayed (remember that setting enables visibility of the .feature files only)
- Updating the name of the property will also make the trick.
3. Open the Cypress Runner with `npx cypress open` and execute the test

## 15 Including Page Object Model
1. Create a new folder for the page objects called `pageObjects` within the `integration` folder
2. Inside that new folder, create a new file called `login.js` and add the following
```
class login {
    email() {
        return cy.get('input[type="email"]')
    }
    password(){
        return cy.get('input[type="password"]')
    }
    signInButton(){
        cy.get('.btn').contains('Sign in')
    }
}
export default login
```
- A new class is created and every element becomes a stub that can be called from the test files for interaction
- At the end, the `export` command is added so that is visible in the spec
3. Create a new test spec called `TC09_pom.spec.js` and add the following:
```
import Login from '../pageObjects/login'

describe('Login', function(){
    const login = new Login()

    it('Sign in', function(){
        cy.visit('https://react-redux.realworld.io/#/login');
        login.email().type('walter1@gmail.com');
        login.password().type('12345678');
        login.signInButton().should('be.visible').click();
    });
});
```
- Where:
  - The class is imported at the begining
  - An instance is created at the "suite" level
  - Instead of searching for the element, is directly called from the instance and used
4. Open the Cypress Runner with `npx cypress open` and execute the test

## 16 Working with fixtures
1. Add a new file that will save the user details within the `fixtures` folder called `userLoginDetails.json` and add the following:
```
{
    "email": "'walter1@gmail.com",
    "password" : "12345678"
}
```
2. Create a new test spec file called `TC01_fixtureFiles.spec.js` and add the following:
```
/* USING THEN COMMAND
describe('Login', function(){
    it('Sign in', function(){
        cy.visit('https://react-redux.realworld.io/#/login');
        cy.fixture('userLoginDetails').then((user)=> {
            cy.get('input[type="email"]').type(user.email);
            cy.get('input[type="password"]').type(user.password);
        })
        cy.get('.btn').contains('Sign in').should('be.visible').click();
    });
}); */

/* USING A GLOBAL VARIABLE
describe('Login', function () {
    let userDetails
    beforeEach(function () {
        cy.fixture('userLoginDetails').then((user) => {
            userDetails = user
        })
    })
    it('Sign in', function () {
        cy.visit('https://react-redux.realworld.io/#/login');
        cy.get('input[type="email"]').type(userDetails.email);
        cy.get('input[type="password"]').type(userDetails.password);
        cy.get('.btn').contains('Sign in').should('be.visible').click();
    });
}); */

// USING ALIAS
describe('Login', function () {

    beforeEach(function () {
        cy.fixture('userLoginDetails').as('user');
    })
    it('Sign in', function () {
        cy.visit('https://react-redux.realworld.io/#/login');
        cy.get('input[type="email"]').type(this.user.email);
        cy.get('input[type="password"]').type(this.user.password);
        cy.get('.btn').contains('Sign in').should('be.visible').click();
    });
});
```
- The commented tests are the same just with a differnt approach to read and use the file variables.
3. Open the Cypress Runner with `npx cypress open` and execute the test

## 17 Reading and writing from/to a file
1. Create a new test spec file called `TC11_readWriteFile.spec.js` and add the following
```
describe('Read-Write files content', () => {

    it('Write to a file', function() {
        cy.writeFile('SampleFile.txt', 'Hello World\n')
        cy.writeFile('SampleFile.txt', 'This is a demo', {flag: 'a+'}) //a+ flag means append
    })

    it('Read from a file', function() {
        cy.readFile('SampleFile.txt').should('contains', 'Hello World')
    })
})
```
2. Open the Cypress Runner with `npx cypress open` and execute the test
