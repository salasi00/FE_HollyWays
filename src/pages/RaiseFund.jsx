import React, { useContext, useState } from 'react';
import { Card, Col, Row, Container, Stack, Button, InputGroup, Form } from 'react-bootstrap';
import { useQuery } from 'react-query';
import { API } from "../config/api"
import { useNavigate } from 'react-router-dom';
import ProgressBar from 'react-bootstrap/ProgressBar'
import Login from '../components/auth/login';
import Register from '../components/auth/register';
import {UserContext} from "../context/UserContext";
import rupiahFormat from 'rupiah-format';


function Funding() {
    let navigate = useNavigate()

    const [login, setLogin] = useState(false)
    const [register, setRegister] = useState(false)

    const [state] = useContext(UserContext)
    const { data: donation } = useQuery("DonationCache", async () => {
        const response = await API.get("/donations")
        return response.data.data
    })

    const detailDonation = (id) => {
        navigate("/detail-donation/" + id)
    }

    const [search, setSearch] = useState("")
    
    return (
        <Container >
            <Card.Title className="fw-bold fs-1 mb-3 mt-5 text-center">Donate Now</Card.Title>

            <Col md={12} className="text-end d-flex justify-content-center">
                <Col md={6}>
                    <InputGroup className=" mb-5 mt-2 shadow-2 fw-bold">
                        <Form.Control onChange={e => { setSearch(e.target.value) }}
                            placeholder="Search Here ..."
                            aria-label="Recipient's username"
                            aria-describedby="basic-addon2"
                        />

                    </InputGroup>
                </Col>

            </Col>

            <Row xs="3" className="d-flex justify-content-center gap-2">


                {donation?.filter((value) => {
                    if (search === "") {
                        return value
                    } else if (value.title.toLowerCase().includes(search.toLowerCase())) {
                        return value
                    } else if (value.user.fullname.toLowerCase().includes(search.toLowerCase())) {
                        return value
                    } else if (value.goal.includes(search)) {
                        return value
                    }
                }).map((items) => (

                    <Col xs="4" id="donate" key={items?.id}
                        className="mt-5 mb-5"
                        style={{ width: "23rem", height: "auto" }}>
                        <Card className="shadow bg-white">

                            <Card.Img 
                                src={items?.image}
                                variant="top"
                                alt="images"
                                className="w-100"
                                style={{ height: "15rem"}} />

                            < Card.Body className="py-1 px-4" >
                                {/* <Col className="mt-1 text-secondary" style={{ width: "auto" }}>
                                    Author : {"  "}
                                    <label>{items?.user?.fullname}</label>
                                </Col> */}
                                <Col className="mb-1 mt-3 py-0 fs-5 fw-bold">
                                    {items?.title}
                                </Col>
                                <Col className="my-3 py-0 text-muted">

                                    {items?.description}
                                </Col>
                                <ProgressBar 
                                    variant="danger"
                                    max={items?.goal} 
                                    now={items?.current_goal}
                                    // label={`${percent}%`}
                                    className="my-3"
                                    style={{backgroundColor:"#C4C4C4"}}
                                />
                                <Row className="d-flex mb-2">
                                    <Col className="text-dark fw-bold text-start align-self-center" style={{fontSize:"15px"}}>
                                        {rupiahFormat.convert(items?.goal)}
                                    </Col>
                                    <Col className="d-flex text-secondary mb-2 mt-1 align-self-center justify-content-end">
                                        <Button variant="danger" 
                                        className="text-light fw-bold w-75 py-0 rounded-3" 
                                        onClick={() => { state.isLogin === false ? setLogin(true) : detailDonation(items?.id) }}>Donate</Button>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                    </Col >
                ))}



            </Row >
            <Login
                show={login}
                onHide={() => setLogin(false)}
                toregister={() => { setLogin(false); setRegister(true) }}
                loginClose={setLogin}
            />
            <Register
                show={register}
                onHide={setRegister}
                tologin={() => { setRegister(false); setLogin(true) }}
            />
        </Container>

    );
}

export default Funding;