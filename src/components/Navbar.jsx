import React, { useState } from "react"
import Container from 'react-bootstrap/Container';
import { Navbar, Nav, Button, Popover, Image, OverlayTrigger } from 'react-bootstrap';
import IconLogo from "../assets/holyways.svg"
import UserProfile from "../assets/UserProfile.png"
import RaiseFund from "../assets/raisefund.png"
import Logout from "../assets/logout.png"
import Login from "./auth/login"
import Register from "./auth/register"
import { useNavigate } from "react-router-dom";
import UserImage from "../assets/Avatar.png"

export default function NavbarComponent() {

    const [showRegister, setShowRegister] = useState(false);
    const [showLogin, setShowLogin] = useState(false);

    const handleShowLogin = () => setShowLogin(true)
    const handleShowRegister = () => setShowRegister(true)

    const [login, setLogin] = useState({
        email: "",
        password: "",
    });
    const navigate = useNavigate()
    const popover = (
        <Popover 
            id="popover-basic" 
            style={{ 
                width: "auto", 
                height: "auto", 
                fontWeight: "bold", 
                cursor: 'pointer' }}
        >

            <Popover.Body 
                className="mt-1 mb-1 py-1" 
                onClick={() => navigate(`/profile`)}
            >
                <Image src={UserProfile} alt="" style={{ width: "30px", height: "30px", marginRight: "30px", cursor: 'pointer' }} />
                Profile
            </Popover.Body>
            <Popover.Body 
                className="mt-1 mb-1 py-1" 
                onClick={() => navigate("/history")}
            >
                <Image src={RaiseFund} alt="" style={{ width: "30px", height: "30px", marginRight: "30px", cursor: 'pointer' }} />
                My Raise Fund
            </Popover.Body>
            <hr className="mt-1 mb-1 py-1" />
            <Popover.Body className="mt-1 mb-1 py-1">
                <Nav.Link
                    onClick={() => {
                        localStorage.removeItem("token")
                        navigate("/")
                    }}
                >
                    <Image src={Logout} alt="" style={{ width: "30px", height: "30px", marginRight: "30px", cursor: 'pointer' }} />
                    Logout
                </Nav.Link>
            </Popover.Body>
        </Popover>
    )
     
    return (
        <>
            <Navbar style={{ backgroundColor: "#C32424" }} className="navbar sticky-top">
                <Container fluid>
                    <Navbar.Brand href="/">
                        <img
                            src={IconLogo}
                            width="85"
                            height="50"
                            className="d-inline-block align-top ms-5 ps-2"
                            alt="Holyways"
                        />
                    </Navbar.Brand>
                    <Navbar.Brand className="ms-auto" style={{ cursor: "pointer" }}>
                        {localStorage.getItem("token") ? (
                            <OverlayTrigger
                            trigger="click"
                            rootClose
                            placement="bottom"
                            overlay={popover}
                            >
                            <Image
                                src={UserImage}
                                width={50}
                                height={50}
                                className="rounded-circle"
                            />
                            </OverlayTrigger>
                        ) : (
                            <Navbar.Brand className="me-5">
                                <Button variant="outline-white" className='text-white fw-bold px-4' onClick={handleShowLogin}>
                                    Login
                                </Button>
                                <Button 
                                    variant="light" 
                                    className="text-danger mx-3 fw-bold" 
                                    onClick={handleShowRegister}
                                >
                                    Register
                                </Button>
                            </Navbar.Brand>
                        )}
                    </Navbar.Brand>        
                </Container>
                <Login
                    login={login}
                    setLogin = {setLogin}
                    showLogin = {showLogin}
                    setShowLogin = {setShowLogin}
                    setShowRegister = {setShowRegister}
                /> 
                <Register
                    showRegister={showRegister}
                    setShowRegister={setShowRegister}
                    setShowLogin={setShowLogin}
                />
            </Navbar>
        </>
    );
}