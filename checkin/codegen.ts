import type { CodegenConfig } from '@graphql-codegen/cli'
 
const config: CodegenConfig = {
  schema: 'https://4000-anukriti6-angulargraphq-xly0mdupuvn.ws-us104.gitpod.io/newapp/checkin',
  documents: './src/app/modules/graphql/types/type.graphql',
  generates: {
    './graphql/generated.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-apollo-angular']
    }
  }
}
export default config