import React from "react";
import Home from "./home"
import Home2 from "./home2"
import Admin from "./admin";
import Upload from "./upload"
import Add from "./add"
import {
    BrowserRouter as Router,
    Route,
    Routes
} from "react-router-dom"
import "./style.css"
import "./app.css"
import  "bootstrap/dist/css/bootstrap.min.css"


function App(){
    return(
        <Router>
            <Routes>
                <Route path="/h" element={<Home/>} />
                <Route path ='/'element={<Home2/>} />
                <Route path ='/a' element={<Admin/>}/>
                <Route path ='/u' element={<Upload/>}/>
                <Route path ='/add' element={<Add/>}/>
            </Routes>
        </Router>
    )
}
export default App