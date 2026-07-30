
"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

import {Application as PrismaApplication} from  '@prisma/client'

import {fetchApplications} from "../utility/fetchApplications"


type Application = Omit<PrismaApplication, 'applyDate' | 'createdAt' | 'updatedAt'> & {
  applyDate: string;
  createdAt: string;
  updatedAt: string;
};

type ApplicationContextType={
    application:Application[],
    setApplication:React.Dispatch<React.SetStateAction<Application[]>>
}


const ApplicationContext=createContext< ApplicationContextType | null>(null)

// 👇 THE PROVIDER — holds the actual state, wraps children, broadcasts the value


export  function ApplicationProvider({children}:{children:ReactNode}){
    
    const [application,setApplication]= useState<Application[]>([])
    useEffect(() => {
        async function loadApplication(){

            const data=await fetchApplications()
            setApplication(data)
        }
        loadApplication()
    },[])



    return(
        <ApplicationContext.Provider value={{application,setApplication}} >
            {children}


        </ApplicationContext.Provider>
    )



}

export function useApplication(){

const context= useContext(ApplicationContext)

if(!context){

    throw new Error("useApplication must be used within an ApplicationProvider")
}
return context

}

