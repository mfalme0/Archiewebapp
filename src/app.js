import React from "react";
import Home from "./home"
import Home2 from "./home2"
import Admin from "./admin";
import Upload from "./upload"
import Add from "./add"
import Login from "./components/password"
import ExcelReader from "./king";
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
                <Route path="/h" element={<Home/>} />
                <Route path ='/'element={<Home2/>} />
                <Route path ='/a' element={<Admin/>}/>
                <Route path ='/u' element={<ExcelReader/>}/>
                <Route path ='/add' element={<Add/>}/>
                <Route path ='/admin' element={<Login/>}/>
                <Route path ='/ping' element={<Upload/>}/>
                <Route path ='./wa' element={<Largupdate/>}/>
            </Routes>
        </Router>
    )
}
export default App