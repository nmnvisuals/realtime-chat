import Head from 'next/head'
import { useEffect, useState,useRef } from 'react'

import {useRouter} from 'next/router'
import styles from '../styles/Home.module.css'
import { supabase } from '../utils/supabaseClient'
import { SendIcon } from '../components/Icon'
import { useUser, useSessionContext } from '@supabase/auth-helpers-react'
import Loader from '../components/Loader'

export default function Home() {


const [message,setMessage] = useState('');
const [chatlist,setChat] = useState();
const [userID,setID] = useState();
const [isError,setError] = useState();
const [loading,setLoading] = useState();
const [avatar,setAvatar] = useState();
const [bubbles,setBubbles]  = useState([<></>]);
const [loggedIn,setLoggedIn] = useState(false);
const [email,setEmail] = useState('');
const [password,setPassword] = useState('');
const [name,setName] = useState('');
const [isLoading,setIsLoading] = useState('');
const [toggle,setToggle] = useState(false);
/* const { isLoading, session, error, supabaseClient } = useSessionContext()
  
  */
 /*  const userR = supabase.auth.session(); */
 const router = useRouter();
async function signInWithFacebook(){
  setLoading(true)
  const {user,error} = await supabase.auth.signIn({
    provider: 'facebook',
  })

  if(user){
    setLoggedIn(true)
    setLoading(false)
    router.push('/');
  }

  else if(error){
    setError(error.message)
    setLoading(false)
  }

  else{
    setLoggedIn(false);
    setLoading(false)
  }
   
  
  
}


const eter = useRef();
async function signout() {
  const { error } = await supabase.auth.signOut();
 
}


useEffect(()=>{

 
const user = supabase.auth.user();
 
  if(user && user.aud === "authenticated"){
    setLoggedIn(true);

  }
  else{
router.push('/')
  }

},[])


supabase.auth.onAuthStateChange((event, session) => {
      
  const user = session?.user || null;
if(user){
  setLoggedIn(true)
}else{
  setLoggedIn(false)
}
  // Save your user to your desired location
  
});


async function readData(){

setIsLoading(true)
  await supabase
  .from('chatsheet')
  .select('*').order('id', { ascending: false }).limit(6).then(response => {setChat(response.data)})
 }
 function subc(email){

  const user = supabase.auth.user();
 
  supabase
  .from('chatsheet')
  .on('INSERT', payload => {
    const data = payload.new;
    setIsLoading(false)
    eter.current.scrollTop = 999999;
      if(user.email !== data.mail_address) {
      
    setBubbles((bubbles)=>[...bubbles,<><div key={data.id} className={styles.bubble_cont + " " + (userID === data.mail_address ? styles.right : styles.left)}>{data.u_avatar?<img className={styles.pp + " " + styles.re} src={data.u_avatar}></img>:<div className={styles.defAvat}>{data.mail_address.substring(0,1)}</div>}<div className={styles.chat + " " + (userID === data.mail_address ? styles.user : styles.friend)} ><div className={styles.mnmail + " " + styles.f}>{data.mail_address}</div>{data.message}</div> </div></>]) }else{

      
    }
  })
  .subscribe()
}
useEffect(()=>{


if(loggedIn){

   readData();

   
   const user = supabase.auth.user();
   setID(user.email);
   setAvatar(user.user_metadata.avatar_url);
   subc();
  }


},[loggedIn])

async function signOut(){
  
  const { error } = await supabase.auth.signOut().then(()=>{
    router.reload();
  })
  
  
}
async function insertData(){
  setIsLoading(true)
  const user = supabase.auth.user();
  eter.current.scrollTop = eter.current.scrollHeight;
  setBubbles((bubbles)=>[...bubbles,<div key={Math.random(1000)} className={styles.bubble_cont + " " + ( styles.right)}>{avatar?<img className={styles.pp + " " + styles.re} src={avatar}></img>:<div className={styles.defAvat}>{userID.substring(0,1)}</div>}<div className={styles.chat + " " + (styles.user)} ><div className={styles.mnmail + " " + styles.u}>{userID}</div>{message}</div> </div>])
  await supabase
  .from('chatsheet')
  .insert([
    { message: message, isMedia: false , mail_address : user.email, username : user.id, u_avatar : user.user_metadata.picture   },
  ]).then((response)=>{if(response.status === 201){
    
    setIsLoading(false)
    
    setMessage('')}
  
  else{
    setIsLoading(false)
  }
  })

}
async function getUserData(){
  setIsLoading(true)
 await supabase
  .from('chatsheet')
  .select('*').then(response=>{
    setIsLoading(false)
  })
}


async function signInwithEmail(){
  setIsLoading(true)
 const {user,session,error} = await supabase.auth.signIn({
    email: email,
    password: password,
  })

  if(user || session){
    setLoggedIn(true)
    setIsLoading(false)
  }
  else if(error){
    
    setError(error.message)
    setIsLoading(false)
  }
  else{
    setIsLoading(false)
  }


}

async function signUpwithEmail(){
  setIsLoading(true)
  const {user,session,error} = await supabase.auth.signUp({
     email: email,
     password: password,
   },
   {
     data: {
       first_name: name,
       
     },
   })

   if(user || session){
    setError('Sent Confirmation Email, Confirm then Login');
    setIsLoading(false)
  }
  else if(error){
    if(error.status == 429){
    setError('Email already exists')
      
    }else{
    
    setError(error.message)}
    setIsLoading(false)
  }
  else{
    setIsLoading(false)
  }

 
   
 }

 function toggler(){

  if(!toggle){
    setToggle(true)
  }else{
    setToggle(false);
  }

 }


  return (
    <div className={styles.container + " " + (loggedIn? '' : styles.logged)}>
      <Head>
        <title>SIMP Chat</title>
        <meta name="description" content="Simple Chat for Certified SIMPS" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
<img src="/sc-logo.svg" className={styles.head_logo} />
<div className={styles.signout} onClick={signOut}>Sign Out</div>
<div className={styles.overlay}></div>
{!loggedIn? 
<div className={styles.tools}>


<button className={styles.fb} onClick={signInWithFacebook}>
<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
width="30" height="30"
viewBox="0 0 30 30"
fill='#fff'>    <path d="M15,3C8.373,3,3,8.373,3,15c0,6.016,4.432,10.984,10.206,11.852V18.18h-2.969v-3.154h2.969v-2.099c0-3.475,1.693-5,4.581-5 c1.383,0,2.115,0.103,2.461,0.149v2.753h-1.97c-1.226,0-1.654,1.163-1.654,2.473v1.724h3.593L19.73,18.18h-3.106v8.697 C22.481,26.083,27,21.075,27,15C27,8.373,21.627,3,15,3z"></path></svg>
  
  Sign in with Facebook</button>
<h2>Or</h2>
  <div className={styles.toggle + " " + (toggle ? styles.active_toggle : '')} onClick={toggler}><div className={styles.signin}>SignIn</div><div className={styles.signup}>SignUp</div></div>
{toggle ? <input className={styles.input} name="full_name" type="text" value={name} onChange={e=>{setName(e.target.value),setError()}} placeholder="Enter your Name"></input>: ''}
<input className={styles.input} name="email" type="email" value={email} onChange={e=>{setEmail(e.target.value),setError()}} placeholder="Enter your Email"></input>
<input className={styles.input} name="password" type="password" value={password} onChange={e=>{setPassword(e.target.value),setError()}} placeholder="Enter Password"></input>
<Loader loader={isLoading}/>
{isError ? <p className={styles.error}>{isError}</p>:''}
{!toggle ? <button onClick={signInwithEmail}>Sign In</button>: ''}
{toggle ? <button onClick={signUpwithEmail}>Sign Up</button>: ''}



</div>
: ''}

<div className={styles.chatcont} ref={eter}>
{chatlist && chatlist.slice(0).reverse().map((chat,index) => {
  
return (<div data-id={chat.id} className={styles.bubble_cont + " " + (userID === chat.mail_address ? styles.right : styles.left)}>{chat.u_avatar?<img className={styles.pp} src={chat.u_avatar}></img>:<div className={styles.defAvat}>{chat.mail_address.substring(0,1)}</div>}<div className={styles.chat + " " + (userID === chat.mail_address ? styles.user : styles.friend)} ><div className={styles.mnmail + " " + (userID === chat.mail_address ? styles.u : styles.f)}>{chat.mail_address}</div>{chat.message}</div></div>)
})} {bubbles} </div>

<div className={styles.input_wrapper}>
<input className={styles.input} name="message" type="text" value={message} onChange={e=>{setMessage(e.target.value)}} placeholder="Write your Message..."></input>
<button onClick={insertData} disabled={message && message.replaceAll(" ","").length > 0 ? false : true } className={styles.sendbtn} ><SendIcon/></button></div>
    </div>
  )
}
