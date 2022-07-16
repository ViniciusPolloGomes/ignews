import { render,screen} from '@testing-library/react'
import {SignInButton} from '.'

jest.mock('next-auth/client' , ()=>{ // virtualização da função
    return {
        useSession(){
            return [null,false]
        }
    }
})


describe('SignInButton component', ()=>{ 
    
    it('renders correctly when user is not authenticated', () =>{
         const {debug} = render(
            <SignInButton/>
        )
        debug()
        expect(screen.getByText('Sign in with Github')).toBeInTheDocument()
 
    })

})