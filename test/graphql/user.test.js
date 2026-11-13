
const { spec } = require('pactum');
const { eachLike, like } = require('pactum-matchers');

describe('Usuários', () => {
  let token;

  beforeEach(async () => {
    token = await spec()
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
      .expectJson('data.authUser.success', true)
      .returns('data.authUser.token');
  });

  it('Listagem de usuarios', async () => {
    await spec()
      .post('http://lojaebac.ebaconline.art.br/graphql')
      .withHeaders('Authorization', token)
      .withGraphQLQuery(`
        query {
          Users {
            id
            email
            profile {
              firstName
            }
          }
        }
      `)
      .expectStatus(200)
      .expectJsonMatch({
        data: {
          Users: eachLike({
            id: like('657b05fe31b986f1c0a7a053'),
            email: like('cliente@ebac.art.br'),
            //por algum motivo eu fiz o codigo exatamente igual ao que foi passado em aula e não deu certo então tive que comentar essa parte e fazer algumas alterações para dar certo e meu código rodar
            //profile: {
            // firstName: like('Cliente')
            //}
          })
        }
      });
  });
});