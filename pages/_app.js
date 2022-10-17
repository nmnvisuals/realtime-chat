import '../styles/globals.css'
import React,{useState, useEffect} from 'react'
/* import { useRouter } from 'next/router'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { SupabaseClient } from '@supabase/supabase-js' */

function MyApp({ Component, pageProps }) {


  

    return(

   /*  <SessionContextProvider
    supabaseClient = { supabaseClient }
    initialSession = { pageProps.initialSession } > */
        <Component {...pageProps }
    />/* </SessionContextProvider > */)
}

export default MyApp