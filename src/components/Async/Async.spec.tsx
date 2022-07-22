import {render,screen, waitForElementToBeRemoved} from '@testing-library/react'
import { Async } from './index';

test('it renders correctly',async ()=>{
    render (<Async/>)

    expect (screen.getByText('Hello World')).toBeInTheDocument()

    await waitForElementToBeRemoved(screen.queryByText('Button'))
    
})
 

//findByText ele espera algo acontecer por um periodo de tempo , para depois retornar o resultado do teste

//waitFor fica observando até elemento desejado aparecer em tela  para testar e retornar resultado do teste. 
/* 
await waitFor(()=>{
    return expect(screen.getByText('Button')).toBeInTheDocument()
})
*/
/*


 waitForElementToBeRemoved ele fica observando para identificar se o elemento ficara invisível, ou seja , ele aguarda a remoção do elemento.


screen.logTestingPlaygroundURL()      gera link da plataforma de test , ajuda a testar componentes de varias formas possiveis ,  gera codigo automatico de como pode ser o teste.
use esse comando apos a rendferização.
*/
 