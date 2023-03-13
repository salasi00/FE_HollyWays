import React, { useContext, useState } from "react"
import { Alert, Button, Card, Form, Modal } from "react-bootstrap"
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext"
import { API } from "../../config/api";

export default function Login(props) {
    const handleClose = () => props.setShowLogin(false)
    const [state, dispatch] = useContext(UserContext);
    const [message, setMessage] = useState(null);


    const handleChange = (e) => {
       props.setLogin({
        ...props.login,
        [e.target.name]: e.target.value
       })
    }
    const redirectRegister = (e) => {
        props.setShowLogin(false);
        props.setShowRegister(true);
    }
    const navigate = useNavigate();

    const handleLogin = useMutation(async (e) => {
    try{
        e.preventDefault();

        const response = await API.post("/login", props.login);

        if (response.data.code === 200){
            dispatch({
                type: "LOGIN_SUCCESS",
                payload: response.data.data,
            });
            <Alert variant="success" className="py-1">
                Login success!
            </Alert>
            props.setShowLogin(false);
            props.setLogin(true)
            navigate("/")
        } else {
            <Alert variant="danger" className="py-1">
                Login Failed!
            </Alert>
        }
    }catch(error){
        console.log(error)
        props.setShowLogin(true);
}
})
    
    return (
        <>
            <Modal
                show={props.showLogin} 
                onHide={handleClose} 
                size="sm p-1"
                aria-labelledby="contained-modal-title-center"
                centered
            >

                <Form.Label className="fs-3 mt-0 mb-3 fw-bold text-center">
                    Login
                </Form.Label>
                <Card className="px-3 fw-bold border border-white">

                    <Form onSubmit={(e) => handleLogin.mutate(e)}>
                        {message && message}
                        <Form.Group className="mb-2" controlId="formBasicEmail">
                            <Form.Label>Email </Form.Label>

                            <Form.Control
                                className="py-1 fs-6"
                                style={{ borderWidth: "2px", borderColor: "grey", backgroundColor: "#E5E5E5" }}
                                type="text"
                                placeholder="Email"
                                name="email"
                                value={props.email}
                                onChange={handleChange}
                                required


                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password </Form.Label>

                            <Form.Control
                                className="py-1 fs-6"
                                style={{ borderWidth: "2px", borderColor: "grey", backgroundColor: "#E5E5E5" }}
                                name="password"
                                type="password"
                                placeholder="Password"
                                value={props.password}
                                onChange={handleChange}
                                required

                            />
                        </Form.Group>
                        <Button
                            variant="danger"
                            className="w-100 d-grid gap-2 mt-4 fw-bold"
                            size="md"
                            type="submit"
                        >
                            Login
                        </Button>
                        <Form.Group>
                            <Form.Label
                                className="mt-4 text-secondary"
                            >
                                Don't have an account ? Klik 
                            </Form.Label> 
                            <Form.Label
                                onClick={redirectRegister} 
                                className="fw-bold text-dark text-decoration-none" 
                                style={{ cursor: "pointer" }}
                            > 
                                Here 
                            </Form.Label> 
                        </Form.Group>
                    </Form>

                </Card>

            </Modal >
        </>
    )
}
