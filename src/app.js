import React from "react";
import Home2 from "./home2"
import Login from "./login";
import {
    BrowserRouter as Router,
    Route,
    Routes
} from "react-router-dom"
import "./style.css"
import "./app.css"
import  "bootstrap/dist/css/bootstrap.min.css"
import Largupdate from './localupload'


function App(){
    return(
        <Router>
            <Routes>
                <Route path ='/'element={<Home2/>} />
                <Route path ='/admin' element={<Login/>}/>
             
            </Routes>
        </Router>
    )
}
export default App