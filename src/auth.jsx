import { useState} from 'react'
import { supabase } from './supabaseClient'

function Auth() {
    const [loading, setLoading ] = useState(false)
    const [email, setEmail ] = useState('')
    
const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { err } = await supabase.auth.signInWithOtp({ email })
    if(err){
        alert(err.error_description || err.message)
    }else{
        alert('Check your email for the login Link!')
    }
    setLoading(false)
}


  return (
    <>
    <div className='row flex flex-center'>
        <div className='col-6 form-widget'>
            <h1 className='header'>Welcome, Login</h1>
            <p className='description'>Sign in via link with your email below</p>
            <form className='form-widget' onSubmit={handleLogin}>
                <div>
                    <input
                    className="inputField"
                    type="email"
                    placeholder="Your Email"
                    value={email}
                    required = {true}
                    onChange ={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <button className={'button block'} disabled ={loading}>
                        {loading ? <span>Loading</span> : <span>Send Link</span>}
                    </button>
                </div>

            </form>
        </div>
    </div>
    
    
    
    
    </>
  )
}

export default Auth