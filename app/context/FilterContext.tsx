"use client"
import { createContext, useCallback, useContext } from "react";
import { useState,useMemo } from "react";

type FilterState = {
 filters:{
    isFollowUp:boolean,
    isWeekly:boolean
 },
 toggleFilter:(key:keyof FilterState["filters"])=>void  
 }




const FilterContext=createContext<FilterState | null>(null)

export function FilterProvider({children}:{children:React.ReactNode}){

const [filters,setFilters]=useState({
    isFollowUp:false,
    isWeekly:false,
    
})
const toggleFilter=useCallback((key:keyof typeof filters)=>{
    setFilters(prev=>({...prev,[key]:!prev[key]}))
},[])

const value= useMemo(()=>({
    filters,toggleFilter }),[filters])



return(
    <FilterContext.Provider value={value} >
        {children}
    </FilterContext.Provider>
)



}

export const useFilters=()=>{
    const context=useContext(FilterContext)
    if(!context){
        throw new Error("useFilters must be used within a FilterProvider")
    }
    return context
}




















