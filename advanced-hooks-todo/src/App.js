import React ,{useReducer,useContext,useEffect,useRef}from 'react';
import './App.css';
const dispatchReducer = (state,action)=>{
  if(action.type === 'ADD'){
    return[
      ...state,
      {
      id:Math.random(),
      text:'',
      completed : false
      }
    ]
  }
  if(action.type === 'DELETE'){
    return state.filter(item=> item.id !== action.payload)
    
  }
  if(action.type === 'RESET'){
    return action.payload
    
  }
  if(action.type=== 'COMPLETED'){
    return state.map(item =>{
      if(item.id === action.payload){
        return{
          ...item,
          completed : !item.completed
        }
      }
      return item
    })
  }
  return state
}
function useEffectOnce(callback){
  const didRun = useRef(false)
  useEffect(()=>{
    if(!didRun.current){
      callback()
      didRun.current = true
    }
   
  })
}
const context = React.createContext()
function App() {
  
  const [state,dispatch]= useReducer(dispatchReducer,[])
  useEffectOnce(()=>{
    const raw = localStorage.getItem('data')
      dispatch({type:'RESET',payload:JSON.parse(raw)})
  })
  useEffect(()=>{
    localStorage.setItem('data',JSON.stringify(state))
  })
  return (
    <context.Provider value={dispatch}>
      <div className="App">
     <h1>Todo Application using Hooks</h1>
     <button onClick={()=>dispatch({type:'ADD'})}>Todo's now</button>
     <br/> <br/> <br/>
     <TodoList items={state}/>
     
    </div>
    </context.Provider>
    
  );
}
function TodoList({items}){
  return(
    items.map(item=><Todo key={item.id} {...item}/>)
   
  )
 
}
function Todo({id,completed,text}){
  const dispatch = useContext(context)
  return(
    <div>
    <input type="checkbox" checked={completed} onChange={()=>dispatch({type:'COMPLETED',payload:id})}/>
    <input type="text" defaultValue={text}/> 
    <button onClick={()=>dispatch({type:'DELETE',payload:id})}>Delete</button>
     </div>
    
  )
 
}
export default App;
