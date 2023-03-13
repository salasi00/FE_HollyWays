import React, { useContext, useState } from "react";
import { Button, Card, Col, Container, ProgressBar, Row } from "react-bootstrap";
import { useQuery } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import rupiahFormat from "rupiah-format";
import { API } from "../config/api";
import { UserContext } from "../context/UserContext";
import DetailDonation from "./DetailDonation";

export default function History() {
    let navigate = useNavigate()

    const {data: donationUser, refetch} = useQuery("donationCache", async () => {
        const response = await API.get("donation-user")
        return response.data.data
    })

    const max = ""
    const now = ""
    const percent = max / now * 100
    const [search, setSearch] = useState("")

    return (

        <Container>
            <Row className="mt-5">
                <Col md={9} className="">
                    <Card.Title className="fw-bold fs-1 ms-4 mb-3 text-start">My Raise Funding</Card.Title>
                </Col>
                <Col md={3} className="ps-5">
                    <Button variant="danger" className="text-light fw-bold mt-2" onClick={() => navigate(`/form`)}>Make Raise Fund</Button>
                </Col>
            </Row>
            <Row xs="3" className="d-flex justify-content-start ms-2 gap-2">


                {donationUser?.map((items) => (
                    <Col xs="4" key={items?.id}
                        className="mt-5"
                        style={{ width: "23rem", height: "auto", position: "relative" }}
                    >
                        <Link 
                            to={`/detail-donation/` + items?.id}
                            className="text-decoration-none text-dark"
                            style={{cursor : "pointer"}}
                        >
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
                                    label={`${percent}%`}
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
                                        onClick={() => { DetailDonation(items?.id) }}>Donate</Button>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                        </Link>
                    </Col >



                ))}

            </Row >
        </Container>
    )
}