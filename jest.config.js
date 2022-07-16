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




/*Expressão regular
^   indica inicio do arquivo
.   qualquer caracter
+   significa um ou mais caracteres
\\ escapando para mudar sentido do outro ponto para sentido de ponto comum
.(as extensões do arquivo separadas por |  )
rootDir significa a pasta root do projeto ... pasta rais
*/