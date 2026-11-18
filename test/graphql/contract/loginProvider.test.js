const { reporter, flow } = require('pactum');
const pf = require('pactum-flow-plugin');

function addFlowReporter() {
    pf.config.url = 'http://localhost:8080';
    pf.config.projectId = 'lojaebac-api';
    pf.config.projectName = 'Loja EBAC api';
    pf.config.version = '1.0.0';
    pf.config.username = 'scanner';
    pf.config.password = 'scanner';

    reporter.add(pf.reporter);
}

// global before
before(async () => {
    addFlowReporter();
});

// global after
after(async () => {
    await reporter.end();
});

it('api - Deve autenticar o usuário corretamente', async () => {
    await flow("Login")
        .post('http://lojaebac.ebaconline.art.br/graphql')
        .withGraphQLQuery(`
            mutation AuthUser ($email: String, $password: String) {
                authUser(email: $email, password: $password) {
                    success
                    token
                }
            }
        `)
        .withGraphQLVariables({
            email: 'admin@admin.com',
            password: 'admin123'
        })
        .expectStatus(200)
        .expectJson('data.authUser.success', true);
});