import Head from 'next/head'
import { useEffect, useState,useRef } from 'react'
import styles from '../styles/Home.module.css'
import { supabase } from '../utils/supabaseClient'
import { SendIcon } from '../components/Icon'

export default function Home() {


const [message,setMessage] = useState('');
const [chatlist,setChat] = useState();
const [userID,setID] = useState();
const [loading,setLoading] = useState();
const [avatar,setAvatar] = useState();
const [bubbles,setBubbles]  = useState([<></>]);
const [loggedIn,setLoggedIn] = useState(false);
const [email,setEmail] = useState('');
const [password,setPassword] = useState('');
const [name,setName] = useState('');
const [toggle,setToggle] = useState(false);


async function signInWithFacebook(){

  const {user,error} = await supabase.auth.signIn({
    provider: 'facebook',
  }).then(()=>{setLoggedIn(true)})
   
  
  
}
const eter = useRef();
async function signout() {
  const { error } = await supabase.auth.signOut().then(err=>{console.log(err)});
 
}


useEffect(()=>{


  const user = supabase.auth.user();
  if(user && user.aud === "authenticated"){
    setLoggedIn(true);
  }
  else{

  }

},[])

async function readData(){


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
    
    eter.current.scrollTop = 999999;
      if(user.email !== data.mail_address) {
      
    setBubbles((bubbles)=>[...bubbles,<><div key={data.id} className={styles.bubble_cont + " " + (userID === data.mail_address ? styles.right : styles.left)}>{data.u_avatar?<img className={styles.pp + " " + styles.re} src={data.u_avatar}></img>:<div className={styles.defAvat}>{data.mail_address.substring(0,1)}</div>}<div className={styles.chat + " " + (userID === data.mail_address ? styles.user : styles.friend)} ><div className={styles.mnmail + " " + styles.f}>{data.mail_address}</div>{data.message}</div> </div></>]) }else{

      console.log('notmatched')
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
  const { error } = await supabase.auth.signOut()
  
}
async function insertData(){
  const user = supabase.auth.user();
  eter.current.scrollTop = eter.current.scrollHeight;
  setBubbles((bubbles)=>[...bubbles,<div key={Math.random(1000)} className={styles.bubble_cont + " " + ( styles.right)}>{avatar?<img className={styles.pp + " " + styles.re} src={avatar}></img>:<div className={styles.defAvat}>{userID.substring(0,1)}</div>}<div className={styles.chat + " " + (styles.user)} ><div className={styles.mnmail + " " + styles.u}>{userID}</div>{message}</div> </div>])
  await supabase
  .from('chatsheet')
  .insert([
    { message: message, isMedia: false , mail_address : user.email, username : user.id, u_avatar : user.user_metadata.picture   },
  ]).then((response)=>{if(response.status === 201){
    
    
    
    setMessage('')}})

}
async function getUserData(){

 await supabase
  .from('chatsheet')
  .select('*').then(response=>{console.log(response.data.mail_address)})
}


async function signInwithEmail(){

 await supabase.auth.signIn({
    email: email,
    password: password,
  }).then((response)=>{console.log(response),setLoggedIn(true)});


}

async function signUpwithEmail(){

  await supabase.auth.signUp({
     email: email,
     password: password,
   },
   {
     data: {
       first_name: name,
       
     },
   }).then((response)=>{console.log(response)});
 
   
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
<div className={styles.signout}>Sign Out</div>
<div className={styles.overlay}></div>
{!loggedIn? 
<div className={styles.tools}>
  <div className={styles.toggle + " " + (toggle ? styles.active_toggle : '')} onClick={toggler}><div className={styles.signin}>SignIn</div><div className={styles.signup}>SignUp</div></div>
{toggle ? <input className={styles.input} name="full_name" type="text" value={name} onChange={e=>{setName(e.target.value)}} placeholder="Enter your Name"></input>: ''}
<input className={styles.input} name="email" type="email" value={email} onChange={e=>{setEmail(e.target.value)}} placeholder="Enter your Email"></input>
<input className={styles.input} name="password" type="password" value={password} onChange={e=>{setPassword(e.target.value)}} placeholder="Enter Password"></input>
{!toggle ? <button onClick={signInwithEmail}>Sign In</button>: ''}
{toggle ? <button onClick={signUpwithEmail}>Sign Up</button>: ''}
<h2>Or</h2>
<button onClick={signInWithFacebook}>Sign in with Facebook</button>


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
