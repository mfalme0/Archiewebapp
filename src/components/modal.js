import React, {useEffect, useState}from "react";
import {Button, Modal} from "react-bootstrap"
import { CiShoppingTag } from "react-icons/ci";

function doc(){
    return(
        <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered>
            <form>
                <h1> please enter the following information and management with get back to you</h1>
                <br/>
                <label>name</label>
                <input 
                type="text"
                name="name"
                placeholder="John Doe"
                required
                />
                <br/><br/>
                <label>email</label>
                <input
                type="email"
                name="email"
                placeholder="johndoe@example.com"
                required
                />
                <labe>phone</labe>
                <input
                type="tel"
                name="phone"
                placeholder="0712345689"
                required
                />
                <br/><br/>
                <label>date of acquisition</label>
                <input
                type="date"
                name="datep"
                required
                />
                <br/>
                <Button type="submit" variant="primary">
                <CiShoppingTag /> Request 
                </Button>
            </form>
        </Modal>
    )
}