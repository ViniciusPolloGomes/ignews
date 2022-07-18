import { render,screen} from '@testing-library/react'
import {SubscribeButton} from '.'
import {useSession} from 'next-auth/client'
import {mocked} from 'jest-mock'

jest.mock('next-auth/client')


describe('SignInButton component', ()=>{ 
    
    it('renders correctly ', () =>{
        

        render(<SubscribeButton/>)
        
        expect(screen.getByText('Subscribe now')).toBeInTheDocument()
 
    })

})