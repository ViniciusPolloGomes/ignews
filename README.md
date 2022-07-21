https://ignews-dusky.vercel.app/

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

### Documentation Tests

#### Introduction 
- Tests Frontend

##### Config Testing Library

Instal packages:
```
yarn add jest -D
yarn add jest-dom @testing-library/jest-dom @testing-library/dom @testing-library/react babel-jest -D
yarn add jest-environment-jsdom -D 
yarn add identity-obj-proxy -D
yarn add --dev jest typescript 
yarn add jest-mock -D
```
Create Documents:

jest.config.js

```js
module.exports = {
    testPathIgnorePatterns:["/node_modules/", "/.next/"], //Qual pastas eu quero ignorar no test
    setupFilesAfterEnv:[                            //                                     
        "<rootDir>/src/tests/setupTests.ts"          
    ],
    moduleNameMapper:{
        '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy'
    },
    transform:{                                      //parecido com Loaders no webpack, é necessario transformar os arquivos antes de executar codigo, converter com babel para que jest consiga entender esses arquivos.                                        
        '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }]
    },
    testEnvironment :'jsdom'
}

/*
Expressão regular
^   indica inicio do arquivo
.   qualquer caracter
+   significa um ou mais caracteres
\\ escapando para mudar sentido do outro ponto para sentido de ponto comum
.(as extensões do arquivo separadas por |  )
rootDir significa a pasta root do projeto ... pasta rais
*/
```

babel.config.js

```js
module.exports ={
    presets:  ['next/babel']
}
```

Create Repository src/tests/setupTest.ts
```js
import '@testing-library/jest-dom/extend-expect'
// trás funcionalidade a mais para lidar com a arvore de elementos .
```

Create First test component src/components/Header.spec.tsx
```js
import { render,screen} from '@testing-library/react'
import {Header} from '.'

jest.mock('next/router' , ()=>{
    return {
        useRouter(){
            return{
                asPath:'/'
            }
        }
    }
})
jest.mock('next-auth/client' , ()=>{
    return {
        useSession(){
            return [null,false]
        }
    }
})
describe('Header component', ()=>{ 
    it('renders correctly', () =>{
         render(
            <Header/>
        )
        expect(screen.getByText('Home')).toBeInTheDocument()
        expect(screen.getByText('Posts')).toBeInTheDocument()
    })
})

``` 

Create First test document src/tests/pages/Home.spec.tsx
```js
import {render, screen} from '@testing-library/react'
import Home , { getStaticProps } from '../../pages'
import {stripe} from '../../services/stripe'
import {mocked} from 'jest-mock'

jest.mock('next/router')
jest.mock('next-auth/client',()=>{
    return{
        useSession:()=>[null,false]
    }
})
jest.mock('../../services/stripe.ts')

describe('Home page', ()=>{
    it('renders correctly' , ()=>{
        render(
            <Home product={{ priceId: 'fake-price-id', amount : "R$10,00" }}/>)

            expect(screen.getByText("for R$10,00 month")).toBeInTheDocument()    
    });

    it('loads initial data', async ()=>{
        const retrieveStripePricesMocked = mocked(stripe.prices.retrieve)

        retrieveStripePricesMocked.mockResolvedValueOnce({
           id:'fake-price-id' ,
           unit_amount : 1000 , 
        } as any )

        const response = await getStaticProps({})

        console.log(response)

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    product:{
                        priceId: 'fake-price-id',
                        amount : '$10.00'
                    }
                }
            })
        )
    });
})
``` 

Start Test 
```
yarn jest 
```

### Commands
```
yarn create next-app --typescript

yarn add jest -D
yarn add jest-dom @testing-library/jest-dom @testing-library/dom @testing-library/react babel-jest -D
yarn add jest-environment-jsdom -D 

yarn jest

yarn add identity-obj-proxy -D

yarn add --dev jest typescript 

yarn add jest-mock -D
```

